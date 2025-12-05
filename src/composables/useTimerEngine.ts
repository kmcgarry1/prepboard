import { type Ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import type { AccentOption, NewTimerPayload, TimerItem } from '../types'
import { useTimerDerived } from './useTimerDerived'

type TimerEngineOptions = {
  timers: Ref<TimerItem[]>
  accentOptions: AccentOption[]
  defaultAccent: AccentOption
  clearRepeat: (id: string) => void
  announceCompletion: (timer: TimerItem, options?: { isRepeat?: boolean }) => void
  pruneDelayMs: number
  noteInteraction: () => void
}

export const useTimerEngine = ({
  timers,
  accentOptions,
  defaultAccent,
  clearRepeat,
  announceCompletion,
  pruneDelayMs,
  noteInteraction,
}: TimerEngineOptions) => {
  const pruneDoneTimers = (now: number) => {
    timers.value = timers.value.filter((timer) => {
      if (timer.status !== 'done' || !timer.completedAt) return true
      const keep = now - timer.completedAt < pruneDelayMs
      if (!keep) clearRepeat(timer.id)
      return keep
    })
  }

  const cleaner = useIntervalFn(() => pruneDoneTimers(Date.now()), 30_000, { immediate: true })

  const ticker = useIntervalFn(() => {
    const now = Date.now()
    let active = false

    timers.value.forEach((timer) => {
      if (timer.isRunning && timer.status === 'running') {
        active = true
        const elapsed = timer.lastUpdated ? now - timer.lastUpdated : 0
        timer.remainingMs = Math.max(0, timer.remainingMs - elapsed)
        timer.lastUpdated = now

        if (timer.remainingMs <= 0) {
          timer.remainingMs = 0
          timer.status = 'done'
          timer.isRunning = false
          timer.lastUpdated = undefined
          if (!timer.notified) announceCompletion(timer)
        }
      }
    })

    pruneDoneTimers(now)

    if (!active) ticker.pause()
  }, 250, {
    immediate: false,
  })

  const resyncTimers = () => {
    const now = Date.now()
    let hasActive = false
    timers.value.forEach((timer) => {
      if (timer.status === 'running') {
        const elapsed = now - (timer.lastUpdated ?? now)
        timer.remainingMs = Math.max(0, timer.remainingMs - elapsed)
        timer.lastUpdated = now
        if (timer.remainingMs <= 0) {
          timer.remainingMs = 0
          timer.status = 'done'
          timer.isRunning = false
          timer.lastUpdated = undefined
          if (!timer.notified) announceCompletion(timer)
        } else {
          hasActive = true
        }
      }
    })
    if (hasActive) ticker.resume()
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      resyncTimers()
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibilityChange)
  }

  const addTimerFromPayload = (payload: NewTimerPayload) => {
    noteInteraction()
    const totalMs = (Number(payload.minutes) * 60 + Number(payload.seconds)) * 1000
    if (!Number.isFinite(totalMs) || totalMs <= 0) return

    const accent = accentOptions.find((option) => option.id === payload.accentId) ?? defaultAccent
    const timer: TimerItem = {
      id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
      label: payload.label.trim() || 'Untitled timer',
      durationMs: totalMs,
      remainingMs: totalMs,
      status: 'idle',
      isRunning: false,
      accent,
      createdAt: Date.now(),
      notified: false,
    }
    timers.value = [timer, ...timers.value]
  }

  const startTimer = (id: string) => {
    noteInteraction()
    const timer = timers.value.find((item) => item.id === id)
    if (!timer || timer.remainingMs <= 0) return
    clearRepeat(timer.id)
    timer.isRunning = true
    timer.status = 'running'
    timer.lastUpdated = Date.now()
    ticker.resume()
  }

  const pauseTimer = (id: string) => {
    noteInteraction()
    const timer = timers.value.find((item) => item.id === id)
    if (!timer) return
    timer.isRunning = false
    timer.status = 'paused'
    timer.lastUpdated = undefined
    if (!timers.value.some((item) => item.isRunning)) ticker.pause()
  }

  const resetTimer = (id: string) => {
    noteInteraction()
    const timer = timers.value.find((item) => item.id === id)
    if (!timer) return
    timer.isRunning = false
    timer.status = 'idle'
    timer.remainingMs = timer.durationMs
    timer.lastUpdated = undefined
    timer.notified = false
    timer.completedAt = undefined
    clearRepeat(timer.id)
    if (!timers.value.some((item) => item.isRunning)) ticker.pause()
  }

  const removeTimer = (id: string) => {
    noteInteraction()
    clearRepeat(id)
    timers.value = timers.value.filter((timer) => timer.id !== id)
    if (!timers.value.some((item) => item.isRunning)) ticker.pause()
  }

  const clearDone = () => {
    noteInteraction()
    timers.value.forEach((timer) => {
      if (timer.status === 'done') clearRepeat(timer.id)
    })
    timers.value = timers.value.filter((timer) => timer.status !== 'done')
    if (!timers.value.some((item) => item.isRunning)) ticker.pause()
  }

  const derived = useTimerDerived(timers)

  const disposeEngine = () => {
    ticker.pause()
    cleaner.pause()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }

  return {
    timers,
    ...derived,
    addTimerFromPayload,
    startTimer,
    pauseTimer,
    resetTimer,
    removeTimer,
    clearDone,
    pruneDoneTimers,
    resumeTicker: () => ticker.resume(),
    resyncTimers,
    disposeEngine,
  }
}

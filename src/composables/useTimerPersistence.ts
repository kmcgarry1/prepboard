import { watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Ref } from 'vue'
import type { AccentOption, TimerItem } from '../types'

const STORAGE_KEY = 'prepboard/state'
const STORAGE_VERSION = 1

type PersistenceDeps = {
  timers: Ref<TimerItem[]>
  isDark: Ref<boolean>
  denseLayout: Ref<boolean>
  muted: Ref<boolean>
  accentOptions: AccentOption[]
  defaultAccent: AccentOption
  announceCompletion: (timer: TimerItem, options?: { isRepeat?: boolean }) => void
  scheduleRepeat: (timer: TimerItem) => void
  pruneDoneTimers: (now: number) => void
  resumeTicker: () => void
}

type PersistedTimer = Omit<TimerItem, 'accent'> & { accentId: string }

export const useTimerPersistence = ({
  timers,
  isDark,
  denseLayout,
  muted,
  accentOptions,
  defaultAccent,
  announceCompletion,
  scheduleRepeat,
  pruneDoneTimers,
  resumeTicker,
}: PersistenceDeps) => {
  const serializeTimer = (timer: TimerItem): PersistedTimer => ({
    ...timer,
    accentId: timer.accent.id,
  })

  const deserializeTimer = (data: PersistedTimer): TimerItem => {
    const accent = accentOptions.find((option) => option.id === data.accentId) ?? defaultAccent
    const { accentId, ...rest } = data
    return { ...rest, accent }
  }

  const hydrateFromStorage = () => {
    if (typeof localStorage === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as {
        version?: number
        timers?: PersistedTimer[]
        isDark?: boolean
        denseLayout?: boolean
        muted?: boolean
      }

      if (parsed.version && parsed.version > STORAGE_VERSION) {
        console.warn('Prepboard: stored data is from a newer version, skipping hydration.')
        return
      }

      if (typeof parsed.isDark === 'boolean') isDark.value = parsed.isDark
      if (typeof parsed.denseLayout === 'boolean') denseLayout.value = parsed.denseLayout
      if (typeof parsed.muted === 'boolean') muted.value = parsed.muted

      if (Array.isArray(parsed.timers)) {
        const now = Date.now()
        let hasActive = false

        timers.value = parsed.timers.map(deserializeTimer).map((timer) => {
          if (timer.status === 'running') {
            const elapsed = now - (timer.lastUpdated ?? timer.createdAt)
            timer.remainingMs = Math.max(0, timer.remainingMs - elapsed)
            if (timer.remainingMs <= 0) {
              timer.remainingMs = 0
              timer.status = 'done'
              timer.isRunning = false
              timer.lastUpdated = undefined
              timer.completedAt = timer.completedAt ?? now
              if (!timer.notified) announceCompletion(timer)
            } else {
              timer.lastUpdated = now
              hasActive = true
            }
          }

          if (timer.status === 'done') {
            timer.isRunning = false
            timer.remainingMs = 0
            timer.completedAt = timer.completedAt ?? now
            scheduleRepeat(timer)
          }

          return timer
        })

        pruneDoneTimers(now)
        if (hasActive) resumeTicker()
      }
    } catch (error) {
      console.warn('Prepboard: unable to restore state, clearing corrupted entry', error)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (cleanupError) {
        console.warn('Prepboard: failed to clear corrupted state', cleanupError)
      }
    }
  }

  const persist = useDebounceFn(() => {
    if (typeof localStorage === 'undefined') return
    const payload = {
      version: STORAGE_VERSION,
      timers: timers.value.map(serializeTimer),
      isDark: isDark.value,
      denseLayout: denseLayout.value,
      muted: muted.value,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (error) {
      console.warn('Prepboard: unable to persist state', error)
    }
  }, 250)

  watch(
    () => [timers.value, isDark.value, denseLayout.value, muted.value],
    () => persist(),
    { deep: true }
  )

  return { hydrateFromStorage }
}

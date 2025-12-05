import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { TimerItem } from '../types'

const REPEAT_INTERVAL_MS = 15_000
const REPEAT_WINDOW_MS = 2 * 60 * 1000

export const useTimerAlerts = (timers: Ref<TimerItem[]>) => {
  const muted = ref(false)
  const liveAnnouncement = ref('')
  const audioError = ref('')
  let userInteracted = false

  let audioContext: AudioContext | null = null
  const repeatTimeouts = new Map<string, number>()

  const playCompletionTone = async () => {
    if (typeof window === 'undefined' || muted.value) return
    if (!userInteracted) return
    const AudioCtor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined
    if (!AudioCtor) return

    try {
      audioContext ??= new AudioCtor()
      await audioContext.resume()

      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.type = 'triangle'
      oscillator.frequency.value = 1200
      gain.gain.value = 0.08

      oscillator.connect(gain)
      gain.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.35)
      oscillator.onended = () => {
        oscillator.disconnect()
        gain.disconnect()
      }
    } catch (error) {
      audioError.value = 'Sound blocked; interact or check system audio.'
      console.warn('Unable to play completion tone', error)
    }
  }

  const clearRepeat = (id: string) => {
    const handle = repeatTimeouts.get(id)
    if (handle) window.clearTimeout(handle)
    repeatTimeouts.delete(id)
  }

  const scheduleRepeat = (timer: TimerItem) => {
    if (!timer.completedAt || timer.status !== 'done' || muted.value) return
    clearRepeat(timer.id)

    const elapsed = Date.now() - timer.completedAt
    if (elapsed >= REPEAT_WINDOW_MS) return

    const handle = window.setTimeout(() => {
      repeatTimeouts.delete(timer.id)
      if (timer.status !== 'done' || muted.value) return
      announceCompletion(timer, { isRepeat: true })
    }, REPEAT_INTERVAL_MS)
    repeatTimeouts.set(timer.id, handle)
  }

  const announceCompletion = (timer: TimerItem, options?: { isRepeat?: boolean }) => {
    if (!timer.completedAt) timer.completedAt = Date.now()
    timer.notified = true

    const message = options?.isRepeat ? `${timer.label} is still waiting` : `${timer.label} is ready`
    liveAnnouncement.value = message
    playCompletionTone()

    window.setTimeout(() => {
      if (liveAnnouncement.value === message) {
        liveAnnouncement.value = ''
      }
    }, 2000)

    scheduleRepeat(timer)
  }

  watch(
    muted,
    (isMuted) => {
      if (isMuted) {
        repeatTimeouts.forEach((handle) => window.clearTimeout(handle))
        repeatTimeouts.clear()
      } else {
        timers.value.filter((timer) => timer.status === 'done').forEach((timer) => scheduleRepeat(timer))
      }
    },
    { immediate: false }
  )

  const disposeAlerts = () => {
    repeatTimeouts.forEach((handle) => window.clearTimeout(handle))
    repeatTimeouts.clear()
  }

  const noteInteraction = () => {
    userInteracted = true
    audioError.value = ''
  }

  const toggleMute = () => {
    muted.value = !muted.value
  }

  return {
    muted,
    liveAnnouncement,
    audioError,
    announceCompletion,
    scheduleRepeat,
    clearRepeat,
    disposeAlerts,
    noteInteraction,
    toggleMute,
  }
}

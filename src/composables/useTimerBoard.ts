import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTimerAlerts } from './useTimerAlerts'
import { useTimerPersistence } from './useTimerPersistence'
import { useTimerEngine } from './useTimerEngine'
import { accentOptions, defaultAccent, quickPresets, CLEAR_DELAY_MS } from '../constants/timers'
import type { TimerItem } from '../types'

export const useTimerBoard = () => {
  const timers = ref<TimerItem[]>([])
  const denseLayout = ref(false)
  const isDark = ref(false)

  const alerts = useTimerAlerts(timers)

  const engine = useTimerEngine({
    timers,
    accentOptions,
    defaultAccent,
    clearRepeat: alerts.clearRepeat,
    announceCompletion: alerts.announceCompletion,
    pruneDelayMs: CLEAR_DELAY_MS,
    noteInteraction: alerts.noteInteraction,
  })

  const { hydrateFromStorage } = useTimerPersistence({
    timers,
    isDark,
    denseLayout,
    muted: alerts.muted,
    accentOptions,
    defaultAccent,
    announceCompletion: alerts.announceCompletion,
    scheduleRepeat: alerts.scheduleRepeat,
    pruneDoneTimers: engine.pruneDoneTimers,
    resumeTicker: () => engine.resumeTicker(),
  })

  watch(
    isDark,
    (val) => {
      const root = document.documentElement
      if (val) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    hydrateFromStorage()
  })

  onBeforeUnmount(() => {
    engine.disposeEngine()
    alerts.disposeAlerts()
  })

  return {
    accentOptions,
    quickPresets,
    timers,
    denseLayout,
    isDark,
    muted: alerts.muted,
    liveAnnouncement: alerts.liveAnnouncement,
    audioError: alerts.audioError,
    runningCount: engine.runningCount,
    doneCount: engine.doneCount,
    kitchenMood: engine.kitchenMood,
    nextCompleteCopy: engine.nextCompleteCopy,
    sortedTimers: engine.sortedTimers,
    addTimerFromPayload: engine.addTimerFromPayload,
    startTimer: engine.startTimer,
    pauseTimer: engine.pauseTimer,
    resetTimer: engine.resetTimer,
    removeTimer: engine.removeTimer,
    clearDone: engine.clearDone,
  }
}

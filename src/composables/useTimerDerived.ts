import { computed, type Ref } from 'vue'
import type { TimerItem } from '../types'

export const useTimerDerived = (timers: Ref<TimerItem[]>) => {
  const runningCount = computed(() => timers.value.filter((timer) => timer.status === 'running').length)
  const doneCount = computed(() => timers.value.filter((timer) => timer.status === 'done').length)
  const kitchenMood = computed(() => (runningCount.value ? 'Pots are simmering' : 'Ready when you are'))

  const nextComplete = computed(() => {
    const active = timers.value.filter((timer) => timer.status === 'running')
    if (!active.length) return null
    return active.sort((a, b) => a.remainingMs - b.remainingMs)[0]
  })

  const nextCompleteCopy = computed(() => {
    if (!nextComplete.value) return '—'
    const minutes = Math.max(0, Math.ceil(nextComplete.value.remainingMs / 60000))
    return `${nextComplete.value.label} ~${minutes}m`
  })

  const sortedTimers = computed(() => {
    const weight: Record<TimerItem['status'], number> = {
      running: 0,
      paused: 1,
      idle: 2,
      done: 3,
    }
    return [...timers.value].sort((a, b) => {
      const diff = weight[a.status] - weight[b.status]
      if (diff !== 0) return diff
      return a.remainingMs - b.remainingMs
    })
  })

  return {
    runningCount,
    doneCount,
    kitchenMood,
    nextCompleteCopy,
    sortedTimers,
  }
}

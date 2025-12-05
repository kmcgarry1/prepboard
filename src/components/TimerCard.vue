<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowPathIcon,
  BellAlertIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import type { TimerItem } from '../types'

const props = defineProps<{
  timer: TimerItem
}>()

const emit = defineEmits<{
  start: [id: string]
  pause: [id: string]
  reset: [id: string]
  remove: [id: string]
}>()

const formattedTime = computed(() => {
  const totalSeconds = Math.max(0, Math.ceil(props.timer.remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const progress = computed(() => {
  if (props.timer.durationMs === 0) return 0
  const used = props.timer.durationMs - props.timer.remainingMs
  return Math.min(100, Math.max(0, (used / props.timer.durationMs) * 100))
})

const ringRadius = 62
const progressDashOffset = computed(() => 100 - progress.value)
const progressStrokeColor = computed(() => props.timer.accent.stroke)

const durationText = computed(() => {
  const minutes = props.timer.durationMs / 60000
  if (minutes < 1) {
    return `${Math.round(minutes * 60)} sec`
  }
  if (minutes < 10) {
    return `${minutes.toFixed(1)} min`
  }
  return `${Math.round(minutes)} min`
})

const statusCopy = computed(() => {
  if (props.timer.status === 'done') return 'Ready'
  if (props.timer.status === 'running') return 'Running'
  if (props.timer.status === 'paused') return 'Paused'
  return 'Queued'
})

const statusTone = computed(() => {
  if (props.timer.status === 'done') return 'text-[#5f8b53]'
  if (props.timer.status === 'running') return 'text-[#c27a36]'
  if (props.timer.status === 'paused') return 'text-smoke'
  return 'text-smoke/70'
})
</script>

<template>
  <article
    class="relative flex h-full flex-col gap-5 rounded-3xl border border-smoke/15 bg-white/85 p-5 text-soot shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:border-smoke/30 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-slate-900 sm:p-6"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <span
          class="flex h-12 w-12 items-center justify-center rounded-2xl border text-slate-900"
          :class="[timer.accent.bg, timer.accent.border]"
          aria-hidden="true"
        >
          <BellAlertIcon class="h-6 w-6" />
        </span>
        <div>
          <p class="text-[11px] uppercase tracking-[0.28em] text-slate-400 dark:text-slate-300">
            {{ statusCopy }}
          </p>
          <h3 class="font-display text-xl font-semibold text-soot dark:text-white">
            {{ timer.label }}
          </h3>
        </div>
      </div>
      <button
        type="button"
        class="rounded-full border border-slate-700/70 bg-slate-800/70 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
        @click="emit('remove', timer.id)"
        aria-label="Remove timer"
      >
        <TrashIcon class="h-5 w-5" />
      </button>
    </div>

    <div class="flex flex-col items-center gap-5 sm:gap-6">
      <div class="relative flex h-44 w-44 items-center justify-center">
        <svg viewBox="0 0 160 160" class="h-full w-full -rotate-90">
          <circle
            class="stroke-smoke/10 dark:stroke-white/10"
            fill="none"
            :stroke-width="12"
            cx="80"
            cy="80"
            :r="ringRadius"
            pathLength="100"
            stroke-dasharray="100"
            stroke-dashoffset="0"
          />
          <circle
            class="drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)] transition-[stroke-dashoffset] duration-300 ease-out"
            fill="none"
            :stroke-width="12"
            cx="80"
            cy="80"
            :r="ringRadius"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="progressDashOffset"
            stroke-linecap="round"
            :style="{ stroke: progressStrokeColor }"
          />
        </svg>
        <div class="absolute text-center">
          <div class="font-mono text-4xl font-semibold tabular-nums text-soot dark:text-white lg:text-5xl">
            {{ formattedTime }}
          </div>
          <p class="text-[11px] uppercase tracking-[0.28em] text-smoke dark:text-slate-300">
            {{ statusCopy }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-smoke/20 bg-sage/60 text-soot transition hover:border-basil/50 hover:bg-basil/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/60 dark:hover:bg-basil/20"
          :aria-label="timer.isRunning ? 'Pause timer' : 'Start timer'"
          @click="timer.isRunning ? emit('pause', timer.id) : emit('start', timer.id)"
        >
          <PauseIcon v-if="timer.isRunning" class="h-5 w-5" />
          <PlayIcon v-else class="ml-0.5 h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-smoke/20 bg-sage/60 text-soot transition hover:border-basil/50 hover:bg-basil/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/60 dark:hover:bg-basil/20"
          aria-label="Reset timer"
          @click="emit('reset', timer.id)"
        >
          <ArrowPathIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between text-xs text-smoke dark:text-slate-400">
      <span>{{ durationText }}</span>
      <span :class="statusTone">{{ statusCopy }}</span>
    </div>
  </article>
</template>

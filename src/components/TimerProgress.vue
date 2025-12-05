<script setup lang="ts">
import { computed } from 'vue'
import type { TimerItem } from '../types'

const props = defineProps<{
  timer: TimerItem
  statusCopy: string
  isDone: boolean
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
</script>

<template>
  <div class="relative flex h-44 w-44 items-center justify-center">
    <div
      v-if="props.isDone"
      class="pointer-events-none absolute inset-3 rounded-full bg-basil/30 blur-xl dark:bg-basil/25"
      aria-hidden="true"
    />
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
        :class="[
          'drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)] transition-[stroke-dashoffset] duration-300 ease-out',
          props.isDone ? 'drop-shadow-[0_10px_30px_rgba(143,162,118,0.35)]' : '',
        ]"
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
</template>

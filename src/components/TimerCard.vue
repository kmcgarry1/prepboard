<script setup lang="ts">
import { computed } from 'vue'
import { ArrowPathIcon, BellAlertIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/vue/24/outline'
import TimerProgress from './TimerProgress.vue'
import type { TimerItem } from '../types'

const props = defineProps<{
  timer: TimerItem
  dense?: boolean
}>()

const emit = defineEmits<{
  start: [id: string]
  pause: [id: string]
  reset: [id: string]
  remove: [id: string]
}>()

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

const isDone = computed(() => props.timer.status === 'done')
</script>

<template>
  <article
    class="relative flex h-full flex-col gap-5 rounded-3xl border border-smoke/15 bg-white/85 p-5 text-soot shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:border-smoke/30 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-slate-900 sm:p-6"
    :class="[
      isDone ? 'border-basil/60 shadow-[0_16px_40px_rgba(143,162,118,0.35)] ring-2 ring-basil/40 dark:border-basil/60 dark:ring-basil/50' : '',
      timer.status === 'running' ? 'border-basil/30' : '',
      'transition-transform duration-200 ease-out',
      dense ? 'md:scale-[0.995]' : 'md:scale-100',
    ]"
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
      <div class="flex items-center gap-2">
        <span
          v-if="isDone"
          class="inline-flex items-center gap-1 rounded-full bg-basil/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-2 ring-basil/30 dark:bg-basil/25"
          :class="timer.accent.text"
        >
          Ready
        </span>
        <button
          type="button"
          class="rounded-full border border-slate-700/70 bg-slate-800/70 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:focus-visible:ring-basil/60 dark:focus-visible:ring-offset-slate-900"
          @click="emit('remove', timer.id)"
          aria-label="Remove timer"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="flex flex-col items-center gap-5 sm:gap-6">
      <TimerProgress :timer="timer" :status-copy="statusCopy" :is-done="isDone" />

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-smoke/20 bg-sage/60 text-soot transition hover:border-basil/50 hover:bg-basil/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/60 dark:hover:bg-basil/20 dark:focus-visible:ring-offset-slate-900"
          :aria-label="timer.isRunning ? 'Pause timer' : 'Start timer'"
          @click="timer.isRunning ? emit('pause', timer.id) : emit('start', timer.id)"
        >
          <PauseIcon v-if="timer.isRunning" class="h-5 w-5" />
          <PlayIcon v-else class="ml-0.5 h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-smoke/20 bg-sage/60 text-soot transition hover:border-basil/50 hover:bg-basil/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/60 dark:hover:bg-basil/20 dark:focus-visible:ring-offset-slate-900"
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
    <span class="sr-only" aria-live="polite">{{ timer.label }} {{ statusCopy }}</span>
  </article>
</template>

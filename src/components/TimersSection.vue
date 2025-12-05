<script setup lang="ts">
import TimerCard from './TimerCard.vue'
import type { TimerItem } from '../types'

const props = defineProps<{
  timers: TimerItem[]
  sortedTimers: TimerItem[]
  runningCount: number
  doneCount: number
  denseLayout: boolean
  muted: boolean
  audioError?: string
}>()

const emit = defineEmits<{
  start: [id: string]
  pause: [id: string]
  reset: [id: string]
  remove: [id: string]
  clearDone: []
}>()
</script>

<template>
  <section class="mt-6">
    <div class="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-smoke dark:text-slate-300">
          All timers
        </p>
        <h3 class="text-2xl font-semibold font-display text-soot dark:text-white">
          Everything in one view
        </h3>
        <p v-if="props.audioError" class="mt-1 text-xs text-smoke dark:text-slate-300">
          {{ props.audioError }}
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-soot/80 dark:text-slate-300">
        <button
          v-if="props.doneCount"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-smoke/20 bg-white/70 px-3 py-2 text-xs font-medium text-soot transition hover:border-basil/50 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800/70 dark:text-white dark:focus-visible:ring-offset-slate-900"
          @click="emit('clearDone')"
        >
          Clear done
        </button>
      </div>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-2 text-xs text-soot/80 dark:text-slate-300">
      <span class="inline-flex items-center gap-2 px-3 py-2 border rounded-full border-smoke/20 bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800/75 dark:focus-visible:ring-offset-slate-900">
        <span class="w-2 h-2 rounded-full bg-basil" aria-hidden="true" />
        {{ props.runningCount }} running
      </span>
      <span class="inline-flex items-center gap-2 px-3 py-2 border rounded-full border-smoke/20 bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800/75 dark:focus-visible:ring-offset-slate-900">
        <span class="w-2 h-2 rounded-full bg-smoke/80" aria-hidden="true" />
        {{ props.doneCount }} done
      </span>
      <span
        v-if="props.muted"
        class="inline-flex items-center gap-2 rounded-full border border-smoke/15 bg-white/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-smoke focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200 dark:focus-visible:ring-offset-slate-900"
      >
        Muted
      </span>
    </div>

    <div
      v-if="!props.timers.length"
      class="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-smoke/20 bg-white/70 text-sm text-smoke dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
    >
      <div class="text-center">
        <p class="text-xl font-display text-soot dark:text-white">No timers yet</p>
        <p class="text-smoke dark:text-slate-300">Tap “New timer” to start your first countdown.</p>
      </div>
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      :class="props.denseLayout ? 'gap-4 sm:gap-3 lg:gap-4' : 'gap-5 sm:gap-4 lg:gap-5'"
    >
      <TimerCard
        v-for="timer in props.sortedTimers"
        :key="timer.id"
        :timer="timer"
        :dense="props.denseLayout"
        @start="emit('start', timer.id)"
        @pause="emit('pause', timer.id)"
        @reset="emit('reset', timer.id)"
        @remove="emit('remove', timer.id)"
      />
    </div>
  </section>
</template>

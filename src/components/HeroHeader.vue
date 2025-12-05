<script setup lang="ts">
import { SparklesIcon } from '@heroicons/vue/24/outline'

defineProps<{
  kitchenMood: string
  total: number
}>()
</script>

<template>
  <header class="flex flex-col gap-4 mb-5 sm:flex-row sm:items-start sm:justify-between">
    <div class="flex items-start gap-3">
      <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-basil/20 ring-1 ring-basil/40">
        <SparklesIcon class="w-6 h-6 text-basil" aria-hidden="true" />
      </div>
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-smoke dark:text-slate-300">
          Kitchen timers
        </p>
        <h1 class="text-3xl font-semibold font-display text-soot dark:text-white sm:text-4xl">
          Prepboard
        </h1>
        <p class="text-sm text-smoke dark:text-slate-300">{{ kitchenMood }}</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 text-sm text-soot dark:text-slate-200 sm:justify-end">
      <span
        class="px-3 py-1 font-semibold border rounded-full shadow-sm border-smoke/40 bg-white/95 text-soot/90 ring-1 ring-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 dark:border-white/20 dark:bg-slate-800/85 dark:text-white dark:ring-white/15"
      >
        All timers visible
      </span>
      <span
        class="px-3 py-1 font-semibold border rounded-full shadow-sm border-smoke/40 bg-white/95 text-soot/90 ring-1 ring-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 dark:border-white/20 dark:bg-slate-800/85 dark:text-white dark:ring-white/15"
      >
        {{ total }} slots
      </span>
    </div>
  </header>
</template>

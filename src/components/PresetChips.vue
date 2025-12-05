<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline'
import type { TimerPreset } from '../types'

defineProps<{
  presets: TimerPreset[]
}>()

const emit = defineEmits<{
  select: [preset: TimerPreset]
}>()
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Quick presets</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.label"
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-smoke/10 bg-sage/50 px-3 py-2 text-sm text-soot transition hover:border-basil/50 hover:bg-basil/15 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:border-basil/60 dark:hover:bg-basil/10"
        @click="emit('select', preset)"
      >
        <ClockIcon class="h-4 w-4 text-basil" aria-hidden="true" />
        {{ preset.label }} — {{ preset.minutes }}m
      </button>
    </div>
  </div>
</template>

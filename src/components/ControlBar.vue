<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { ClockIcon, FireIcon, MoonIcon, PlusIcon, SunIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  denseLayout: boolean
  runningCount: number
  doneCount: number
  isDark: boolean
}>()

const emit = defineEmits<{
  'update:denseLayout': [val: boolean]
  'open-new': []
  'toggle-status': []
  'toggle-theme': []
}>()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl bg-basil px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-basil/30 focus:outline-none focus:ring-2 focus:ring-basil/60 dark:bg-basil/90"
        @click="emit('open-new')"
      >
        <PlusIcon class="h-5 w-5" aria-hidden="true" />
        New timer
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl border border-smoke/10 bg-white/70 px-4 py-3 text-sm font-medium text-soot shadow-sm transition hover:border-basil/40 hover:bg-basil/10 focus:outline-none focus:ring-2 focus:ring-basil/40 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/50 dark:hover:bg-basil/10"
        @click="emit('toggle-status')"
      >
        <FireIcon class="h-5 w-5 text-basil" aria-hidden="true" />
        Pulse
        <span class="ml-1 inline-flex h-5 items-center rounded-full bg-basil/15 px-2 text-[11px] font-semibold uppercase tracking-wide text-basil">
          {{ runningCount }} live
        </span>
      </button>
    </div>

    <div class="flex items-center gap-3 rounded-2xl border border-smoke/10 bg-white/80 px-4 py-2 text-sm text-soot shadow-sm dark:border-white/10 dark:bg-slate-800 dark:text-slate-100">
      <ClockIcon class="h-5 w-5 text-basil" aria-hidden="true" />
      <span class="hidden sm:inline">Compact grid</span>
      <Switch
        :model-value="props.denseLayout"
        class="relative inline-flex h-9 w-16 cursor-pointer items-center rounded-full border border-smoke/10 bg-sage/60 transition dark:border-white/10 dark:bg-slate-700"
        @update:model-value="emit('update:denseLayout', $event)"
      >
        <span class="sr-only">Toggle compact grid</span>
        <span
          :class="props.denseLayout ? 'translate-x-8 bg-basil shadow' : 'translate-x-1 bg-white'"
          class="inline-block h-7 w-7 transform rounded-full transition"
        />
      </Switch>
      <div class="flex items-center gap-2 text-xs text-soot/70 dark:text-slate-300">
        <span class="hidden sm:inline-flex items-center gap-1 rounded-full bg-basil/10 px-2 py-1">
          <span class="h-2 w-2 rounded-full bg-basil" aria-hidden="true" />
          {{ runningCount }} running
        </span>
        <span class="hidden sm:inline-flex items-center gap-1 rounded-full bg-smoke/10 px-2 py-1">
          <span class="h-2 w-2 rounded-full bg-smoke/80" aria-hidden="true" />
          {{ doneCount }} done
        </span>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl border border-smoke/15 bg-white/80 px-3 py-2 text-xs font-medium text-soot transition hover:border-basil/40 hover:bg-basil/10 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/50 dark:hover:bg-basil/10"
        @click="emit('toggle-theme')"
      >
        <SunIcon v-if="!props.isDark" class="h-4 w-4 text-basil" aria-hidden="true" />
        <MoonIcon v-else class="h-4 w-4 text-basil" aria-hidden="true" />
        {{ props.isDark ? 'Dark' : 'Light' }} mode
      </button>
    </div>
  </div>
</template>

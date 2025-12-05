<script setup lang="ts">
import { FireIcon, MoonIcon, SunIcon, ViewfinderCircleIcon, PlusIcon, BellAlertIcon, BellSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isDark: boolean
  runningCount: number
  denseLayout: boolean
  muted: boolean
}>()

const emit = defineEmits<{
  'open-new': []
  'toggle-status': []
  'toggle-theme': []
  'toggle-mute': []
  'update:denseLayout': [val: boolean]
}>()
</script>

<template>
  <nav
    class="fixed left-0 right-0 bottom-0 z-50 border-t border-smoke/15 bg-white/95 px-4 py-3 text-soot shadow-[0_-6px_20px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100"
    style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)"
  >
    <div class="mx-auto flex max-w-4xl items-center justify-between gap-2 overflow-x-auto pb-1 whitespace-nowrap">
      <button
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-basil px-3 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-basil/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-basil dark:bg-basil/90 dark:focus-visible:ring-offset-slate-900"
        @click="emit('open-new')"
      >
        <PlusIcon class="h-5 w-5" aria-hidden="true" />
        New
      </button>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-2xl border border-smoke/15 bg-white text-sm text-soot shadow-sm transition hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
        aria-label="Kitchen pulse"
        @click="emit('toggle-status')"
      >
        <FireIcon class="h-5 w-5 text-basil" aria-hidden="true" />
        <span class="sr-only">Pulse ({{ runningCount }} running)</span>
      </button>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-2xl border border-smoke/15 bg-white text-sm text-soot shadow-sm transition hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
        aria-label="Toggle compact grid"
        @click="emit('update:denseLayout', !props.denseLayout)"
      >
        <ViewfinderCircleIcon class="h-5 w-5 text-basil" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-2xl border border-smoke/15 bg-white text-sm text-soot shadow-sm transition hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
        aria-label="Toggle theme"
        @click="emit('toggle-theme')"
      >
        <SunIcon v-if="!props.isDark" class="h-5 w-5 text-basil" aria-hidden="true" />
        <MoonIcon v-else class="h-5 w-5 text-basil" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-2xl border border-smoke/15 bg-white text-sm text-soot shadow-sm transition hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
        :aria-label="props.muted ? 'Unmute chime' : 'Mute chime'"
        @click="emit('toggle-mute')"
      >
        <BellSlashIcon v-if="props.muted" class="h-5 w-5 text-smoke" aria-hidden="true" />
        <BellAlertIcon v-else class="h-5 w-5 text-basil" aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>

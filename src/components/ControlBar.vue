<script setup lang="ts">
import { Switch } from "@headlessui/vue";
import {
  BellAlertIcon,
  BellSlashIcon,
  ClockIcon,
  FireIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  denseLayout: boolean;
  runningCount: number;
  doneCount: number;
  isDark: boolean;
  muted: boolean;
}>();

const emit = defineEmits<{
  "update:denseLayout": [val: boolean];
  "open-new": [];
  "toggle-status": [];
  "toggle-theme": [];
  "toggle-mute": [];
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex flex-wrap items-center gap-3 px-4 py-2 text-sm border shadow-sm rounded-2xl border-smoke/10 bg-white/80 text-soot dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl bg-basil px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-basil/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-basil dark:bg-basil/90 dark:focus-visible:ring-offset-slate-900"
        @click="emit('open-new')"
      >
        <PlusIcon class="w-5 h-5" aria-hidden="true" />
        New timer
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition border shadow-sm rounded-2xl border-smoke/15 bg-white/80 text-soot hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/50 dark:hover:bg-basil/10 dark:focus-visible:ring-offset-slate-900"
        @click="emit('toggle-status')"
      >
        <FireIcon class="w-5 h-5 text-basil" aria-hidden="true" />
        Pulse
        <span
          class="ml-1 inline-flex h-5 items-center rounded-full bg-basil/15 px-2 text-[11px] font-semibold uppercase tracking-wide text-basil"
        >
          {{ runningCount }} live
        </span>
      </button>
      <ClockIcon class="w-5 h-5 text-basil" aria-hidden="true" />
      <span class="hidden sm:inline">Compact grid</span>
      <Switch
        :model-value="props.denseLayout"
        class="relative inline-flex items-center w-16 transition border rounded-full cursor-pointer h-9 border-smoke/15 bg-sage/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
        @update:model-value="emit('update:denseLayout', $event)"
      >
        <span class="sr-only">Toggle compact grid</span>
        <span
          :class="
            props.denseLayout
              ? 'translate-x-8 bg-basil shadow-sm'
              : 'translate-x-1 bg-white shadow-sm'
          "
          class="inline-block transition transform rounded-full h-7 w-7 ring-1 ring-black/5 dark:ring-white/10"
        />
      </Switch>
      <div
        class="flex items-center gap-2 text-xs text-soot/80 dark:text-slate-200"
      >
        <span
          class="items-center hidden gap-1 px-2 py-1 rounded-full sm:inline-flex bg-basil/15 text-soot/90"
        >
          <span class="w-2 h-2 rounded-full bg-basil" aria-hidden="true" />
          {{ runningCount }} running
        </span>
        <span
          class="items-center hidden gap-1 px-2 py-1 rounded-full sm:inline-flex bg-smoke/15 text-soot/90"
        >
          <span class="w-2 h-2 rounded-full bg-smoke" aria-hidden="true" />
          {{ doneCount }} done
        </span>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium transition border rounded-xl border-smoke/15 bg-white/85 text-soot hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/50 dark:hover:bg-basil/10 dark:focus-visible:ring-offset-slate-900"
        :aria-pressed="props.muted"
        @click="emit('toggle-mute')"
      >
        <BellSlashIcon
          v-if="props.muted"
          class="w-4 h-4 text-smoke dark:text-slate-200"
          aria-hidden="true"
        />
        <BellAlertIcon v-else class="w-4 h-4 text-basil" aria-hidden="true" />
        {{ props.muted ? "Muted" : "Chime on" }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium transition border rounded-xl border-smoke/15 bg-white/85 text-soot hover:border-basil/40 hover:bg-basil/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basil/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/50 dark:hover:bg-basil/10 dark:focus-visible:ring-offset-slate-900"
        @click="emit('toggle-theme')"
      >
        <SunIcon
          v-if="!props.isDark"
          class="w-4 h-4 text-basil"
          aria-hidden="true"
        />
        <MoonIcon v-else class="w-4 h-4 text-basil" aria-hidden="true" />
        {{ props.isDark ? "Dark" : "Light" }} mode
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroHeader from './components/HeroHeader.vue'
import TimersSection from './components/TimersSection.vue'
import ActionBars from './components/ActionBars.vue'
import TimerOverlays from './components/TimerOverlays.vue'
import type { NewTimerPayload } from './types'
import { useTimerBoard } from './composables/useTimerBoard'
import { useUiToggles } from './composables/useUiToggles'

const { showNewTimerModal, showStatusPanel, openNew, closeNew, toggleStatus, closeStatus } = useUiToggles()

const {
  accentOptions,
  quickPresets,
  timers,
  denseLayout,
  isDark,
  muted,
  liveAnnouncement,
  runningCount,
  doneCount,
  kitchenMood,
  nextCompleteCopy,
  sortedTimers,
  audioError,
  addTimerFromPayload,
  startTimer,
  pauseTimer,
  resetTimer,
  removeTimer,
  clearDone,
} = useTimerBoard()

const handleCreateTimer = (payload: NewTimerPayload) => {
  addTimerFromPayload(payload)
  closeNew()
}
</script>

<template>
  <div class="min-h-screen">
    <div
      class="relative min-h-screen overflow-hidden transition-colors bg-parchment text-soot dark:bg-slate-950 dark:text-slate-100"
    >
      <div
        class="absolute inset-0 pointer-events-none -z-10 bg-kitchen-gradient opacity-90 dark:bg-kitchen-gradient-dark"
        aria-hidden="true"
      />
      <div
        class="absolute inset-x-0 top-0 h-64 pointer-events-none -z-10 bg-gradient-to-b from-white/60 via-transparent to-transparent dark:from-white/5"
        aria-hidden="true"
      />
      <main class="relative max-w-6xl px-5 pt-8 mx-auto pb-24 sm:px-8 sm:pt-12 sm:pb-16 lg:px-10 lg:pb-14 lg:pt-14">
        <div class="sr-only" aria-live="assertive">{{ liveAnnouncement }}</div>
        <section class="rounded-3xl border border-smoke/10 bg-white/70 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/80 sm:p-6 lg:p-7 mb-8">
          <HeroHeader :kitchen-mood="kitchenMood" :total="timers.length" />

        <ActionBars
          class="mt-4"
          :dense-layout="denseLayout"
          :running-count="runningCount"
          :done-count="doneCount"
            :is-dark="isDark"
            :muted="muted"
            @open-new="openNew"
            @toggle-status="toggleStatus"
            @toggle-theme="isDark = !isDark"
            @toggle-mute="muted = !muted"
            @update:dense-layout="denseLayout = $event"
          />
        </section>

        <TimersSection
          class="mt-8"
          :timers="timers"
          :sorted-timers="sortedTimers"
          :running-count="runningCount"
          :done-count="doneCount"
          :dense-layout="denseLayout"
          :muted="muted"
          :audio-error="audioError"
          @start="startTimer"
          @pause="pauseTimer"
          @reset="resetTimer"
          @remove="removeTimer"
          @clear-done="clearDone"
        />

        <TimerOverlays
          :show-status="showStatusPanel"
          :show-new="showNewTimerModal"
          :running-count="runningCount"
          :done-count="doneCount"
          :next-complete-copy="nextCompleteCopy"
          :total="timers.length"
          :accent-options="accentOptions"
          :presets="quickPresets"
          @close-status="closeStatus"
          @close-new="closeNew"
          @create="handleCreateTimer"
        />
      </main>
    </div>
  </div>
</template>

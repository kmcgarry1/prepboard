<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { SparklesIcon } from '@heroicons/vue/24/outline'
import TimerCard from './components/TimerCard.vue'
import ControlBar from './components/ControlBar.vue'
import MobileActionBar from './components/MobileActionBar.vue'
import NewTimerModal from './components/NewTimerModal.vue'
import StatusPanel from './components/StatusPanel.vue'
import type { AccentOption, NewTimerPayload, TimerItem, TimerPreset } from './types'

const accentOptions: AccentOption[] = [
  {
    id: 'herb',
    name: 'Herb garden',
    bg: 'bg-[#e7f0dc]',
    fill: 'bg-[#8ba46a]',
    border: 'border-[#d2e2c0]',
    text: 'text-[#3b4b2e]',
    stroke: '#8ba46a',
  },
  {
    id: 'citrus',
    name: 'Citrus peel',
    bg: 'bg-[#fff3d9]',
    fill: 'bg-[#f1b24a]',
    border: 'border-[#f7e2b5]',
    text: 'text-[#5a3b1b]',
    stroke: '#f1b24a',
  },
  {
    id: 'clay',
    name: 'Clay roast',
    bg: 'bg-[#f2e4dc]',
    fill: 'bg-[#c58c73]',
    border: 'border-[#e1cfc1]',
    text: 'text-[#4b332a]',
    stroke: '#c58c73',
  },
  {
    id: 'smoke',
    name: 'Toasted sesame',
    bg: 'bg-[#e9ecf2]',
    fill: 'bg-[#6c7a89]',
    border: 'border-[#d2d9e4]',
    text: 'text-[#1f252d]',
    stroke: '#6c7a89',
  },
]

const defaultAccent = accentOptions[0]!

const timers = ref<TimerItem[]>([])
const denseLayout = ref(false)
const showNewTimerModal = ref(false)
const showStatusPanel = ref(false)
const isDark = ref(false)

watch(
  isDark,
  (val) => {
    const root = document.documentElement
    if (val) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  },
  { immediate: true }
)

const quickPresets: TimerPreset[] = [
  { label: 'Soft boil', minutes: 6, accentId: 'herb' },
  { label: 'Tea', minutes: 4, accentId: 'citrus' },
  { label: 'Roast check', minutes: 45, accentId: 'clay' },
]

const ticker = useIntervalFn(() => {
  const now = Date.now()
  let active = false

  timers.value.forEach((timer) => {
    if (timer.isRunning && timer.status === 'running') {
      active = true
      const elapsed = timer.lastUpdated ? now - timer.lastUpdated : 0
      timer.remainingMs = Math.max(0, timer.remainingMs - elapsed)
      timer.lastUpdated = now

      if (timer.remainingMs <= 0) {
        timer.remainingMs = 0
        timer.status = 'done'
        timer.isRunning = false
        timer.lastUpdated = undefined
      }
    }
  })

  if (!active) ticker.pause()
}, 250, {
  immediate: false,
})

const addTimerFromPayload = (payload: NewTimerPayload) => {
  const totalMs = (Number(payload.minutes) * 60 + Number(payload.seconds)) * 1000
  if (!Number.isFinite(totalMs) || totalMs <= 0) return

  const accent = accentOptions.find((option) => option.id === payload.accentId) ?? defaultAccent
  const timer: TimerItem = {
    id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
    label: payload.label.trim() || 'Untitled timer',
    durationMs: totalMs,
    remainingMs: totalMs,
    status: 'idle',
    isRunning: false,
    accent,
    createdAt: Date.now(),
  }
  timers.value = [timer, ...timers.value]
  showNewTimerModal.value = false
}

const startTimer = (id: string) => {
  const timer = timers.value.find((item) => item.id === id)
  if (!timer || timer.remainingMs <= 0) return
  timer.isRunning = true
  timer.status = 'running'
  timer.lastUpdated = Date.now()
  ticker.resume()
}

const pauseTimer = (id: string) => {
  const timer = timers.value.find((item) => item.id === id)
  if (!timer) return
  timer.isRunning = false
  timer.status = 'paused'
  timer.lastUpdated = undefined
  if (!timers.value.some((item) => item.isRunning)) ticker.pause()
}

const resetTimer = (id: string) => {
  const timer = timers.value.find((item) => item.id === id)
  if (!timer) return
  timer.isRunning = false
  timer.status = 'idle'
  timer.remainingMs = timer.durationMs
  timer.lastUpdated = undefined
  if (!timers.value.some((item) => item.isRunning)) ticker.pause()
}

const removeTimer = (id: string) => {
  timers.value = timers.value.filter((timer) => timer.id !== id)
  if (!timers.value.some((item) => item.isRunning)) ticker.pause()
}

const runningCount = computed(() => timers.value.filter((timer) => timer.status === 'running').length)
const doneCount = computed(() => timers.value.filter((timer) => timer.status === 'done').length)
const kitchenMood = computed(() => (runningCount.value ? 'Pots are simmering' : 'Ready when you are'))

const nextComplete = computed(() => {
  const active = timers.value.filter((timer) => timer.status !== 'done')
  if (!active.length) return null
  return active.sort((a, b) => a.remainingMs - b.remainingMs)[0]
})

const nextCompleteCopy = computed(() => {
  if (!nextComplete.value) return '—'
  const minutes = Math.max(0, Math.ceil(nextComplete.value.remainingMs / 60000))
  return `${nextComplete.value.label} ~${minutes}m`
})

const sortedTimers = computed(() => {
  const weight: Record<TimerItem['status'], number> = {
    running: 0,
    paused: 1,
    idle: 2,
    done: 3,
  }
  return [...timers.value].sort((a, b) => {
    const diff = weight[a.status] - weight[b.status]
    if (diff !== 0) return diff
    return a.remainingMs - b.remainingMs
  })
})
</script>

<template>
  <div class="min-h-screen">
    <div class="relative min-h-screen overflow-hidden bg-parchment text-soot transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-kitchen-gradient opacity-90 dark:bg-kitchen-gradient-dark"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-white/60 via-transparent to-transparent dark:from-white/5"
        aria-hidden="true"
      />
      <main class="relative mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6 lg:pb-14 lg:pt-14">
        <header class="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-basil/20 ring-1 ring-basil/40">
              <SparklesIcon class="h-6 w-6 text-basil" aria-hidden="true" />
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-smoke dark:text-slate-300">Kitchen timers</p>
              <h1 class="font-display text-3xl font-semibold text-soot dark:text-white sm:text-4xl">Prepboard</h1>
              <p class="text-sm text-smoke dark:text-slate-300">{{ kitchenMood }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-sm text-soot dark:text-slate-200">
            <span class="rounded-full border border-smoke/15 bg-white/80 px-3 py-1 dark:border-white/10 dark:bg-slate-800/70">All timers visible</span>
            <span class="rounded-full border border-smoke/15 bg-white/80 px-3 py-1 dark:border-white/10 dark:bg-slate-800/70">
              {{ timers.length }} slots
            </span>
          </div>
        </header>

      <ControlBar
        class="mb-8 hidden sm:block"
        :dense-layout="denseLayout"
        :running-count="runningCount"
        :done-count="doneCount"
        :is-dark="isDark"
        @open-new="showNewTimerModal = true"
        @toggle-status="showStatusPanel = !showStatusPanel"
        @toggle-theme="isDark = !isDark"
        @update:dense-layout="denseLayout = $event"
      />

        <section class="mt-6">
          <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-smoke dark:text-slate-300">All timers</p>
              <h3 class="font-display text-2xl font-semibold text-soot dark:text-white">Everything in one view</h3>
            </div>
            <div class="flex items-center gap-2 text-xs text-soot/80 dark:text-slate-300">
              <span class="inline-flex items-center gap-2 rounded-full border border-smoke/15 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-800/70">
                <span class="h-2 w-2 rounded-full bg-basil" aria-hidden="true" />
                {{ runningCount }} running
              </span>
              <span class="hidden sm:inline-flex items-center gap-2 rounded-full border border-smoke/15 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-800/70">
                <span class="h-2 w-2 rounded-full bg-smoke/80" aria-hidden="true" />
                {{ doneCount }} done
              </span>
            </div>
          </div>

          <div
            v-if="!timers.length"
            class="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-smoke/20 bg-white/70 text-sm text-smoke dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
          >
            <div class="text-center">
              <p class="font-display text-xl text-soot dark:text-white">No timers yet</p>
              <p class="text-smoke dark:text-slate-300">Tap “New timer” to start your first countdown.</p>
            </div>
          </div>
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            :class="denseLayout ? 'gap-3' : 'gap-4'"
          >
            <TimerCard
            v-for="timer in sortedTimers"
            :key="timer.id"
            :timer="timer"
            @start="startTimer"
            @pause="pauseTimer"
            @reset="resetTimer"
            @remove="removeTimer"
          />
        </div>
      </section>

      <StatusPanel
        :show="showStatusPanel"
        :running-count="runningCount"
        :done-count="doneCount"
        :next-complete-copy="nextCompleteCopy"
        :total="timers.length"
        @close="showStatusPanel = false"
      />

      <NewTimerModal
        :open="showNewTimerModal"
        :accent-options="accentOptions"
        :presets="quickPresets"
        @close="showNewTimerModal = false"
        @create="addTimerFromPayload"
      />

      <MobileActionBar
        :is-dark="isDark"
        :running-count="runningCount"
        :dense-layout="denseLayout"
        @open-new="showNewTimerModal = true"
        @toggle-status="showStatusPanel = !showStatusPanel"
        @toggle-theme="isDark = !isDark"
        @update:dense-layout="denseLayout = $event"
      />
    </main>
    </div>
  </div>
</template>

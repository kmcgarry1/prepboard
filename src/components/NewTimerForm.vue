<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import AccentSelect from './AccentSelect.vue'
import PresetChips from './PresetChips.vue'
import type { AccentOption, NewTimerPayload, TimerPreset } from '../types'

const props = defineProps<{
  open: boolean
  accentOptions: AccentOption[]
  presets: TimerPreset[]
}>()

const emit = defineEmits<{
  close: []
  create: [payload: NewTimerPayload]
}>()

const state = reactive<NewTimerPayload>({
  label: 'New timer',
  minutes: 8,
  seconds: 0,
  accentId: props.accentOptions[0]?.id ?? '',
})

const resetState = () => {
  state.label = 'New timer'
  state.minutes = 8
  state.seconds = 0
  state.accentId = props.accentOptions[0]?.id ?? ''
}

watch(
  () => props.open,
  (open) => {
    if (open) resetState()
  }
)

const clampSeconds = () => {
  if (!Number.isFinite(state.seconds)) state.seconds = 0
  if (!Number.isFinite(state.minutes)) state.minutes = 0
  if (state.seconds < 0) state.seconds = 0
  if (state.minutes < 0) state.minutes = 0
  if (state.seconds >= 60) {
    state.minutes += Math.floor(state.seconds / 60)
    state.seconds = state.seconds % 60
  }
}

const canAdd = computed(() => state.minutes * 60 + state.seconds > 0)

const submit = () => {
  clampSeconds()
  if (!canAdd.value) return
  emit('create', { ...state })
}

const applyPreset = (preset: TimerPreset) => {
  state.label = preset.label
  state.minutes = preset.minutes
  state.seconds = 0
  state.accentId = preset.accentId
}
</script>

<template>
  <form class="mt-4 space-y-4 overflow-y-auto pr-1 sm:mt-5 sm:space-y-5" style="max-height: calc(90vh - 80px)" @submit.prevent="submit">
    <div class="grid gap-3 md:grid-cols-2">
      <label class="space-y-2 text-sm text-soot dark:text-slate-100" for="timer-label">
        <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Label</span>
        <input
          id="timer-label"
          v-model.trim="state.label"
          type="text"
          placeholder="e.g. Roast veg"
          class="w-full rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-base text-soot outline-none ring-basil/40 transition focus:border-basil/60 focus:ring-2 dark:border-white/10 dark:bg-slate-800 dark:text-white"
        />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="space-y-2 text-sm text-soot dark:text-slate-100" for="timer-minutes">
          <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Minutes</span>
          <input
            id="timer-minutes"
            v-model.number="state.minutes"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-base text-soot outline-none ring-basil/40 transition focus:border-basil/60 focus:ring-2 dark:border-white/10 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label class="space-y-2 text-sm text-soot dark:text-slate-100" for="timer-seconds">
          <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Seconds</span>
          <input
            id="timer-seconds"
            v-model.number="state.seconds"
            type="number"
            min="0"
            max="59"
            class="w-full rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-base text-soot outline-none ring-basil/40 transition focus:border-basil/60 focus:ring-2 dark:border-white/10 dark:bg-slate-800 dark:text-white"
            @blur="clampSeconds"
          />
        </label>
      </div>
    </div>

    <div class="space-y-2">
      <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Accent</span>
      <AccentSelect v-model="state.accentId" :accent-options="accentOptions" />
    </div>

    <PresetChips :presets="presets" @select="applyPreset" />

    <p id="new-timer-helper" class="text-sm text-smoke dark:text-slate-300">Focus stays on the board; creation lives here.</p>

    <div class="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        class="inline-flex items-center gap-2 rounded-2xl bg-basil px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-basil/30 focus:outline-none focus:ring-2 focus:ring-basil/70 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="!canAdd"
      >
        <PlusIcon class="h-5 w-5" aria-hidden="true" />
        Add timer
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-sm font-medium text-soot shadow-sm transition hover:border-basil/40 hover:bg-basil/10 focus:outline-none focus:ring-2 focus:ring-basil/40 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:border-basil/50 dark:hover:bg-basil/10"
        @click="emit('close')"
      >
        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        Cancel
      </button>
    </div>
  </form>
</template>

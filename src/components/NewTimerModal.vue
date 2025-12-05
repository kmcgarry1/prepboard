<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { AdjustmentsHorizontalIcon, CheckIcon, ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
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
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-30 flex items-center justify-center px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-soot/40 dark:bg-black/60" aria-hidden="true" @click="emit('close')" />
      <div
        class="relative w-full max-w-2xl rounded-3xl border border-smoke/10 bg-white/90 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100 sm:p-6"
        style="max-height: 90vh"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.24em] text-smoke dark:text-slate-300">Create timer</p>
            <h2 class="font-display text-2xl font-semibold text-soot dark:text-white">New countdown</h2>
          </div>
          <button
            type="button"
            class="rounded-full border border-smoke/10 bg-sage/60 p-2 text-soot transition hover:border-basil/40 hover:bg-sage dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/60"
            aria-label="Close new timer"
            @click="emit('close')"
          >
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form class="mt-4 space-y-4 overflow-y-auto pr-1 sm:mt-5 sm:space-y-5" style="max-height: calc(90vh - 80px)" @submit.prevent="submit">
          <div class="grid gap-3 md:grid-cols-2">
            <label class="space-y-2 text-sm text-soot dark:text-slate-100">
              <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Label</span>
              <input
                v-model.trim="state.label"
                type="text"
                placeholder="e.g. Roast veg"
                class="w-full rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-base text-soot outline-none ring-basil/40 transition focus:border-basil/60 focus:ring-2 dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </label>

            <div class="grid grid-cols-2 gap-3">
              <label class="space-y-2 text-sm text-soot dark:text-slate-100">
                <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Minutes</span>
                <input
                  v-model.number="state.minutes"
                  type="number"
                  min="0"
                  class="w-full rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-base text-soot outline-none ring-basil/40 transition focus:border-basil/60 focus:ring-2 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                />
              </label>
              <label class="space-y-2 text-sm text-soot dark:text-slate-100">
                <span class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Seconds</span>
                <input
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
            <Listbox v-model="state.accentId">
                  <div class="relative">
                    <ListboxButton
                      class="relative flex w-full items-center justify-between gap-3 rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-left shadow-soft outline-none transition focus-visible:ring-2 focus-visible:ring-basil/40 dark:border-white/10 dark:bg-slate-800"
                    >
                      <div class="flex items-center gap-3">
                        <span class="h-9 w-9 rounded-lg border border-smoke/10" :class="accentOptions.find((a) => a.id === state.accentId)?.bg" aria-hidden="true" />
                        <div>
                          <p class="text-sm text-soot dark:text-white">
                            {{ accentOptions.find((a) => a.id === state.accentId)?.name || 'Select accent' }}
                          </p>
                          <p class="text-xs text-smoke dark:text-slate-400">Colors + progress</p>
                        </div>
                      </div>
                      <AdjustmentsHorizontalIcon class="h-5 w-5 text-smoke dark:text-slate-300" aria-hidden="true" />
                    </ListboxButton>
                    <ListboxOptions
                      class="absolute z-10 mt-2 w-full rounded-2xl border border-smoke/10 bg-white p-2 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900"
                    >
                      <ListboxOption v-for="accent in accentOptions" v-slot="{ active, selected }" :key="accent.id" :value="accent.id" as="template">
                        <li
                          :class="[
                            'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-soot transition dark:text-white',
                            active ? 'bg-sage/50 dark:bg-slate-800' : 'bg-transparent',
                          ]"
                        >
                          <div class="flex items-center gap-3">
                            <span class="h-8 w-8 rounded-lg border border-smoke/10" :class="accent.bg" aria-hidden="true" />
                            <span>{{ accent.name }}</span>
                          </div>
                          <CheckIcon v-if="selected" class="h-5 w-5 text-basil dark:text-basil" aria-hidden="true" />
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Quick presets</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in presets"
                :key="preset.label"
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-smoke/10 bg-sage/50 px-3 py-2 text-sm text-soot transition hover:border-basil/50 hover:bg-basil/15 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:border-basil/60 dark:hover:bg-basil/10"
                @click="applyPreset(preset)"
              >
                <ClockIcon class="h-4 w-4 text-basil" aria-hidden="true" />
                {{ preset.label }} — {{ preset.minutes }}m
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-2xl bg-basil px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-basil/30 focus:outline-none focus:ring-2 focus:ring-basil/70 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!canAdd"
            >
              <PlusIcon class="h-5 w-5" aria-hidden="true" />
              Add timer
            </button>
            <p class="text-sm text-smoke dark:text-slate-300">Focus stays on the board; creation lives here.</p>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

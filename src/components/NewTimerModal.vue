<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import NewTimerForm from './NewTimerForm.vue'
import type { AccentOption, NewTimerPayload, TimerPreset } from '../types'

const { open, accentOptions, presets } = defineProps<{
  open: boolean
  accentOptions: AccentOption[]
  presets: TimerPreset[]
}>()

const emit = defineEmits<{
  close: []
  create: [payload: NewTimerPayload]
}>()

const dialogRef = ref<HTMLDivElement | null>(null)
const lastFocused = ref<HTMLElement | null>(null)
const helperId = 'new-timer-helper'

watch(
  () => open,
  (val) => {
    if (val) {
      lastFocused.value = document.activeElement as HTMLElement | null
      requestAnimationFrame(() => dialogRef.value?.focus())
    } else {
      lastFocused.value?.focus()
    }
  }
)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab' && dialogRef.value) {
    const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const focusables = Array.from(focusable).filter((el) => !el.hasAttribute('disabled'))
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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
      aria-labelledby="new-timer-title"
      :aria-describedby="helperId"
    >
      <div class="absolute inset-0 bg-soot/40 dark:bg-black/60" aria-hidden="true" @click="emit('close')" />
      <div
        ref="dialogRef"
        class="relative w-full max-w-2xl rounded-3xl border border-smoke/10 bg-white/90 p-4 shadow-soft backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100 sm:p-6"
        style="max-height: 90vh"
        tabindex="-1"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.24em] text-smoke dark:text-slate-300">Create timer</p>
            <h2 id="new-timer-title" class="font-display text-2xl font-semibold text-soot dark:text-white">New countdown</h2>
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

        <NewTimerForm
          :open="open"
          :accent-options="accentOptions"
          :presets="presets"
          @close="emit('close')"
          @create="emit('create', $event)"
        />
      </div>
    </div>
  </transition>
</template>

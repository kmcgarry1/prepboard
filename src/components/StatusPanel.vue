<script setup lang="ts">
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  show: boolean
  runningCount: number
  doneCount: number
  nextCompleteCopy: string
  total: number
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(
  () => props.show,
  async (val) => {
    if (val) {
      await nextTick()
      panelRef.value?.focus()
    }
  }
)
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <aside
      v-if="show"
      ref="panelRef"
      class="fixed right-4 top-24 z-20 w-80 max-w-[90vw] rounded-3xl border border-smoke/10 bg-white/90 p-5 shadow-soft backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-basil/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-900/95 dark:focus-visible:ring-offset-slate-900"
      tabindex="-1"
    >
      <span class="sr-only" aria-live="polite">
        {{ runningCount }} running, {{ doneCount }} done, {{ total }} total
      </span>
      <div class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] uppercase tracking-[0.24em] text-smoke">Kitchen pulse</p>
          <h2 class="font-display text-xl font-semibold text-soot">Status at a glance</h2>
        </div>
        <button
          type="button"
          class="rounded-full border border-smoke/10 bg-sage/70 p-2 text-soot transition hover:border-basil/40 hover:bg-sage dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-basil/50"
          aria-label="Close status"
          @click="emit('close')"
        >
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-2xl border border-smoke/10 bg-sage/40 px-4 py-3 dark:border-white/10 dark:bg-slate-800/80">
          <p class="text-[11px] uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Running</p>
          <p class="font-display text-3xl font-semibold text-soot dark:text-white">{{ runningCount }}</p>
          <p class="text-xs text-smoke/80 dark:text-slate-400">Timers in motion</p>
        </div>
        <div class="rounded-2xl border border-smoke/10 bg-sage/40 px-4 py-3 dark:border-white/10 dark:bg-slate-800/80">
          <p class="text-[11px] uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Done</p>
          <p class="font-display text-3xl font-semibold text-soot dark:text-white">{{ doneCount }}</p>
          <p class="text-xs text-smoke/80 dark:text-slate-400">Waiting to clear</p>
        </div>
        <div class="rounded-2xl border border-smoke/10 bg-sage/40 px-4 py-3 dark:border-white/10 dark:bg-slate-800/80">
          <p class="text-[11px] uppercase tracking-[0.2em] text-smoke dark:text-slate-300">Next ready</p>
          <p class="font-display text-xl font-semibold text-soot dark:text-white">{{ nextCompleteCopy }}</p>
          <p class="text-xs text-smoke/80 dark:text-slate-400">Keep an eye on this</p>
        </div>
        <div class="rounded-2xl border border-smoke/10 bg-sage/40 px-4 py-3 dark:border-white/10 dark:bg-slate-800/80">
          <p class="text-[11px] uppercase tracking-[0.2em] text-smoke dark:text-slate-300">On screen</p>
          <p class="font-display text-xl font-semibold text-soot dark:text-white">{{ total }} timers</p>
          <p class="text-xs text-smoke/80 dark:text-slate-400">No stacks or hidden tabs</p>
        </div>
      </div>
    </aside>
  </transition>
</template>

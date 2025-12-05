<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { AdjustmentsHorizontalIcon, CheckIcon } from '@heroicons/vue/24/outline'
import type { AccentOption } from '../types'

const props = defineProps<{
  modelValue: string
  accentOptions: AccentOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>()
</script>

<template>
  <Listbox :model-value="props.modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="relative">
      <ListboxButton
        class="relative flex w-full items-center justify-between gap-3 rounded-2xl border border-smoke/15 bg-white px-4 py-3 text-left shadow-soft outline-none transition focus-visible:ring-2 focus-visible:ring-basil/40 dark:border-white/10 dark:bg-slate-800"
      >
        <div class="flex items-center gap-3">
          <span
            class="h-9 w-9 rounded-lg border border-smoke/10"
            :class="accentOptions.find((a) => a.id === props.modelValue)?.bg"
            aria-hidden="true"
          />
          <div>
            <p class="text-sm text-soot dark:text-white">
              {{ accentOptions.find((a) => a.id === props.modelValue)?.name || 'Select accent' }}
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
</template>

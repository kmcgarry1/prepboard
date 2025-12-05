<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import StatusPanel from './StatusPanel.vue'
import NewTimerModal from './NewTimerModal.vue'
import type { AccentOption, NewTimerPayload, TimerPreset } from '../types'

const props = defineProps<{
  showStatus: boolean
  showNew: boolean
  runningCount: number
  doneCount: number
  nextCompleteCopy: string
  total: number
  accentOptions: AccentOption[]
  presets: TimerPreset[]
}>()

const emit = defineEmits<{
  'close-status': []
  'close-new': []
  create: [payload: NewTimerPayload]
}>()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (props.showNew) emit('close-new')
    if (props.showStatus) emit('close-status')
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <StatusPanel
    :show="props.showStatus"
    :running-count="props.runningCount"
    :done-count="props.doneCount"
    :next-complete-copy="props.nextCompleteCopy"
    :total="props.total"
    @close="emit('close-status')"
  />

  <NewTimerModal
    :open="props.showNew"
    :accent-options="props.accentOptions"
    :presets="props.presets"
    @close="emit('close-new')"
    @create="emit('create', $event)"
  />
</template>

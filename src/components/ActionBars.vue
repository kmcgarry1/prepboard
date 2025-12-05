<script setup lang="ts">
import ControlBar from './ControlBar.vue'
import MobileActionBar from './MobileActionBar.vue'

const props = defineProps<{
  denseLayout: boolean
  runningCount: number
  doneCount: number
  isDark: boolean
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
  <ControlBar
    class="hidden sm:block"
    :dense-layout="props.denseLayout"
    :running-count="props.runningCount"
    :done-count="props.doneCount"
    :is-dark="props.isDark"
    :muted="props.muted"
    @open-new="emit('open-new')"
    @toggle-status="emit('toggle-status')"
    @toggle-theme="emit('toggle-theme')"
    @toggle-mute="emit('toggle-mute')"
    @update:dense-layout="emit('update:denseLayout', $event)"
  />

  <MobileActionBar
    :is-dark="props.isDark"
    :running-count="props.runningCount"
    :done-count="props.doneCount"
    :dense-layout="props.denseLayout"
    :muted="props.muted"
    @open-new="emit('open-new')"
    @toggle-status="emit('toggle-status')"
    @toggle-theme="emit('toggle-theme')"
    @toggle-mute="emit('toggle-mute')"
    @update:dense-layout="emit('update:denseLayout', $event)"
  />
</template>

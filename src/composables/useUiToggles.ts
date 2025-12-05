import { ref } from 'vue'

export const useUiToggles = () => {
  const showNewTimerModal = ref(false)
  const showStatusPanel = ref(false)

  const openNew = () => {
    showNewTimerModal.value = true
  }
  const closeNew = () => {
    showNewTimerModal.value = false
  }
  const toggleStatus = () => {
    showStatusPanel.value = !showStatusPanel.value
  }
  const closeStatus = () => {
    showStatusPanel.value = false
  }

  return {
    showNewTimerModal,
    showStatusPanel,
    openNew,
    closeNew,
    toggleStatus,
    closeStatus,
  }
}

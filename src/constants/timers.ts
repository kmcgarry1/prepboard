import accentPalette from './accents.json'
import type { AccentOption, TimerPreset } from '../types'

export const accentOptions = accentPalette as AccentOption[]
export const defaultAccent = accentOptions[0]!

export const quickPresets: TimerPreset[] = [
  { label: 'Soft boil', minutes: 6, accentId: 'herb' },
  { label: 'Tea', minutes: 4, accentId: 'citrus' },
  { label: 'Roast check', minutes: 45, accentId: 'clay' },
]

export const CLEAR_DELAY_MS = 5 * 60 * 1000

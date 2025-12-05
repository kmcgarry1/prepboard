import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTimerEngine } from '../src/composables/useTimerEngine'
import { accentOptions, defaultAccent } from '../src/constants/timers'
import type { TimerItem } from '../src/types'

const setupDocumentStub = () => {
  const listeners: Record<string, Array<() => void>> = {}
  const doc = {
    visibilityState: 'visible',
    addEventListener: vi.fn((event: string, cb: () => void) => {
      listeners[event] = listeners[event] || []
      listeners[event].push(cb)
    }),
    removeEventListener: vi.fn(),
  } as unknown as Document
  // @ts-expect-error test double
  globalThis.document = doc
  return { listeners }
}

const makeEngine = () => {
  const timers = ref<TimerItem[]>([])
  const clearRepeat = vi.fn()
  const announce = vi.fn()
  const noteInteraction = vi.fn()

  const engine = useTimerEngine({
    timers,
    accentOptions,
    defaultAccent,
    clearRepeat,
    announceCompletion: announce,
    pruneDelayMs: 5 * 60 * 1000,
    noteInteraction,
  })

  return { timers, clearRepeat, announce, noteInteraction, engine }
}

describe('useTimerEngine', () => {
  beforeEach(() => {
    setupDocumentStub()
  })

  it('starts, pauses, and resets a timer', () => {
    const { engine, timers, noteInteraction } = makeEngine()

    engine.addTimerFromPayload({ label: 'Test', minutes: 0, seconds: 10, accentId: accentOptions[0]!.id })
    expect(timers.value).toHaveLength(1)
    const timer = timers.value[0]!

    engine.startTimer(timer.id)
    expect(noteInteraction).toHaveBeenCalled()
    expect(timer.isRunning).toBe(true)
    expect(timer.status).toBe('running')

    engine.pauseTimer(timer.id)
    expect(timer.isRunning).toBe(false)
    expect(timer.status).toBe('paused')

    engine.resetTimer(timer.id)
    expect(timer.status).toBe('idle')
    expect(timer.remainingMs).toBe(timer.durationMs)
    expect(timer.notified).toBe(false)
  })

  it('resyncs running timers on visibility return and completes overdue timers', () => {
    const { engine, timers, announce } = makeEngine()

    engine.addTimerFromPayload({ label: 'Overdue', minutes: 0, seconds: 5, accentId: accentOptions[0]!.id })
    const timer = timers.value[0]!
    engine.startTimer(timer.id)

    timer.lastUpdated = Date.now() - 6000
    timer.remainingMs = 4000

    engine.resyncTimers()

    expect(timer.status).toBe('done')
    expect(timer.isRunning).toBe(false)
    expect(announce).toHaveBeenCalledTimes(1)
  })
})

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

export type AccentOption = {
  id: string;
  name: string;
  bg: string;
  fill: string;
  border: string;
  text: string;
  stroke: string;
};

export type TimerItem = {
  id: string;
  label: string;
  durationMs: number;
  remainingMs: number;
  status: TimerStatus;
  isRunning: boolean;
  accent: AccentOption;
  lastUpdated?: number;
  createdAt: number;
  notified?: boolean;
  completedAt?: number;
};

export type TimerPreset = {
  label: string;
  minutes: number;
  accentId: string;
};

export type NewTimerPayload = {
  label: string;
  minutes: number;
  seconds: number;
  accentId: string;
};

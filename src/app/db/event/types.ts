export enum EventStatuses {
  'draft' = 'draft',
  'moderation' = 'moderation',
  'reject' = 'reject',
  'approved' = 'approved'
}

export type EventType = {
  id: number;
  interval: number; // hours
  title: string;
  description: string;
  region_id: number;
  user_id: number;
  createdAt?: number;
  updatedAt?: number;
  startAt: number;
  finishAt: number;
  status: keyof typeof EventStatuses;
  finish_at: string;
  start_at: string;
};

export type LogParamsType = {
  eventId: number;
  total: number;
  createdAt: string;
}
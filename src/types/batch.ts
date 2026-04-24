import type { Tables, Enums } from "./supabase";
import type { QueueEvent } from "./queue";

export type BatchPhase = Enums<"phase_type">;
export type BatchEventType = Enums<"event_type">;

export interface BatchPlotSchool {
  name: string;
}

export interface BatchPlotDetail {
  id: string;
  label: string;
  schools: BatchPlotSchool | null;
}

export interface BatchDetail
  extends Pick<
    Tables<"batches">,
    "id" | "crop_name" | "class_name" | "status" | "created_at" | "finished_at" | "qr_token"
  > {
  phases: BatchPhase[];
  plots: BatchPlotDetail | null;
}

export interface BatchEventRecord
  extends Pick<
    Tables<"batch_events">,
    | "id"
    | "phase"
    | "event_type"
    | "description"
    | "photo_url"
    | "created_at"
    | "created_by"
  > {}

export interface BatchListItem
  extends Pick<
    Tables<"batches">,
    "id" | "crop_name" | "class_name" | "status" | "created_at" | "finished_at" | "qr_token"
  > {
  phases: BatchPhase[];
  plots: Pick<Tables<"plots">, "id" | "label"> | null;
  batch_events: Array<
    Pick<BatchEventRecord, "phase" | "event_type" | "description" | "created_at">
  >;
}

export interface PendingBatchEvent extends QueueEvent {
  event_type: BatchEventType;
  phase: BatchPhase;
  is_pending: true;
}

export type DisplayBatchEvent = BatchEventRecord | PendingBatchEvent;

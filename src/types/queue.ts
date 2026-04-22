import type { Enums } from "./supabase";

export type QueueEvent = {
  id: string;
  batch_id: string;
  event_type: Enums<"event_type">;
  phase: Enums<"phase_type">;
  description?: string | null;
  created_at: string;
  status: "pending" | "sent" | "error";
  retry_count: number;
};

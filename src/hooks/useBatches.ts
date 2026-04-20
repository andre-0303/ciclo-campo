import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Tables, Enums } from "../types/supabase";

export type BatchListItem = Pick<
  Tables<"batches">,
  "id" | "crop_name" | "class_name" | "status" | "created_at"
> & {
  plots: Pick<Tables<"plots">, "id" | "label"> | null;
  batch_events: Array<{
    phase: Enums<"phase_type">;
    event_type: Enums<"event_type">;
    description: string | null;
    created_at: string | null;
  }>;
};

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batches")
        .select(`
          id,
          crop_name,
          class_name,
          status,
          created_at,
          plots (
            id,
            label
          ),
          batch_events (
            phase,
            event_type,
            description,
            created_at
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .order("created_at", { foreignTable: "batch_events", ascending: false })
        .limit(1, { foreignTable: "batch_events" });

      if (error) {
        console.error("Erro ao buscar batches:", error);
        throw error;
      }

      return (data ?? []) as any as BatchListItem[];
    },
  });
}

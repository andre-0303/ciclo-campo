import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useIsOnline } from "./useIsOnline";
import type { Tables, Enums } from "../types/supabase";

export type BatchListItem = Pick<
  Tables<"batches">,
  "id" | "crop_name" | "class_name" | "status" | "created_at" | "phases"
> & {
  plots: Pick<Tables<"plots">, "id" | "label"> | null;
  qr_token: string | null;
  batch_events: Array<{
    phase: Enums<"phase_type">;
    event_type: Enums<"event_type">;
    description: string | null;
    created_at: string | null;
  }>;
};

export function useBatches() {
  const isOnline = useIsOnline();

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
          phases,
          created_at,
          qr_token,
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
    // Desabilita a query quando offline — sem requests, sem erros
    enabled: isOnline,
  });
}

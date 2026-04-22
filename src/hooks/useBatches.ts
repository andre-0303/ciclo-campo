import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useIsOnline } from "./useIsOnline";
import type { BatchListItem } from "../types/batch";

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

      return (data ?? []) as BatchListItem[];
    },
    // Desabilita a query quando offline — sem requests, sem erros
    enabled: isOnline,
  });
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useIsOnline } from "./useIsOnline";
import type { BatchListItem } from "./useBatches";

export function useBatch(id: string) {
  const isOnline = useIsOnline();

  return useQuery({
    queryKey: ["batch", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batches")
        .select(`
          id,
          crop_name,
          class_name,
          status,
          created_at,
          qr_token,
          plots (
            id,
            label
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as BatchListItem;
    },
    enabled: !!id && isOnline,
  });
}

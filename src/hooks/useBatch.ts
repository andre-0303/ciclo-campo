import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useIsOnline } from "./useIsOnline";
import type { BatchDetail } from "../types/batch";

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
          finished_at,
          qr_token,
          phases,
          plots (
            id,
            label,
            schools (
              name
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as BatchDetail;
    },
    enabled: !!id && isOnline,
  });
}

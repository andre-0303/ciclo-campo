import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function usePlots() {
  return useQuery({
    queryKey: ["plots"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plots").select("id, label");
      if (error) throw error;
      return data ?? [];
    },
  });
}
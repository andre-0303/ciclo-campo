import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Tables } from "../types/supabase";

export type PlotOption = Pick<Tables<"plots">, "id" | "label">;

export function usePlots() {
  return useQuery({
    queryKey: ["plots"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plots").select("id, label");

      if (error) {
        throw error;
      }

      return (data ?? []) as PlotOption[];
    },
  });
}

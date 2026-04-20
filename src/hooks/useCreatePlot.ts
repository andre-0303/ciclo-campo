import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlot } from "../services/plot.service";

export function useCreatePlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBatch } from "../services/batch.service";

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}
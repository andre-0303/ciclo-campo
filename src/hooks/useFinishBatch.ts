import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finishBatch } from "../services/batch.service";

export function useFinishBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => finishBatch(batchId),
    onSuccess: (_, batchId) => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
    },
  });
}

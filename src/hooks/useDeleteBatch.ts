import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBatch } from "../services/batch.service";

export function useDeleteBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}

import { Sprout } from "lucide-react";
import { Button } from "../ui";

interface CreateBatchActionsProps {
  isPending: boolean;
  onCancel: () => void;
}

export function CreateBatchActions({
  isPending,
  onCancel,
}: CreateBatchActionsProps) {
  return (
    <div className="space-y-3 pt-4">
      <Button type="submit" fullWidth disabled={isPending}>
        <Sprout className="h-5 w-5" />
        {isPending ? "Plantando..." : "Plantar agora"}
      </Button>

      <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
}

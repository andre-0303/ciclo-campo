import { Trash2 } from "lucide-react";
import { Button } from "../ui";

interface BatchTimelineDeleteActionProps {
  isDeleting: boolean;
  onDelete: () => void;
}

export function BatchTimelineDeleteAction({
  isDeleting,
  onDelete,
}: BatchTimelineDeleteActionProps) {
  return (
    <section className="pt-12 pb-8 flex justify-center">
      <Button
        variant="secondary"
        isLoading={isDeleting}
        className="text-red-600 bg-red-50/50 hover:bg-red-100/80 hover:text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-[0.2em] px-6 h-auto py-3 rounded-xl transition-colors"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" /> Excluir Ciclo Permanentemente
      </Button>
    </section>
  );
}

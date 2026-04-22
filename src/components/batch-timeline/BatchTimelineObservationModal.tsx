import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button, Modal } from "../ui";

interface BatchTimelineObservationModalProps {
  isOpen: boolean;
  loadingAction: string | null;
  onClose: () => void;
  onSave: (observation: string) => void;
}

export function BatchTimelineObservationModal({
  isOpen,
  loadingAction,
  onClose,
  onSave,
}: BatchTimelineObservationModalProps) {
  const [observation, setObservation] = useState("");

  const handleSave = () => {
    if (!observation.trim()) return;
    onSave(observation);
    setObservation(""); // Limpa para a próxima vez
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Anotação"
      className="max-w-sm rounded-3xl p-8 print:hidden"
    >
      <div className="space-y-4">
        <p className="text-xs font-bold text-on-surface-variant mb-2">
          Escreva a observação do que os alunos notaram sobre o canteiro e a planta:
        </p>

        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Ex: Folhas menores estão aparecendo..."
          className="w-full min-h-[120px] rounded-xl border border-black/10 bg-surface-container-lowest p-4 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 resize-none"
        />

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            className="w-full justify-center rounded-xl py-3"
            onClick={handleSave}
            disabled={!observation.trim() || loadingAction === "observation"}
            isLoading={loadingAction === "observation"}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Registrar Anotação
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-center rounded-xl bg-transparent border-transparent"
            onClick={onClose}
            disabled={loadingAction === "observation"}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

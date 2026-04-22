import { Link } from "react-router-dom";
import { BatchCard } from "../BatchCard";
import { Card, CardEyebrow, EmptyState } from "../ui";
import type { BatchListItem } from "../../types/batch";

interface DashboardBatchGridProps {
  batches: BatchListItem[] | undefined;
}

function getLastEventDescription(batch: BatchListItem) {
  const latestEvent = batch.batch_events?.[0];

  return (
    latestEvent?.description ||
    (latestEvent?.event_type === "fase_change"
      ? `Fase: ${latestEvent.phase}`
      : "Sincronizando...") ||
    "Ciclo iniciado"
  );
}

function getBatchDaysActive(createdAt: string | null) {
  return Math.floor(
    (Date.now() - new Date(createdAt ?? Date.now()).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export function DashboardBatchGrid({ batches }: DashboardBatchGridProps) {
  if (!batches || batches.length === 0) {
    return (
      <EmptyState
        title="Nenhum ciclo ativo no momento"
        description="Inicie um novo ciclo clicando no botao acima para comecar a acompanhar o plantio com sua turma."
      />
    );
  }

  return (
    <Card variant="section" className="space-y-6">
      <header className="flex flex-col gap-1">
        <CardEyebrow>Painel de controle</CardEyebrow>
        <h2 className="font-display text-2xl text-on-surface">
          Ciclos da escola
        </h2>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => {
          const phase = batch.batch_events?.[0]?.phase || "plantio";

          return (
            <Link key={batch.id} to={`/ciclo/${batch.id}`}>
              <BatchCard
                crop={batch.crop_name}
                className={batch.class_name}
                plot={batch.plots?.label || "Sem canteiro central"}
                phase={phase}
                days={getBatchDaysActive(batch.created_at)}
                lastEvent={getLastEventDescription(batch)}
              />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

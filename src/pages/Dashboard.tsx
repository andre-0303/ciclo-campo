import { Link } from "react-router-dom";
import { BatchCard } from "../components/BatchCard";
import { useBatches } from "../hooks/useBatches";
import { useProfile } from "../hooks/useProfile";
import { PageHeader, EmptyState, Button, Card, CardEyebrow } from "../components/ui";
import { Plus } from "lucide-react";

export function Dashboard() {
  const { data, isLoading, error } = useBatches();
  const { data: profile } = useProfile();

  const nome = profile?.name?.split(" ")[0] || "Professor";

  if (isLoading) {
    return (
      <div className="app-shell">
        <div className="page-shell">
          <p className="text-on-surface-variant p-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="page-shell">
          <p className="text-red-500 p-4">Erro ao carregar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="page-shell">
        <PageHeader
          eyebrow={`Bom dia, Prof. ${nome}`}
          title="Seus Ciclos Ativos"
          description="Acompanhe o desenvolvimento dos canteiros sob sua responsabilidade."
          action={
            <Link to="/create-batch">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Iniciar Novo Ciclo
              </Button>
            </Link>
          }
        />

        {(!data || data.length === 0) ? (
          <EmptyState
            title="Nenhum ciclo ativo no momento"
            description="Inicie um novo ciclo clicando no botao acima para comecar a acompanhar o plantio com sua turma."
          />
        ) : (
          <Card variant="section" className="space-y-6">
            <header className="flex flex-col gap-1">
              <CardEyebrow>Painel de controle</CardEyebrow>
              <h2 className="font-display text-2xl text-on-surface">Ciclos da escola</h2>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((batch) => (
                <BatchCard
                  key={batch.id}
                  crop={batch.crop_name}
                  className={batch.class_name}
                  plot={batch.plots?.label || "Sem canteiro central"}
                  phase="plantio"
                  days={Math.floor(
                    (Date.now() - new Date(batch.created_at ?? Date.now()).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                  lastEvent="Atualizado recentemente"
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

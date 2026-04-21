import { Link } from "react-router-dom";
import { BatchCard } from "../components/BatchCard";
import { useBatches } from "../hooks/useBatches";
import { useProfile } from "../hooks/useProfile";
import { useIsOnline } from "../hooks/useIsOnline";
import {
  PageHeader,
  EmptyState,
  Button,
  Card,
  CardEyebrow,
} from "../components/ui";
import { Plus, Map, LogOut, WifiOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../lib/queryClient";

export function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, fetchStatus } = useBatches();
  const { data: profile } = useProfile();
  const isOnline = useIsOnline();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate("/login");
  };

  const nome = profile?.name?.split(" ")[0] || "Professor";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // Offline sem dados em cache
  if (!isOnline && !data) {
    return (
      <div className="app-shell">
        <div className="page-shell">
          <PageHeader
            eyebrow={`${greeting}, Prof. ${nome}`}
            eyebrowAction={
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-on-surface-variant hover:text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            }
            title="Seus Ciclos Ativos"
          />
          <Card variant="section" className="flex flex-col items-center py-16 text-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-display text-xl font-bold text-on-surface">
              Você está offline
            </h3>
            <p className="text-on-surface-variant font-medium text-sm max-w-[280px]">
              Conecte-se à internet para carregar seus ciclos. Os dados aparecerão automaticamente quando a conexão voltar.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Online, carregando dados pela primeira vez
  if (isLoading && fetchStatus === 'fetching') {
    return (
      <div className="app-shell">
        <div className="page-shell">
          <p className="text-on-surface-variant p-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error && isOnline) {
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
          eyebrow={`${greeting}, Prof. ${nome}`}
          eyebrowAction={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          }
          title="Seus Ciclos Ativos"
          description="Acompanhe o desenvolvimento dos canteiros sob sua responsabilidade."
          action={
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/create-batch">
                <Button variant="primary" className="px-6 shadow-2xl">
                  <Plus className="h-5 w-5" />
                  Iniciar Novo Ciclo
                </Button>
              </Link>
              <Link to="/create-plot">
                <Button variant="secondary" className="px-6 shadow-ambient-md">
                  <Map className="h-5 w-5" />
                  Criar Canteiro
                </Button>
              </Link>
            </div>
          }
        />

        {!data || data.length === 0 ? (
          <EmptyState
            title="Nenhum ciclo ativo no momento"
            description="Inicie um novo ciclo clicando no botao acima para comecar a acompanhar o plantio com sua turma."
          />
        ) : (
          <Card variant="section" className="space-y-6">
            <header className="flex flex-col gap-1">
              <CardEyebrow>Painel de controle</CardEyebrow>
              <h2 className="font-display text-2xl text-on-surface">
                Ciclos da escola
              </h2>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((batch) => {
                const latestEvent = batch.batch_events?.[0];
                const phase = latestEvent?.phase || "plantio";
                const lastEventDescription = latestEvent?.description || 
                  (latestEvent?.event_type === 'fase_change' ? `Fase: ${latestEvent.phase}` : "Sincronizando...") || 
                  "Ciclo iniciado";

                return (
                  <Link key={batch.id} to={`/ciclo/${batch.id}`}>
                    <BatchCard
                      crop={batch.crop_name}
                      className={batch.class_name}
                      plot={batch.plots?.label || "Sem canteiro central"}
                      phase={phase as any}
                      days={Math.floor(
                        (Date.now() -
                          new Date(batch.created_at ?? Date.now()).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                      lastEvent={lastEventDescription}
                    />
                  </Link>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

import { LogOut, WifiOff } from "lucide-react";
import { Button, Card, PageHeader } from "../ui";

interface DashboardOfflineStateProps {
  greeting: string;
  firstName: string;
  onLogout: () => Promise<void>;
}

export function DashboardOfflineState({
  greeting,
  firstName,
  onLogout,
}: DashboardOfflineStateProps) {
  return (
    <div className="app-shell">
      <div className="page-shell">
        <PageHeader
          eyebrow={`${greeting}, Prof. ${firstName}`}
          eyebrowAction={
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-on-surface-variant hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          }
          title="Seus Ciclos Ativos"
        />
        <Card
          variant="section"
          className="flex flex-col items-center py-16 text-center gap-4"
        >
          <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface">
            Você está offline
          </h3>
          <p className="text-on-surface-variant font-medium text-sm max-w-[280px]">
            Conecte-se à internet para carregar seus ciclos. Os dados aparecerão
            automaticamente quando a conexão voltar.
          </p>
        </Card>
      </div>
    </div>
  );
}

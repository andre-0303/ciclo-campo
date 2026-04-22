import { Link } from "react-router-dom";
import { LogOut, Map, Plus } from "lucide-react";
import { Button, PageHeader } from "../ui";

interface DashboardHeaderProps {
  greeting: string;
  firstName: string;
  onLogout: () => Promise<void>;
}

export function DashboardHeader({
  greeting,
  firstName,
  onLogout,
}: DashboardHeaderProps) {
  return (
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
  );
}

import { useNavigate } from "react-router-dom";
import { queryClient } from "../lib/queryClient";
import { supabase } from "../lib/supabase";
import { useBatches } from "../hooks/useBatches";
import { useIsOnline } from "../hooks/useIsOnline";
import { useProfile } from "../hooks/useProfile";
import {
  DashboardBatchGrid,
  DashboardHeader,
  DashboardOfflineState,
} from "../components/dashboard";

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
}

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

  const firstName = profile?.name?.split(" ")[0] || "Professor";
  const greeting = getGreeting();

  if (!isOnline && !data) {
    return (
      <DashboardOfflineState
        greeting={greeting}
        firstName={firstName}
        onLogout={handleLogout}
      />
    );
  }

  if (isLoading && fetchStatus === "fetching") {
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
        <DashboardHeader
          greeting={greeting}
          firstName={firstName}
          onLogout={handleLogout}
        />
        <DashboardBatchGrid batches={data} />
      </div>
    </div>
  );
}

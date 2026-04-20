import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "../components/ui";
import { AuthContext } from "../context/auth-context";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="page-shell">
          <Card variant="section" className="min-h-60 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

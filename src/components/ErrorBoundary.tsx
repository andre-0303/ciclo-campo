import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "./ui";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-surface-container-lowest text-center">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-on-surface mb-2">Algo deu errado</h1>
          <p className="text-on-surface-variant font-medium text-sm max-w-[280px] mb-8">
            Ocorreu um erro inesperado na interface. Tente recarregar a página para continuar.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="rounded-xl px-8"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar App
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

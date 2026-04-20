import { useState, createContext, useContext, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "../../lib/cn";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-3">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                "flex min-w-[300px] items-center gap-3 rounded-2xl p-4 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300",
                t.type === "success"
                  ? "bg-primary text-on-primary"
                  : "bg-red-600 text-white"
              )}
            >
              {t.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span className="flex-1 text-sm font-bold tracking-tight">
                {t.message}
              </span>
              <button onClick={() => removeToast(t.id)}>
                <X className="h-4 w-4 opacity-60" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

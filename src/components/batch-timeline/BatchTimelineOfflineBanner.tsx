import { WifiOff } from "lucide-react";

export function BatchTimelineOfflineBanner() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
        <WifiOff className="h-4 w-4 text-amber-600" />
      </div>
      <div>
        <p className="text-xs font-black text-amber-800 uppercase tracking-widest leading-none">
          Modo Offline
        </p>
        <p className="text-[10px] font-bold text-amber-600/80 mt-0.5">
          Seus registros serão sincronizados ao voltar a internet.
        </p>
      </div>
    </div>
  );
}

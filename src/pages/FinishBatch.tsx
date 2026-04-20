import { useParams, useNavigate } from "react-router-dom";
import { useBatch } from "../hooks/useBatch";
import { useBatchEvents } from "../hooks/useBatchEvents";
import { useFinishBatch } from "../hooks/useFinishBatch";
import { useToast } from "../components/ui/Toast";
import { PageHeader, Button } from "../components/ui";
import { 
  Check, 
  Sparkles
} from "lucide-react";

export function FinishBatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: batch, isLoading: isLoadingBatch } = useBatch(id!);
  const { data: events, isLoading: isLoadingEvents } = useBatchEvents(id!);
  const { mutateAsync: finish, isPending } = useFinishBatch();

  const handleFinish = async () => {
    try {
      await finish(id!);
      toast("Ciclo concluído com sucesso!");
      navigate("/");
    } catch (err: any) {
      toast(err.message || "Erro ao finalizar ciclo", "error");
    }
  };

  if (isLoadingBatch || isLoadingEvents) {
    return (
      <div className="app-shell flex items-center justify-center">
        <p className="text-on-surface-variant animate-pulse">Calculando resumo do ciclo...</p>
      </div>
    );
  }

  // Cálculos de Resumo
  const stats = {
    days: batch?.created_at ? Math.floor((Date.now() - new Date(batch.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
    records: events?.length || 0,
    irrigations: events?.filter(e => e.event_type === 'irrigation').length || 0,
    fertilizations: events?.filter(e => e.event_type === 'fertilization').length || 0,
  };

  return (
    <div className="app-shell bg-surface-container-lowest">
      <div className="page-shell max-w-md mx-auto">
        <PageHeader 
          title="Finalizar Ciclo" 
          onBack={() => navigate(`/ciclo/${id}`)}
        />

        <div className="space-y-6">
          {/* HARVEST CARD */}
          <div className="bg-green-50 rounded-[2rem] p-8 text-center space-y-4 border border-green-100 shadow-sm">
            <div className="mx-auto h-20 w-20 text-5xl flex items-center justify-center">
              🧺
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-black text-green-800 tracking-tight flex items-center justify-center gap-2">
                Hora da colheita!
                <Sparkles className="h-5 w-5 text-green-500" />
              </h2>
              <p className="text-sm font-bold text-green-700/60 uppercase tracking-widest">
                {batch?.crop_name} • {batch?.class_name}
              </p>
            </div>
          </div>

          {/* STATS GRID */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em] px-1">Resumo do ciclo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low rounded-[1.5rem] p-5 text-center space-y-1 border border-black/5">
                <div className="text-3xl font-black text-on-surface leading-none">{stats.days}</div>
                <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">dias de cultivo</div>
              </div>
              <div className="bg-surface-container-low rounded-[1.5rem] p-5 text-center space-y-1 border border-black/5">
                <div className="text-3xl font-black text-on-surface leading-none">{stats.records}</div>
                <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">registros feitos</div>
              </div>
              <div className="bg-surface-container-low rounded-[1.5rem] p-5 text-center space-y-1 border border-black/5">
                <div className="text-3xl font-black text-on-surface leading-none">{stats.irrigations}</div>
                <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">irrigações</div>
              </div>
              <div className="bg-surface-container-low rounded-[1.5rem] p-5 text-center space-y-1 border border-black/5">
                <div className="text-3xl font-black text-on-surface leading-none">{stats.fertilizations}</div>
                <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">adubações</div>
              </div>
            </div>
          </section>

          {/* PHOTO SECTION placeholder */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em] px-1">Foto da turma com a colheita</h3>
            <div className="bg-surface-container-low border-2 border-dashed border-on-surface-variant/10 rounded-[1.5rem] p-8 flex flex-col items-center gap-3 group hover:border-primary/20 transition-colors cursor-pointer">
              <div className="text-2xl">📸</div>
              <span className="text-sm font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Registrar o momento</span>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              variant="primary" 
              className="h-16 rounded-2xl bg-green-800 text-white shadow-xl shadow-green-900/20"
              isLoading={isPending}
              onClick={handleFinish}
            >
              <Check className="h-5 w-5 mr-2" />
              Concluir e liberar canteiro
            </Button>
            <Button 
              variant="secondary" 
              className="h-16 rounded-2xl bg-white text-green-800 border-2 border-green-800/20"
              onClick={() => navigate(`/ciclo/${id}`)}
              disabled={isPending}
            >
              Voltar ao canteiro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

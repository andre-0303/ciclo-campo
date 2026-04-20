import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useBatchEvents } from "../hooks/useBatchEvents";
import { useBatch } from "../hooks/useBatch";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { PageHeader, Card, CardEyebrow, Button, Modal } from "../components/ui";
import { useToast } from "../components/ui/Toast";
import { QRCodeCanvas } from "qrcode.react";
import {
  Calendar,
  Droplets,
  FlaskConical,
  Bug,
  Eye,
  RefreshCw,
  MessageSquarePlus,
  MapPin,
  Users,
  Check,
  ChevronRight,
  Printer,
  QrCode,
} from "lucide-react";
import { cn } from "../lib/cn";

const eventConfig: Record<string, { label: string; icon: any; color: string }> =
  {
    fase_change: {
      label: "Mudança de Fase",
      icon: RefreshCw,
      color: "text-blue-600 bg-blue-50",
    },
    irrigation: {
      label: "Irrigação",
      icon: Droplets,
      color: "text-cyan-600 bg-cyan-50",
    },
    fertilization: {
      label: "Adubação",
      icon: FlaskConical,
      color: "text-orange-600 bg-orange-50",
    },
    pest_control: {
      label: "Controle de Pragas",
      icon: Bug,
      color: "text-amber-600 bg-amber-50",
    },
    observation: {
      label: "Observação",
      icon: Eye,
      color: "text-slate-600 bg-slate-50",
    },
  };

const PHASE_OPTIONS = [
  {
    value: "desenvolvimento",
    label: "Desenvolvimento",
    description: "Crescimento vegetativo e folhagem",
  },
  {
    value: "floracao",
    label: "Floração",
    description: "Surgimento das primeiras flores",
  },
  {
    value: "frutificacao",
    label: "Frutificação",
    description: "Formação e maturação dos frutos",
  },
  {
    value: "colheita",
    label: "Colheita",
    description: "Fase final de coleta dos produtos",
  },
];

export function BatchTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: batch, isLoading: isLoadingBatch } = useBatch(id!);
  const { data: events, isLoading: isLoadingEvents } = useBatchEvents(id!);
  const { mutateAsync: createEvent } = useCreateEvent(id!);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Auto-gera token se não existir (para batches antigos)
    if (!isLoadingBatch && batch && !batch.qr_token) {
      const updateToken = async () => {
        const { error } = await supabase
          .from("batches")
          .update({ qr_token: crypto.randomUUID() })
          .eq("id", id!);

        if (!error) {
          queryClient.invalidateQueries({ queryKey: ["batch", id] });
          queryClient.invalidateQueries({ queryKey: ["batches"] });
        }
      };
      updateToken();
    }
  }, [batch, isLoadingBatch, id, queryClient]);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const handleQuickAction = async (
    type: string,
    description: string,
    nextPhase?: string,
  ) => {
    if (loadingAction) return;

    setLoadingAction(type);
    try {
      await createEvent({
        batch_id: id!,
        event_type: type as any,
        description,
        next_phase: nextPhase as any,
      });
      toast(`Registro de ${description.toLowerCase()} realizado!`);
      if (nextPhase) setIsPhaseModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Erro ao realizar ação", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingBatch || isLoadingEvents) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
            Sincronizando cultivo...
          </p>
        </div>
      </div>
    );
  }

  const currentPhase = events?.[0]?.phase || "plantio";
  const phaseIndex = PHASE_OPTIONS.findIndex((p) => p.value === currentPhase);
  const progress = ((phaseIndex + 1) / (PHASE_OPTIONS.length + 1)) * 100;

  const stats = {
    irrigationCount:
      events?.filter((e) => e.event_type === "irrigation").length || 0,
    totalEvents: events?.length || 0,
    daysActive: batch?.created_at
      ? Math.floor(
          (Date.now() - new Date(batch.created_at).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0,
    phaseStart: events?.filter((e) => e.phase === currentPhase).slice(-1)[0]
      ?.created_at,
  };

  const daysInCurrentPhase = stats.phaseStart
    ? Math.floor(
        (Date.now() - new Date(stats.phaseStart).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const qrUrl = batch?.qr_token
    ? `${window.location.origin}/ciclo/token/${batch.qr_token}`
    : "";

  return (
    <div className="app-shell bg-surface-container-lowest">
      {/* AREA DE IMPRESSAO (Sempre presente no DOM para o Canvas renderizar, mas invisível na tela) */}
      <div className="flex opacity-0 pointer-events-none print:opacity-100 print:pointer-events-auto fixed -z-50 print:z-[9999] inset-0 bg-white flex-col items-center justify-center p-20 text-center">
        <div
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
          className="border-[12px] border-primary p-16 rounded-[4rem] space-y-12 max-w-2xl w-full bg-white"
        >
          <div className="space-y-6">
            <h1 className="text-7xl font-black text-on-surface tracking-tighter">
              {batch?.crop_name}
            </h1>
            <div className="flex items-center justify-center gap-6 text-3xl font-bold text-primary/60 uppercase tracking-widest">
              <span>{batch?.class_name}</span>
              <span className="opacity-30">•</span>
              <span>{batch?.plots?.label}</span>
            </div>
          </div>

          <div
            style={{
              printColorAdjust: "exact",
              WebkitPrintColorAdjust: "exact",
              background: "white",
            }}
            className="p-10 bg-white inline-block rounded-3xl border-4 border-black/5"
          >
            {qrUrl ? (
              <QRCodeCanvas
                value={qrUrl}
                size={380}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            ) : (
              <div className="w-[380px] h-[380px] flex items-center justify-center border-2 border-dashed border-black/10 rounded-xl">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-20">
                  Token não gerado
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-2xl font-black text-on-surface tracking-widest uppercase">
              Escaneie para registrar
            </p>
            <div className="text-primary font-bold text-base opacity-40">
              CicloCampo • Diário de Bordo Digital
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell max-w-2xl print:hidden">
        <PageHeader title="Diário do Ciclo" onBack={() => navigate("/")} />

        {/* BATCH HEADER - CONTEXT */}
        <Card
          variant="section"
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden relative rounded-3xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <RefreshCw className="h-32 w-32 rotate-12" />
          </div>

          <div className="flex flex-col gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-2xl shadow-primary/40 ring-4 ring-white">
                <RefreshCw className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <CardEyebrow className="mb-0 text-primary font-black uppercase tracking-[0.2em]">
                    Fase: {currentPhase}
                  </CardEyebrow>
                </div>
                <h1 className="text-3xl font-display font-black text-on-surface tracking-tight leading-none">
                  {batch?.crop_name}
                </h1>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/60">
                <span>Progresso do Ciclo</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary shadow-lg shadow-primary/20 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md border border-black/5 shadow-sm">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black text-on-surface uppercase tracking-wider">
                  {batch?.class_name}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md border border-black/5 shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black text-on-surface uppercase tracking-wider">
                  {batch?.plots?.label}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ETIQUETA QR SECTION */}
        <section className="space-y-4">
          <CardEyebrow className="px-1 tracking-[0.2em]">
            Etiqueta do Canteiro
          </CardEyebrow>
          <Card className="p-5 flex items-center justify-between gap-6 rounded-2xl border-0 bg-surface-container-low">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                <QrCode className="h-8 w-8 text-on-surface-variant/40" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-on-surface uppercase tracking-tight">
                  Etiqueta de Acesso
                </h3>
                <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">
                  Imprima para colar no canteiro
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handlePrint}
              className="rounded-xl px-4 py-2 h-auto text-xs font-black uppercase tracking-widest bg-white shadow-sm hover:translate-y-0 active:scale-95"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </Card>
        </section>

        {/* STATISTICS SUMMARY */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
            <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1 leading-none">
              Irrigações
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-on-surface">
                {stats.irrigationCount}
              </span>
              <Droplets className="h-3 w-3 text-cyan-500" />
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
            <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1 leading-none">
              Dias na Fase
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-on-surface">
                {daysInCurrentPhase}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant">
                DIAS
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
            <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1 leading-none">
              Frequência
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-on-surface">
                {(stats.totalEvents / (stats.daysActive || 1)).toFixed(1)}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant">
                /DIA
              </span>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="space-y-4">
          <CardEyebrow className="px-1 tracking-[0.2em]">
            Ações Rápidas
          </CardEyebrow>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="secondary"
              isLoading={loadingAction === "irrigation"}
              onClick={() => handleQuickAction("irrigation", "Irrigação")}
              className="flex-col h-auto py-6 gap-3 rounded-2xl bg-surface-container-high border-0 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-300 group"
            >
              <Droplets className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
                Irrigar
              </span>
            </Button>

            <Button
              variant="secondary"
              isLoading={loadingAction === "observation"}
              onClick={() => handleQuickAction("observation", "Observação")}
              className="flex-col h-auto py-6 gap-3 rounded-2xl bg-surface-container-high border-0 hover:bg-slate-100 transition-all duration-300 group"
            >
              <MessageSquarePlus className="h-8 w-8 group-hover:translate-y-[-2px] transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
                Anotar
              </span>
            </Button>

            <Button
              variant="secondary"
              isLoading={loadingAction === "fertilization"}
              onClick={() => handleQuickAction("fertilization", "Adubação")}
              className="flex-col h-auto py-6 gap-3 rounded-2xl bg-surface-container-high border-0 hover:bg-orange-50 hover:text-orange-700 transition-all duration-300 group"
            >
              <FlaskConical className="h-8 w-8 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
                Adubar
              </span>
            </Button>

            {currentPhase === "colheita" ? (
              <Button
                variant="primary"
                onClick={() => navigate(`/ciclo/${id}/finalizar`)}
                className="flex-col h-auto py-6 gap-3 rounded-2xl bg-green-700 border-0 shadow-2xl shadow-green-900/20"
              >
                <Check className="h-8 w-8" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
                  Finalizar
                </span>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setIsPhaseModalOpen(true)}
                className="flex-col h-auto py-6 gap-3 rounded-2xl shadow-2xl shadow-primary/30"
              >
                <RefreshCw className="h-8 w-8" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
                  Avançar
                </span>
              </Button>
            )}
          </div>
        </section>

        {/* TIMELINE */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-1">
            <CardEyebrow className="tracking-[0.2em] mb-0">
              Atividades
            </CardEyebrow>
            <span className="text-[10px] font-black text-on-surface-variant/40 bg-surface-container px-2 py-1 rounded-full uppercase tracking-widest">
              {events?.length || 0} Registros
            </span>
          </div>

          {!events || events.length === 0 ? (
            <Card
              variant="section"
              className="flex flex-col items-center py-20 text-center bg-transparent border-dashed border-2 border-on-surface-variant/10 rounded-2xl"
            >
              <div className="h-20 w-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
                <Calendar className="h-10 w-10 text-on-surface-variant/20" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                Ciclo Iniciado
              </h3>
              <p className="text-on-surface-variant font-medium text-sm max-w-[200px]">
                Comece a registrar as atividades da horta para gerar o ledger.
              </p>
            </Card>
          ) : (
            <div className="space-y-4 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent -z-10" />

              {(showAllEvents ? events : events.slice(0, 5)).map((event) => {
                const config =
                  eventConfig[event.event_type] || eventConfig.observation;
                const Icon = config.icon;

                return (
                  <Card
                    key={event.id}
                    className="group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white p-5 rounded-2xl"
                  >
                    <div className="flex gap-5">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner",
                          config.color,
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                                {event.phase}
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-black text-on-surface tracking-tight leading-none mt-1">
                              {event.event_type === "fase_change"
                                ? `Fase: ${event.phase}`
                                : config.label}
                            </h3>
                          </div>
                          <time className="text-[10px] font-black tabular-nums tracking-wider text-on-surface-variant/40">
                            {event.created_at
                              ? new Date(event.created_at).toLocaleTimeString(
                                  "pt-BR",
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : "--"}
                          </time>
                        </div>

                        {event.description && (
                          <p className="text-on-surface-variant font-bold leading-snug text-sm opacity-80">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}

              {events.length > 5 && (
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors flex items-center justify-center gap-2 bg-white/40 rounded-2xl border border-dashed border-primary/10"
                >
                  {showAllEvents
                    ? "Ocultar atividades antigas"
                    : `Ver mais ${events.length - 5} atividades`}
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* PHASE MODAL */}
      <Modal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        title="Novo Estágio de Cultivo"
        className="max-w-sm rounded-3xl p-8 print:hidden"
      >
        <div className="space-y-3">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6 opacity-60">
            Selecione a próxima fase lógica:
          </p>
          <div className="grid gap-3">
            {PHASE_OPTIONS.map((option) => {
              const isActive = currentPhase === option.value;
              return (
                <button
                  key={option.value}
                  disabled={loadingAction === "fase_change"}
                  onClick={() =>
                    handleQuickAction(
                      "fase_change",
                      `Mudança para ${option.label}`,
                      option.value,
                    )
                  }
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300",
                    isActive
                      ? "border-primary bg-primary text-on-primary shadow-2xl shadow-primary/30"
                      : "border-on-surface-variant/5 bg-surface-container-low hover:border-primary/20 hover:bg-primary/5 hover:scale-[1.02]",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-white/20"
                        : "bg-white shadow-sm group-hover:bg-primary/10",
                    )}
                  >
                    <RefreshCw
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-white" : "text-primary",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black uppercase tracking-widest leading-none mb-1">
                      {option.label}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] font-bold leading-tight uppercase opacity-60",
                        isActive && "text-white",
                      )}
                    >
                      {option.description}
                    </div>
                  </div>
                  {isActive ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5 opacity-20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { MapPin, Printer, QrCode, RefreshCw, School, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, CardEyebrow } from "../ui";
import type { BatchDetail, BatchPhase } from "../../types/batch";

interface BatchTimelineOverviewProps {
  batch: BatchDetail | undefined;
  currentPhase: BatchPhase;
  pendingCount: number;
  progress: number;
  onPrint: () => void;
}

export function BatchTimelineOverview({
  batch,
  currentPhase,
  pendingCount,
  progress,
  onPrint,
}: BatchTimelineOverviewProps) {
  return (
    <>
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
                <CardEyebrow className="mb-0 text-primary font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <span>Fase: {currentPhase}</span>
                  {pendingCount > 0 && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] animate-pulse">
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                      {pendingCount} PENDENTE(S)
                    </span>
                  )}
                </CardEyebrow>
              </div>
              <h1 className="text-3xl font-display font-black text-on-surface tracking-tight leading-none">
                {batch?.crop_name}
              </h1>
            </div>
          </div>

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
              <School className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-black text-on-surface uppercase tracking-wider">
                {batch?.plots?.schools?.name || "..."}
              </span>
            </div>
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
            onClick={onPrint}
            className="rounded-xl px-4 py-2 h-auto text-xs font-black uppercase tracking-widest bg-white shadow-sm hover:translate-y-0 active:scale-95"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </Card>
      </section>

      {batch?.status === "completed" && (
        <section className="space-y-4">
          <CardEyebrow className="px-1 tracking-[0.2em] text-green-700">
            Ciclo Finalizado
          </CardEyebrow>
          <Card className="p-6 flex flex-col gap-6 rounded-3xl border-2 border-green-100 bg-green-50/30">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200">
                <Award className="h-9 w-9" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-black text-green-900 leading-tight">
                  Certificado de Origem
                </h3>
                <p className="text-xs font-bold text-green-700/60 uppercase tracking-widest">
                  QR Code e Selo de Qualidade
                </p>
              </div>
            </div>
            
            <p className="text-sm font-medium text-green-800/80 leading-relaxed">
              Este ciclo foi concluído com sucesso. O certificado contém o QR Code para os consumidores verem toda a história deste alimento.
            </p>

            <Link to={`/ciclo/${batch.id}/certificado`}>
              <Button
                variant="primary"
                className="w-full h-14 rounded-2xl bg-green-800 text-white shadow-xl shadow-green-900/20"
              >
                <Award className="h-5 w-5 mr-2" />
                Ver e Imprimir Certificado
              </Button>
            </Link>
          </Card>
        </section>
      )}
    </>
  );
}

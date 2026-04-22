import { QRCodeCanvas } from "qrcode.react";
import type { BatchDetail } from "../../types/batch";

interface BatchTimelinePrintLabelProps {
  batch: BatchDetail | undefined;
  qrUrl: string;
}

export function BatchTimelinePrintLabel({
  batch,
  qrUrl,
}: BatchTimelinePrintLabelProps) {
  return (
    <div className="flex opacity-0 pointer-events-none print:opacity-100 print:pointer-events-auto fixed -z-50 print:z-[9999] inset-0 bg-white flex-col items-center justify-center p-20 text-center">
      <div
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        className="border-[12px] border-primary p-16 rounded-[4rem] space-y-12 max-w-2xl w-full bg-white"
      >
        <div className="space-y-6">
          <h1 className="text-7xl font-black text-on-surface tracking-tighter">
            {batch?.crop_name}
          </h1>
          <div className="flex items-center justify-center gap-6 text-2xl font-bold text-primary/60 uppercase tracking-widest">
            <span>{batch?.plots?.schools?.name}</span>
            <span className="opacity-30">•</span>
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
  );
}

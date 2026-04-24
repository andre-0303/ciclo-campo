import { QRCodeCanvas } from 'qrcode.react'
import { CertificateData } from '../types/certificate'

interface StatProps {
  label: string;
  value: number | string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
      <div className="text-2xl font-black text-on-surface">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">{label}</div>
    </div>
  );
}

export function Certificate({ data }: { data: CertificateData }) {
  const origin = window.location.origin;

  return (
    <div className="bg-white text-on-surface p-12 max-w-[850px] mx-auto shadow-2xl rounded-[3rem] border border-black/5 print:shadow-none print:border-none print:p-0">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          {data.school_name}
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
          CicloCampo • Diário de Bordo
        </div>
      </div>

      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-black tracking-tighter mb-4">
          Certificado de Origem
        </h1>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-4" />
        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
          Alimento Cultivado com Ciência e Cuidado
        </p>
      </div>

      {/* FOTO */}
      {data.photo_url && (
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
          <img
            src={data.photo_url}
            className="w-full h-[350px] object-cover rounded-3xl shadow-xl"
            alt="Foto da colheita"
          />
        </div>
      )}

      {/* DESCRIÇÃO */}
      <div className="text-center mb-12 space-y-4">
        <p className="text-xl leading-relaxed text-on-surface-variant">
          Este <strong className="text-on-surface font-black">{data.crop_name}</strong> foi cultivado com dedicação pela turma{" "}
          <strong className="text-on-surface font-black">{data.class_name}</strong> no{" "}
          <strong className="text-on-surface font-black">{data.plot_label}</strong>.
        </p>

        <p className="text-lg text-on-surface-variant/80">
          Foram <strong className="text-primary">{data.days} dias</strong> de monitoramento ativo, desde{" "}
          <span className="font-bold">{new Date(data.start_date).toLocaleDateString('pt-BR')}</span> até{" "}
          <span className="font-bold">{new Date(data.end_date).toLocaleDateString('pt-BR')}</span>.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 text-center mb-12">
        <Stat label="Dias de Ciclo" value={data.days} />
        <Stat label="Irrigações" value={data.irrigations} />
        <Stat label="Adubações" value={data.fertilizations} />
      </div>

      {/* QR & FOOTER */}
      <div className="flex flex-col items-center pt-8 border-t border-dashed border-black/10">
        <div className="p-4 bg-white rounded-2xl border-2 border-black/5 shadow-sm mb-4">
          <QRCodeCanvas
            value={`${origin}/ciclo/token/${data.qr_token}`}
            size={140}
            level="H"
          />
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 text-center max-w-[200px] leading-relaxed">
          Escaneie para ver a linha do tempo completa e fotos do desenvolvimento
        </p>
      </div>
    </div>
  );
}

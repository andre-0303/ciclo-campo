import { useParams, useNavigate } from 'react-router-dom';
import { Certificate } from '../components/Certificate';
import { useBatch } from '../hooks/useBatch';
import { useBatchEvents } from '../hooks/useBatchEvents';
import { PageHeader, Button } from '../components/ui';
import { Printer, RefreshCw, ChevronLeft } from 'lucide-react';
import { CertificateData } from '../types/certificate';

export function CertificatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: batch, isLoading: isLoadingBatch } = useBatch(id!);
  const { data: events, isLoading: isLoadingEvents } = useBatchEvents(id!);

  if (isLoadingBatch || isLoadingEvents) {
    return (
      <div className="app-shell flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!batch) return <div>Lote não encontrado.</div>;

  // Cálculo de dados reais
  const start_date = batch.created_at || new Date().toISOString();
  const end_date = batch.finished_at || new Date().toISOString();
  
  const days = Math.max(1, Math.floor(
    (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)
  ));

  const irrigations = events?.filter(e => e.event_type === 'irrigation').length || 0;
  const fertilizations = events?.filter(e => e.event_type === 'fertilization').length || 0;

  // Busca a última foto (opcional: pode ser a da colheita se houver)
  const photo_url = undefined; // Placeholder: No futuro, pegar de um evento de foto

  const certificateData: CertificateData = {
    school_name: batch.plots?.schools?.name || 'Escola',
    crop_name: batch.crop_name,
    class_name: batch.class_name,
    plot_label: batch.plots?.label || 'Canteiro',
    start_date,
    end_date,
    days,
    irrigations,
    fertilizations,
    photo_url,
    qr_token: batch.qr_token || '',
  };

  return (
    <div className="app-shell bg-surface-container-lowest min-h-screen">
      <div className="no-print">
        <PageHeader 
          title="Certificado de Origem" 
          onBack={() => navigate(`/ciclo/${id}`)} 
        />
      </div>

      <div className="flex flex-col items-center gap-8 py-10">
        <div className="print-area">
          <Certificate data={certificateData} />
        </div>

        <div className="no-print flex gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate(`/ciclo/${id}`)}
            className="rounded-2xl px-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao Ciclo
          </Button>

          <Button
            variant="primary"
            onClick={() => window.print()}
            className="rounded-2xl px-8 shadow-xl shadow-primary/20"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Certificado
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { BatchCard } from "../components/BatchCard";
import { useBatches } from "../hooks/useBatches";
import { useProfile } from "../hooks/useProfile";

export function Dashboard() {
  const { data, isLoading, error } = useBatches();
  const { data: profile } = useProfile();

  const nome = profile?.name?.split(" ")[0] || "Professor";

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar</p>;

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <p>Nenhum ciclo ativo encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-gray-500 text-sm mt-3">Bom dia, Prof. {nome}</p>

      <div className="flex flex-row justify-between">
        <h2 className="font-bold text-2xl">Meus ciclos</h2>

        <Link
          to="/create-batch"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Criar Ciclo
        </Link>
      </div>

      <p className="text-gray-500 text-sm mt-3">
        Ciclos ativos ({data.length})
      </p>
      {data.map((batch) => (
        <BatchCard
          key={batch.id}
          crop={batch.crop_name}
          className={batch.class_name}
          plot={batch.plots?.label}
          phase="desenvolvimento"
          days={Math.floor(
            (Date.now() - new Date(batch.created_at ?? Date.now()).getTime()) /
              (1000 * 60 * 60 * 24),
          )}
          lastEvent="Última atualização recente"
        />
      ))}
    </div>
  );
}

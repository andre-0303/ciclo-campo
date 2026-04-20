import { useBatches } from "../hooks/useBatches";
import { logout } from "../services/auth.service";

export function Dashboard() {
  const { data, isLoading, error } = useBatches();

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
      <button onClick={logout}>Sair</button>
      {data.map((batch) => (
        <div key={batch.id} className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">{batch.crop_name}</h2>
          <p>Turma: {batch.class_name}</p>
          <p>Canteiro: {batch.plots?.label}</p>
        </div>
      ))}
    </div>
  );
}

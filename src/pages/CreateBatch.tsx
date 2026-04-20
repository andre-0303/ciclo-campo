// src/pages/CreateBatch.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateBatch } from "../hooks/useCreateBatch";
import { usePlots } from "../hooks/usePlots";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sprout, Leaf, Flower2, CircleDashed } from "lucide-react";

type FormData = {
  crop_name: string;
  class_name: string;
  plot_id: string;
};

const crops = [
  { name: "Alface", icon: <Leaf className="w-6 h-6 text-green-600" /> },
  { name: "Cebolinha", icon: <Sprout className="w-6 h-6 text-green-600" /> },
  { name: "Rabanete", icon: <Flower2 className="w-6 h-6 text-green-600" /> },
  { name: "Outro", icon: <CircleDashed className="w-6 h-6 text-green-600" /> },
];

export function CreateBatch() {
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const { mutateAsync, isPending } = useCreateBatch();
  const navigate = useNavigate();

  const { data: plots } = usePlots();
  const [selectedType, setSelectedType] = useState("Alface");

  // Define um valor inicial quando iniciar localmente
  useEffect(() => {
    setValue("crop_name", "Alface");
  }, [setValue]);

  // Se os plots recarregarem e houver dados, o form pegará o ID do primeiro plot por padrão para não falhar na validação
  useEffect(() => {
    if (plots && plots.length > 0) {
      setValue("plot_id", plots[0].id);
    }
  }, [plots, setValue]);

  function handleTypeSelect(name: string) {
    setSelectedType(name);
    // Se "Outro" for clicado, o campo ficará vazio no formulário para a pessoa digitar no novo input
    setValue("crop_name", name === "Outro" ? "" : name);
  }

  async function onSubmit(data: FormData) {
    if (!data.plot_id) {
      alert("Por favor, selecione um canteiro.");
      return;
    }

    // Fallback pra caso escolheu outro e não escreveu nada
    if (
      selectedType === "Outro" &&
      (!data.crop_name || data.crop_name.trim() === "")
    ) {
      alert("Por favor, especifique o tipo de cultivo.");
      return;
    }

    try {
      await mutateAsync(data);
      reset();
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      <header className="flex items-center justify-center relative p-4 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-4 p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          Iniciar Novo Ciclo
        </h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-6 max-w-lg mx-auto"
      >
        <div className="bg-[#e4eed7] rounded-xl p-4 flex gap-3 text-[#5b8751] shadow-sm">
          <Sprout className="w-5 h-5 text-green-600" />
          <p className="font-medium text-sm leading-snug">
            Preencha os dados para registrar um novo plantio.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-500">
            Canteiro
          </label>
          <div className="relative">
            <select
              {...register("plot_id")}
              className="w-full border border-gray-200 p-3.5 rounded-xl bg-white appearance-none text-gray-700 outline-none focus:ring-2 focus:ring-[#3c8965]/20 focus:border-[#3c8965] font-medium"
            >
              {plots?.map((plot: any) => (
                <option key={plot.id} value={plot.id}>
                  {plot.label}{" "}
                  {plot.status === "active" ? "— Indisponível" : "— Disponível"}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-500">
            Tipo de cultivo
          </label>
          <div className="grid grid-cols-2 gap-3">
            {crops.map((crop) => {
              const isSelected = selectedType === crop.name;
              return (
                <button
                  key={crop.name}
                  type="button"
                  onClick={() => handleTypeSelect(crop.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-[14px] border-2 transition-all ${
                    isSelected
                      ? "border-[#3c8965] bg-[#e1eed8] text-[#3c8965] shadow-sm"
                      : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <span className="mb-1">{crop.icon}</span>
                  <span
                    className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}
                  >
                    {crop.name}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedType === "Outro" && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-2">
              <input
                {...register("crop_name")}
                placeholder="Especifique a cultura"
                className="w-full border border-gray-200 p-3.5 rounded-xl bg-white text-gray-800 outline-none focus:ring-2 focus:ring-[#3c8965]/20 focus:border-[#3c8965] placeholder:text-gray-400 font-medium"
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-500">Turma</label>
          <input
            {...register("class_name", { required: true })}
            placeholder="ex: 4º Ano Manhã"
            className="w-full border border-gray-200 p-3.5 rounded-xl bg-white text-gray-800 outline-none focus:ring-2 focus:ring-[#3c8965]/20 focus:border-[#3c8965] placeholder:text-gray-400 font-medium"
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#3c8965] hover:bg-[#327154] active:bg-[#285b43] text-white p-4 justify-center rounded-[14px] font-bold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(60,137,101,0.2)]"
          >
            <Sprout className="w-5 h-5 text-green-200" />
            {isPending ? "Plantando..." : "Plantar agora"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full border-2 border-[#3c8965] text-[#3c8965] hover:bg-green-50 active:bg-green-100 p-4 rounded-[14px] font-bold transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

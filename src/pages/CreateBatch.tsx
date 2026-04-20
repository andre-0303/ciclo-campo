import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { CircleDashed, Flower2, Leaf, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, InputField, PageHeader, SelectField } from "../components/ui";
import { useCreateBatch } from "../hooks/useCreateBatch";
import { usePlots } from "../hooks/usePlots";
import { cn } from "../lib/cn";

type FormData = {
  crop_name: string;
  class_name: string;
  plot_id: string;
};

const crops: Array<{ name: string; icon: ReactNode }> = [
  { name: "Alface", icon: <Leaf className="h-6 w-6" /> },
  { name: "Couve", icon: <Leaf className="h-6 w-6 rotate-45" /> },
  { name: "Rabanete", icon: <Flower2 className="h-6 w-6" /> },
  { name: "Outro", icon: <CircleDashed className="h-6 w-6" /> },
];

export function CreateBatch() {
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const { mutateAsync, isPending } = useCreateBatch();
  const navigate = useNavigate();

  const { data: plots } = usePlots();
  const [selectedType, setSelectedType] = useState("Alface");

  const plotOptions =
    plots?.map((plot) => ({
      value: plot.id,
      label: `${plot.label} — Disponível`,
    })) ?? [];

  useEffect(() => {
    setValue("crop_name", "Alface");
  }, [setValue]);

  useEffect(() => {
    if (plots && plots.length > 0) {
      setValue("plot_id", plots[0].id);
    }
  }, [plots, setValue]);

  function handleTypeSelect(name: string) {
    setSelectedType(name);
    setValue("crop_name", name === "Outro" ? "" : name);
  }

  async function onSubmit(data: FormData) {
    if (!data.plot_id) {
      alert("Por favor, selecione um canteiro.");
      return;
    }

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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar ciclo.");
    }
  }

  return (
    <div className="app-shell flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        <PageHeader
          title="Iniciar Novo Ciclo"
          onBack={() => navigate("/")}
          className="text-center"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* BANNER */}
          <div className="flex items-center gap-3 rounded-2xl bg-[#e4eed7] p-4 text-[#5b8751] shadow-sm tracking-tight">
            <Sprout className="h-6 w-6" />
            <p className="text-sm font-medium leading-snug">
              Preencha os dados para registrar um novo plantio.
            </p>
          </div>

          {/* CANTEIRO */}
          <SelectField
            label="Canteiro"
            options={plotOptions}
            disabled={plotOptions.length === 0}
            {...register("plot_id")}
          />

          {/* TIPO DE CULTIVO */}
          <div className="space-y-3">
            <p className="text-label">Tipo de cultivo</p>
            <div className="grid grid-cols-2 gap-3">
              {crops.map((crop) => {
                const isSelected = selectedType === crop.name;
                return (
                  <button
                    key={crop.name}
                    type="button"
                    onClick={() => handleTypeSelect(crop.name)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all",
                      isSelected
                        ? "border-primary bg-[#e1eed8] text-primary"
                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 shadow-sm",
                    )}
                  >
                    <span
                      className={cn(
                        isSelected ? "text-primary" : "text-primary/60",
                      )}
                    >
                      {crop.icon}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        isSelected ? "font-bold" : "font-medium",
                      )}
                    >
                      {crop.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedType === "Outro" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <InputField
                  label="Especifique a cultura"
                  placeholder="Ex: Coentro"
                  {...register("crop_name")}
                />
              </div>
            )}
          </div>

          {/* TURMA */}
          <InputField
            label="Turma"
            placeholder="ex: 4º Ano Manhã"
            {...register("class_name", { required: true })}
          />

          {/* ACTIONS */}
          <div className="space-y-3 pt-4">
            <Button type="submit" fullWidth disabled={isPending}>
              <Sprout className="h-5 w-5" />
              {isPending ? "Plantando..." : "Plantar agora"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

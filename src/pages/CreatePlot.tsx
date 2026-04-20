import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Plus, MapIcon } from "lucide-react";
import { useCreatePlot } from "../hooks/useCreatePlot";
import { Button, InputField, PageHeader } from "../components/ui";

type FormData = {
  label: string;
};

export function CreatePlot() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const { mutateAsync, isPending } = useCreatePlot();
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    try {
      await mutateAsync(data.label);
      reset();
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="app-shell flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        <PageHeader
          title="Novo Canteiro"
          onBack={() => navigate("/")}
          className="text-center"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* BANNER */}
          <div className="flex items-center gap-3 rounded-xl bg-[#e4eed7] p-4 text-[#5b8751] shadow-sm tracking-tight">
            <MapIcon className="h-6 w-6" />
            <p className="text-sm font-medium leading-snug">
              Crie uma nova área de plantio para organizar os ciclos da escola.
            </p>
          </div>

          <InputField
            label="Nome do Canteiro"
            placeholder="Ex: Canteiro 01, Horta Norte..."
            error={errors.label?.message}
            {...register("label", {
              required: "O nome do canteiro é obrigatório",
              minLength: {
                value: 3,
                message: "O nome deve ter pelo menos 3 caracteres",
              },
            })}
          />

          <div className="space-y-3 pt-4">
            <Button type="submit" fullWidth disabled={isPending}>
              <Plus className="h-5 w-5" />
              {isPending ? "Criando..." : "Criar agora"}
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

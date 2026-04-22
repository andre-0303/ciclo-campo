import { Sprout } from "lucide-react";

export function CreateBatchBanner() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#e4eed7] p-4 text-[#5b8751] shadow-sm tracking-tight">
      <Sprout className="h-6 w-6" />
      <p className="text-sm font-medium leading-snug">
        Preencha os dados para registrar um novo plantio.
      </p>
    </div>
  );
}

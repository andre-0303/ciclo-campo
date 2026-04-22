import type { ComponentProps, ReactNode } from "react";
import { InputField } from "../ui";
import { cn } from "../../lib/cn";

export interface CropOption {
  name: string;
  icon: ReactNode;
}

interface CreateBatchCropSelectorProps {
  crops: CropOption[];
  selectedType: string;
  cropNameFieldProps: ComponentProps<typeof InputField>;
  onSelect: (name: string) => void;
}

export function CreateBatchCropSelector({
  crops,
  selectedType,
  cropNameFieldProps,
  onSelect,
}: CreateBatchCropSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-label">Tipo de cultivo</p>
      <div className="grid grid-cols-2 gap-3">
        {crops.map((crop) => {
          const isSelected = selectedType === crop.name;

          return (
            <button
              key={crop.name}
              type="button"
              onClick={() => onSelect(crop.name)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all",
                isSelected
                  ? "border-primary bg-[#e1eed8] text-primary"
                  : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 shadow-sm",
              )}
            >
              <span className={cn(isSelected ? "text-primary" : "text-primary/60")}>
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
          <InputField {...cropNameFieldProps} />
        </div>
      )}
    </div>
  );
}

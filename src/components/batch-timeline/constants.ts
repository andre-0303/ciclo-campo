import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Droplets,
  Eye,
  FlaskConical,
  RefreshCw,
} from "lucide-react";
import type { BatchEventType } from "../../types/batch";

export interface EventConfigItem {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const eventConfig: Record<BatchEventType, EventConfigItem> = {
  fase_change: {
    label: "Mudança de Fase",
    icon: RefreshCw,
    color: "text-blue-600 bg-blue-50",
  },
  irrigation: {
    label: "Irrigação",
    icon: Droplets,
    color: "text-cyan-600 bg-cyan-50",
  },
  fertilization: {
    label: "Adubação",
    icon: FlaskConical,
    color: "text-orange-600 bg-orange-50",
  },
  pest_control: {
    label: "Controle de Pragas",
    icon: Bug,
    color: "text-amber-600 bg-amber-50",
  },
  observation: {
    label: "Observação",
    icon: Eye,
    color: "text-slate-600 bg-slate-50",
  },
};

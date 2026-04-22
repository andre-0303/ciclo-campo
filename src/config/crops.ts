// src/config/crops.ts
// Configuração central de cultivos e seus fluxos de fases.
// Para adicionar um novo cultivo, basta incluir aqui.

import type { Database } from "../types/supabase";

export type Phase = Database["public"]["Enums"]["phase_type"];

/**
 * Todas as fases existentes no sistema, com metadados de exibição.
 */
export const ALL_PHASES: Record<Phase, { label: string; description: string }> = {
  plantio: {
    label: "Plantio",
    description: "Semeadura ou transplantio das mudas",
  },
  desenvolvimento: {
    label: "Desenvolvimento",
    description: "Crescimento vegetativo e folhagem",
  },
  floracao: {
    label: "Floração",
    description: "Surgimento das primeiras flores",
  },
  frutificacao: {
    label: "Frutificação",
    description: "Formação e maturação dos frutos",
  },
  colheita: {
    label: "Colheita",
    description: "Fase final de coleta dos produtos",
  },
};

/**
 * Categorias de cultivo — cada uma define quais fases se aplicam.
 */
export type CropCategory = "folhosa" | "frutifera";

export interface CropTemplate {
  name: string;
  category: CropCategory;
  phases: Phase[];
}

/**
 * Templates de cultivos comuns em escolas.
 * A ordem no array define a sequência do fluxo de fases.
 */
export const CROP_TEMPLATES: CropTemplate[] = [
  // Folhosas / Raízes / Ervas — sem floração nem frutificação
  {
    name: "Alface",
    category: "folhosa",
    phases: ["plantio", "desenvolvimento", "colheita"],
  },
  {
    name: "Cheiro Verde",
    category: "folhosa",
    phases: ["plantio", "desenvolvimento", "colheita"],
  },
  {
    name: "Couve",
    category: "folhosa",
    phases: ["plantio", "desenvolvimento", "colheita"],
  },
  {
    name: "Rabanete",
    category: "folhosa",
    phases: ["plantio", "desenvolvimento", "colheita"],
  },

  // Frutíferas — fluxo completo com floração e frutificação
  {
    name: "Tomate",
    category: "frutifera",
    phases: [
      "plantio",
      "desenvolvimento",
      "floracao",
      "frutificacao",
      "colheita",
    ],
  },
  {
    name: "Morango",
    category: "frutifera",
    phases: [
      "plantio",
      "desenvolvimento",
      "floracao",
      "frutificacao",
      "colheita",
    ],
  },
];

/**
 * Fases padrão para cultivos desconhecidos (opção "Outro").
 * Usa o fluxo curto por segurança — o professor pode avançar sem confusão.
 */
export const DEFAULT_PHASES: Phase[] = [
  "plantio",
  "desenvolvimento",
  "colheita",
];

/**
 * Retorna as fases aplicáveis para um cultivo pelo nome.
 */
export function getPhasesForCrop(cropName: string): Phase[] {
  const template = CROP_TEMPLATES.find(
    (t) => t.name.toLowerCase() === cropName.trim().toLowerCase(),
  );
  return template?.phases ?? DEFAULT_PHASES;
}

/**
 * Dado um array de fases do batch, constrói o mapa de fluxo
 * (fase atual -> próxima fase).
 */
export function buildPhaseFlow(
  phases: Phase[],
): Record<Phase, Phase | null> {
  const flow: Partial<Record<Phase, Phase | null>> = {};
  for (let i = 0; i < phases.length; i++) {
    flow[phases[i]] = phases[i + 1] ?? null;
  }
  return flow as Record<Phase, Phase | null>;
}

/**
 * Retorna as opções de fase para o modal "Avançar",
 * filtradas pelas fases que aquele batch realmente usa.
 * Exclui "plantio" pois é a fase inicial e nunca é selecionada manualmente.
 */
export function getPhaseOptionsForBatch(phases: Phase[]) {
  return phases
    .filter((p) => p !== "plantio")
    .map((p) => ({
      value: p,
      label: ALL_PHASES[p].label,
      description: ALL_PHASES[p].description,
    }));
}

---
name: react-best-practices
description: >
  Guia de boas práticas para projetos React com TypeScript, Tailwind CSS e Supabase,
  seguindo os padrões do projeto CicloCampo. Use esta skill SEMPRE que o usuário pedir
  para criar componentes, páginas, hooks, serviços, ou qualquer código React/TypeScript
  no projeto. Acione também quando o usuário perguntar "como implementar X", "qual a melhor
  forma de fazer Y", "como estruturar Z", ou quando for refatorar código existente.
  Esta skill garante consistência de código, acessibilidade, performance e padrões
  de projeto em toda a base de código.
---

# React Best Practices — CicloCampo

## Estrutura de Pastas

O projeto segue a seguinte organização dentro de `src/`:

```
src/
├── components/         # Componentes reutilizáveis (UI puro, sem lógica de negócio)
│   ├── ui/             # Primitivos de design system (Button, Input, Badge, etc.)
│   └── [feature]/      # Componentes específicos de uma feature
├── pages/              # Páginas (roteáveis). Um arquivo por rota.
├── hooks/              # Custom hooks (prefixo `use`)
├── services/           # Comunicação com Supabase / APIs externas
├── stores/             # Estado global (Zustand ou Context)
├── types/              # Tipos e interfaces TypeScript compartilhados
├── lib/                # Utilitários, helpers, formatters
└── constants/          # Enums, constantes de negócio
```

> **Regra de ouro:** Se um componente tem mais de 150 linhas, ele provavelmente precisa ser dividido.

---

## Componentes

### ✅ Padrão de um componente

```tsx
// src/components/batch/BatchCard.tsx

import { type FC } from 'react'
import { Badge } from '@/components/ui/Badge'
import { type Batch } from '@/types/batch'

interface BatchCardProps {
  batch: Batch
  onSelect: (id: string) => void
}

export const BatchCard: FC<BatchCardProps> = ({ batch, onSelect }) => {
  return (
    <div
      className="rounded-lg border border-gray-200 p-4 hover:border-green-500 transition-colors cursor-pointer"
      onClick={() => onSelect(batch.id)}
      role="button"
      aria-label={`Abrir lote ${batch.crop_name}`}
    >
      <h3 className="font-semibold text-gray-800">{batch.crop_name}</h3>
      <p className="text-sm text-gray-500">{batch.class_name}</p>
      <Badge status={batch.status} />
    </div>
  )
}
```

### Regras para componentes

- **Um componente = um arquivo.** Nome do arquivo igual ao nome do componente.
- **Sempre tipar as props** com `interface` (não `type` para props de componente).
- **Nunca usar `export default`** — use named exports para facilitar refatoração e autocomplete.
- **Acessibilidade obrigatória:** todo elemento interativo precisa de `role` e `aria-label` quando o texto não for suficiente.
- **Evitar lógica pesada no JSX.** Extraia para variáveis ou funções antes do `return`.

```tsx
// ❌ Evitar
return (
  <div>{events.filter(e => e.type === 'irrigation').map(e => <EventItem key={e.id} event={e} />)}</div>
)

// ✅ Preferir
const irrigationEvents = events.filter(e => e.type === 'irrigation')
return (
  <div>{irrigationEvents.map(e => <EventItem key={e.id} event={e} />)}</div>
)
```

---

## Hooks Customizados

Toda lógica de dados, side effects e estado complexo deve ser extraída para um hook.

```tsx
// src/hooks/useBatchEvents.ts

import { useState, useEffect } from 'react'
import { batchService } from '@/services/batchService'
import { type BatchEvent } from '@/types/batch'

interface UseBatchEventsReturn {
  events: BatchEvent[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useBatchEvents(batchId: string): UseBatchEventsReturn {
  const [events, setEvents] = useState<BatchEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await batchService.getEvents(batchId)
      setEvents(data)
    } catch (err) {
      setError('Erro ao carregar eventos.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (batchId) fetchEvents()
  }, [batchId])

  return { events, isLoading, error, refetch: fetchEvents }
}
```

### Regras para hooks

- Nome sempre começa com `use`.
- Retornar um **objeto** (nunca um array, exceto quando imitar a API do `useState`).
- Tipar o retorno explicitamente com uma `interface`.
- Separar hooks de **dados** (chamadas à API) de hooks de **UI** (estado de modais, formulários).

---

## Services (Supabase)

Toda comunicação com o Supabase fica em `src/services/`. **Nunca chamar o Supabase diretamente de dentro de um componente ou hook de UI.**

```tsx
// src/services/batchService.ts

import { supabase } from '@/lib/supabaseClient'
import { type Batch, type CreateBatchDTO } from '@/types/batch'

export const batchService = {
  async getByPlot(plotId: string, schoolId: string): Promise<Batch[]> {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('plot_id', plotId)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async create(payload: CreateBatchDTO): Promise<Batch> {
    const { data, error } = await supabase
      .from('batches')
      .insert(payload)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },
}
```

### Regras para services

- Sempre **lançar erro** (`throw`) em vez de retornar `null` — deixa o hook/componente decidir o que fazer.
- Usar **DTOs** (`CreateBatchDTO`, `UpdateBatchDTO`) para separar o formato da API do tipo interno.
- Um arquivo de service por entidade de negócio (`batchService`, `plotService`, `schoolService`).

---

## TypeScript

```tsx
// src/types/batch.ts

export type BatchStatus = 'active' | 'completed'
export type EventType = 'irrigation' | 'pest' | 'observation' | 'harvest'
export type BatchPhase = 'plantio' | 'desenvolvimento' | 'floracao' | 'colheita'

export interface Batch {
  id: string
  school_id: string
  plot_id: string
  crop_name: string
  class_name: string
  status: BatchStatus
  qr_token: string
  created_at: string
}

export interface BatchEvent {
  id: string
  batch_id: string
  created_by: string
  phase: BatchPhase
  event_type: EventType
  description: string | null
  photo_url: string | null
  created_at: string
  // client_id para idempotência offline
  client_id: string
}

// DTO para criação (omite campos gerados pelo servidor)
export type CreateBatchEventDTO = Omit<BatchEvent, 'id' | 'created_at'>
```

### Regras de TypeScript

- **Nunca usar `any`.** Se necessário, use `unknown` e faça a narrowing.
- **Tipar respostas do Supabase** sempre — não confiar no tipo inferido.
- `interface` para objetos de domínio, `type` para unions/enums/aliases.
- Habilitar `strict: true` no `tsconfig.json` (já deve estar ativo).

---

## Tailwind CSS

- Usar as classes do **design system** definido no `tailwind.config.js` do projeto.
- **Nunca usar estilos inline** (`style={{}}`), exceto para valores dinâmicos impossíveis de expressar com classes.
- Para listas de classes condicionais, usar a lib `clsx` ou `cn`:

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'rounded-lg p-4 border',
  isActive && 'border-green-500 bg-green-50',
  hasError && 'border-red-500 bg-red-50',
)} />
```

- Priorizar **alto contraste** — o app é usado em campo, ao sol. Preferir `text-gray-800` ao invés de `text-gray-400` para textos importantes.

---

## Tratamento de Estados Assíncronos

Todo dado remoto tem três estados: `loading`, `error`, `success`. Sempre tratar os três:

```tsx
const { events, isLoading, error } = useBatchEvents(batchId)

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage message={error} />

return <EventTimeline events={events} />
```

---

## Offline First (IndexedDB + Queue)

Para eventos que precisam funcionar offline, seguir o padrão de fila:

1. **Gerar `client_id`** no dispositivo antes de salvar.
2. **Salvar no IndexedDB** imediatamente (feedback instantâneo ao usuário).
3. **Tentar sincronizar** com o Supabase em background.
4. **Exibir indicador de status** na UI (⬆️ pendente, ✅ sincronizado, ⚠️ erro).

> Para detalhes completos da implementação, ver a página **Estratégia Offline First + Filas Queue** no Notion do projeto.

---

## Leitura complementar

- [`references/naming-conventions.md`](./references/naming-conventions.md) — Convenções de nomenclatura
- [`references/component-patterns.md`](./references/component-patterns.md) — Padrões avançados (compound components, render props, etc.)
- [`references/accessibility.md`](./references/accessibility.md) — Checklist de acessibilidade
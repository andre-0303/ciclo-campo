# Convenções de Nomenclatura — CicloCampo

## Arquivos e Pastas

| O quê | Convenção | Exemplo |
|---|---|---|
| Componente | PascalCase | `BatchCard.tsx` |
| Hook | camelCase com `use` | `useBatchEvents.ts` |
| Service | camelCase com sufixo `Service` | `batchService.ts` |
| Tipo/Interface | PascalCase | `batch.ts` |
| Utilitário | camelCase | `formatDate.ts` |
| Página | PascalCase com sufixo `Page` | `BatchDetailPage.tsx` |
| Constante | SCREAMING_SNAKE_CASE | `BATCH_PHASES.ts` |

## Variáveis e Funções

```tsx
// Booleanos: prefixo is/has/can/should
const isLoading = true
const hasError = false
const canEdit = user.role === 'teacher'

// Handlers de evento: prefixo handle
const handleSubmit = () => {}
const handlePhotoUpload = () => {}

// Callbacks passados como props: prefixo on
<BatchCard onSelect={handleSelect} onDelete={handleDelete} />

// Arrays: sempre no plural
const batches = []
const events = []

// Funções assíncronas: verbo + substantivo
const fetchBatches = async () => {}
const createEvent = async () => {}
const uploadPhoto = async () => {}
```

## Componentes

```tsx
// Componente de container (tem lógica/dados)
BatchDetailContainer.tsx

// Componente de apresentação (só UI)
BatchDetailView.tsx

// Componente de página
BatchDetailPage.tsx
```

## CSS / Tailwind

Nunca criar classes CSS custom sem antes verificar se Tailwind já resolve. Se precisar de classes custom, usar BEM em módulos CSS:

```css
/* Apenas para casos muito específicos */
.batch-card__status--syncing { ... }
```
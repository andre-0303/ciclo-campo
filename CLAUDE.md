# CicloCampo

Agricultural tracking system for school gardens with offline-first architecture.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client) + React Query (server)
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Offline**: IndexedDB via `idb` library

## Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Run ESLint
pnpm preview  # Preview production build
```

## Architecture

- **Offline-first**: All mutations go through `queue.service.ts` → IndexedDB →sync when online
- **Multi-tenant**: Row Level Security (RLS) on Supabase isolates data by school
- **Queue system**: Events use `client_id` for idempotent sync

## Key Files

| Path | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client config |
| `src/lib/db.ts` | IndexedDB setup |
| `src/services/queue.service.ts` | Offline queue management |
| `src/services/sync.service.ts` | Background sync logic |
| `src/hooks/usePendingEvents.ts` | Hook to monitor pending queue |
| `src/types/supabase.ts` | Database types |

## Database Schema

- `schools` → Tenant units
- `plots` → Garden areas
- `batches` → Production cycles (plot × class)
- `batch_events` → Timeline events (irrigation, fertilization, phase changes)

## Patterns

- Hooks return `{ data, isLoading, error }` for consistency
- Services handle all data fetching/mutations
- UI components in `src/components/ui/`
- Use `cn()` utility for className merging
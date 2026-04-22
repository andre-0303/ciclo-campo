# CicloCampo — Briefing do Projeto

## O que é esse projeto
App de rastreabilidade de cultivos escolares para escolas rurais.
Parceria com a Secretaria Municipal de Educação de Croatá-CE.

## Stack
- React + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage + RLS)
- PWA com estratégia Offline First (IndexedDB + Background Sync)

## Regras de código
- Seguir a skill `react-best-practices` sempre
- Nunca chamar Supabase direto num componente — usar services/
- Nunca usar `any` no TypeScript
- Named exports sempre, nunca `export default`
- Componentes com mais de 150 linhas devem ser divididos

## Banco de dados
- Multi-tenant por `school_id`
- RLS ativo — sempre incluir school_id nas queries
- Tabelas: schools, plots, batches, batch_events

## Contexto importante
- O professor é o operador do app em campo, ao sol
- Conectividade instável — offline first é obrigatório
- Área de toque mínima 44x44px em todos os elementos clicáveis
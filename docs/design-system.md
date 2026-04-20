# Design System: The Living Ledger

## Visao geral

O design system do CicloCampo traduz a direcao criativa **The Living Ledger** para a implementacao do produto. A interface deve parecer editorial, clara e organica, sem cair nem na rigidez de um painel burocratico nem em uma estetica infantilizada.

Os principios que guiam o sistema sao:

- **Editorial e vivo:** tipografia forte, composicoes com respiro e blocos assimetricos.
- **Leitura em campo:** alto contraste, foco evidente e superficies quentes para reduzir fadiga sob luz forte.
- **Camadas em vez de bordas:** seccoes e cards sao definidos por superficies tonais, nao por linhas duras.
- **Profissional com calor humano:** linguagem visual acolhedora, mas institucional o suficiente para uso escolar.

## Onde esta implementado

- Tema e tokens globais: [src/index.css](C:/dev/cicloCampo/src/index.css)
- Extensoes do Tailwind: [tailwind.config.js](C:/dev/cicloCampo/tailwind.config.js)
- Componentes base: [src/components/ui](C:/dev/cicloCampo/src/components/ui)
- Aplicacao nas telas:
  - [src/pages/Login.tsx](C:/dev/cicloCampo/src/pages/Login.tsx)
  - [src/pages/Dashboard.tsx](C:/dev/cicloCampo/src/pages/Dashboard.tsx)
  - [src/pages/CreateBatch.tsx](C:/dev/cicloCampo/src/pages/CreateBatch.tsx)

## Foundations

### Cores semanticas

As cores nao devem ser usadas por hex espalhado na UI. Sempre prefira os tokens semanticos:

- `background`: base quente do app
- `surface`, `surface-bright`
- `surface-container-lowest`
- `surface-container-low`
- `surface-container-high`
- `surface-container-highest`
- `surface-variant`
- `primary`, `primary-container`
- `secondary`, `secondary-container`, `secondary-fixed`
- `tertiary-container`
- `on-background`, `on-surface`, `on-surface-variant`
- `outline-variant`

### Tipografia

- **Display e headlines:** `font-display` usa Plus Jakarta Sans.
- **Body e interface:** `font-sans` usa Inter.
- Use `text-label` para metadata, rotulos e pequenos marcadores editoriais.
- Use `display-number` para metricas e numeros de destaque.

### Elevacao

Evite sombras convencionais de dashboard.

- Use `shadow-ambient-sm` para cards interativos.
- Use `shadow-ambient-lg` apenas em heros e blocos de destaque.
- Para delimitacao sutil, use `ghost-outline`.

### Superficies

- `Card variant="section"`: secoes agrupadoras
- `Card variant="interactive"`: cards de conteudo acionavel
- `Card variant="hero"`: blocos principais de narrativa visual

## Componentes base

### Button

Arquivo: [src/components/ui/Button.tsx](C:/dev/cicloCampo/src/components/ui/Button.tsx)

Variantes:

- `primary`: acao principal com gradiente da marca
- `secondary`: acao de apoio com destaque quente
- `ghost`: acao discreta em superficie tonal
- `tertiary`: link editorial com sublinhado cromatico

Use `buttonStyles()` quando precisar aplicar a mesma aparencia em `Link`.

### Card

Arquivo: [src/components/ui/Card.tsx](C:/dev/cicloCampo/src/components/ui/Card.tsx)

Funcoes:

- organiza camadas tonais
- padroniza raio e padding
- substitui o uso de caixas com borda

### Field

Arquivo: [src/components/ui/Field.tsx](C:/dev/cicloCampo/src/components/ui/Field.tsx)

Componentes:

- `InputField`
- `SelectField`

Padrao visual:

- fundo suave
- sem borda
- acento inferior de foco em `primary`
- helper text em `on-surface-variant`

### Badge

Arquivo: [src/components/ui/Badge.tsx](C:/dev/cicloCampo/src/components/ui/Badge.tsx)

Uso ideal para:

- fases do cultivo
- status leves
- pequenos metadados

### PageHeader

Arquivo: [src/components/ui/PageHeader.tsx](C:/dev/cicloCampo/src/components/ui/PageHeader.tsx)

Padroniza:

- eyebrow editorial
- titulo principal
- descricao
- acao lateral
- botao de retorno

### GrowthTracker

Arquivo: [src/components/ui/GrowthTracker.tsx](C:/dev/cicloCampo/src/components/ui/GrowthTracker.tsx)

Componente especializado do dominio:

- substitui barras rigidas por uma leitura mais organica
- representa `plantio`, `desenvolvimento` e `colheita`

## Regras de uso

### Faca

- Use `CardEyebrow` ou `text-label` para criar hierarquia catalografica.
- Prefira `surface-container-*` para separar blocos.
- Dê mais espaco do que o instinto mandar, principalmente em cabecalhos e cards.
- Use Plus Jakarta Sans em metricas e contagens de destaque.

### Nao faca

- Nao use `border` de 1px para estruturar secoes.
- Nao introduza hex codes diretamente em telas novas.
- Nao use preto puro.
- Nao use cantos retos.
- Nao volte a montar formularios com `input` cru estilizado localmente se `InputField` ou `SelectField` resolverem.

## Como expandir

Ao criar novos componentes, siga esta ordem:

1. Defina se o problema ja e coberto por `Card`, `Button`, `Field`, `Badge` ou `PageHeader`.
2. Se nao for, crie um componente em `src/components/ui`.
3. Reaproveite tokens semanticos em vez de criar estilos locais ad hoc.
4. Documente a nova variante ou componente neste arquivo.

## Proximos componentes recomendados

- `Toast`
- `Modal` ou `BottomSheet`
- `Tabs`
- `Timeline` para `batch_events`
- `QRAccessCard`
- `StatCard` dedicado

## Validacao

Ultima validacao desta implementacao:

- `npm run lint`: passou
- `npm run build`: passou

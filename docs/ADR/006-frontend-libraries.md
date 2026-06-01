# ADR 006: Bibliotecas do Frontend (Estado, Estilo, Drag & Drop)

## Status

Aceito

## Contexto

O frontend definido no ADR 005 (React + Vite) precisa de bibliotecas para resolver três responsabilidades distintas: gerenciamento de estado do servidor (cache, sincronização, atualizações otimistas), gerenciamento de estado local da UI, estilização acessível e drag and drop de cards entre colunas (RF08). Essas decisões são interligadas — por exemplo, a biblioteca de drag and drop precisa interagir com o cache do servidor para atualizações otimistas (RNF07).

## Decisão

Usar o seguinte conjunto de bibliotecas:

| Responsabilidade      | Biblioteca            |
|-----------------------|-----------------------|
| Estado do servidor    | TanStack Query v5     |
| Estado local da UI    | Zustand               |
| Estilização           | Tailwind CSS v4       |
| Componentes           | shadcn/ui             |
| Drag and drop         | @dnd-kit              |

## Alternativas Consideradas

### Estado do Servidor

| Alternativa     | Prós                             | Contras                                              |
|-----------------|-----------------------------------|------------------------------------------------------|
| Redux Toolkit   | Query incluso, padronizado       | Mais boilerplate; RTK Query é acoplado ao Redux      |
| SWR             | Simples, foco em stale-while-revalidate | Menos recursos que React Query (sem mutations otimistas nativas) |
| Busca manual    | Sem dependências                  | Reimplementar cache, deduplicação e invalidação é complexo e propenso a bugs |

### Estado da UI

| Alternativa     | Prós                             | Contras                                              |
|-----------------|-----------------------------------|------------------------------------------------------|
| Redux Toolkit   | Ecossistema enorme, DevTools      | Overkill para estado local; cada mudança exige action + reducer |
| Context API     | Nativo do React                   | Re-renders em cascata; péssimo para estado que muda com frequência (WebSocket) |
| Jotai           | Atômico, simples                  | Muito similar ao Zustand; Zustand tem API mais enxuta |

### Drag and Drop

| Alternativa             | Prós                              | Contras                                              |
|-------------------------|------------------------------------|------------------------------------------------------|
| react-beautiful-dnd     | Popular, API intuitiva             | Não mantido (arquivado pelo autor); sem suporte a React 18 strict mode |
| react-dnd               | Flexível, maduro                   | API verbosa; complexidade desnecessária para Kanban  |
| SortableJS (React)      | Leve, animações suaves             | Wrapper fino sobre lib vanilla; menos idiomático em React |

### Estilização e Componentes

| Alternativa     | Prós                             | Contras                                              |
|-----------------|-----------------------------------|------------------------------------------------------|
| CSS Modules     | Isolamento nativo, sem lib extra   | Sem utilitários; produtividade menor                  |
| Styled Components | CSS-in-JS dinâmico                | Bundle maior; runtime de CSS; conflito com Server Components futuros |
| Mantine         | Componentes prontos, ótimo DX      | Acoplamento visual; menos flexível para design customizado |
| Daisy UI        | Componentes via classes Tailwind   | Limitado comparado ao shadcn/ui; menos componentes acessíveis |
| Radix UI puro   | Primitivos acessíveis, sem estilo  | Exige construir todo o design manualmente; lento |
| Headless UI     | Acessível, Tailwind-compatível     | Catálogo enxuto (~10 componentes); sem temas

## Consequências

### Positivas

- **TanStack Query:** Cache deduplicado, refetch em foco de janela, mutations otimistas integradas (RNF07), invalidação seletiva de queries.
- **Zustand:** API mínima baseada em hooks, sem providers, ideal para estado efêmero (modais abertos, conexão WebSocket ativa).
- **Tailwind CSS:** Produtividade extrema com classes utilitárias; bundle final enxuto (purge de CSS não usado).
- **shadcn/ui:** Catálogo extenso de componentes (botões, dialogs, cards, formulários, tabelas, sheets, command palettes), todos acessíveis via Radix UI, estilizados com Tailwind e copiados para o projeto (código-fonte é seu, sem dependência opaca). Customização total.
- **@dnd-kit:** Moderno, suporta React 18 strict mode, acessível por padrão (teclado + screen reader), customizável para Kanban.

### Negativas

- **Múltiplas dependências:** Cada biblioteca adiciona peso ao bundle e superfície de breaking changes em atualizações.
- **Tailwind v4:** Pode ter mudanças de API em relação à v3 (verificar estabilidade no momento do desenvolvimento).
- **shadcn/ui:** Componentes são copiados para o projeto (não instalados como dependência); atualizações exigem re-cópia manual. Depende de `tailwindcss-animate` e `class-variance-authority`.
- **@dnd-kit:** Curva de aprendizado moderada — conceitos de `DndContext`, `SortableContext`, sensores e colisões exigem estudo inicial.

# ADR 005: React + Vite como Stack do Frontend

## Status

Aceito

## Contexto

O frontend do FlowBoard precisa renderizar uma interface de quadro Kanban com múltiplas colunas e cards, suportar drag and drop (RF08), gerenciar estado complexo (dados do servidor, estado de UI, WebSocket), e oferecer roteamento entre telas (login, dashboard, quadro). A experiência de desenvolvimento deve ser rápida, com hot reload e tipagem.

## Decisão

Usar **React 18+** com **Vite** como bundler e dev server, **TypeScript** para tipagem, e **React Router** para roteamento.

## Alternativas Consideradas

| Alternativa        | Prós                                        | Contras                                              |
|--------------------|----------------------------------------------|------------------------------------------------------|
| Next.js            | SSR, roteamento por arquivos, API routes     | Pesado para SPA pura; SSR desnecessário (toda interação é pós-login); API routes conflitariam com FastAPI |
| Svelte + SvelteKit | Sintaxe concisa, reatividade embutida        | Ecossistema menor; menos bibliotecas maduras para drag and drop e WebSocket; menor mercado |
| Vue 3 + Vite       | Curva suave, ótima documentação              | React tem ecossistema mais amplo de bibliotecas (dnd-kit, TanStack Query) e é a stack de aprendizado do projeto |

## Consequências

### Positivas

- **HMR ultrarrápido:** Vite serve módulos nativos ESM no dev, com hot reload instantâneo.
- **Ecossistema maduro:** React Query, Zustand, dnd-kit e Headless UI são bibliotecas consolidadas e bem documentadas para React.
- **Tipagem:** TypeScript reduz erros em props e estado.
- **Build otimizado:** Vite usa Rollup em produção com tree-shaking agressivo.

### Negativas

- **SPA pura:** SEO irrelevante (toda a aplicação é pós-autenticação), mas navegação inicial carrega bundle inteiro.
- **Curva de hooks:** `useEffect`, `useCallback` e `useMemo` exigem disciplina para evitar re-renders desnecessários e memory leaks (especialmente com WebSocket).

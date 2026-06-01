# FlowBoard

Quadro Kanban colaborativo em tempo real, estilo Trello. Múltiplos usuários criam, editam e movem cards entre colunas, com sincronização instantânea via WebSockets.

## Stack

| Camada       | Tecnologias                                      |
|--------------|--------------------------------------------------|
| Backend      | FastAPI, SQLAlchemy 2.0 (async), PostgreSQL, JWT |
| Frontend     | React (Vite), Tailwind CSS, Zustand, React Query |
| Tempo Real   | WebSockets nativos do FastAPI                    |
| Drag & Drop  | @dnd-kit                                         |

## Documentação Completa

Todo o planejamento do projeto está na pasta [`docs/`](docs/):

- **[Histórias de Usuário](docs/USER_STORIES.md)** — backlog com critérios de aceitação e definition of done.
- **[Estratégia de Slices](docs/SLICES.md)** — ordem de ataque para entrega contínua de valor.
- **[ADRs](docs/ADR/)** — decisões de arquitetura e tecnologia.

## Como Executar

> Instruções de setup serão adicionadas durante o desenvolvimento (Docker Compose, variáveis de ambiente, etc.).

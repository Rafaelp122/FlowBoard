# Estratégia de Slicing — FlowBoard

Desenvolvimento fatiado verticalmente (Banco + API + UI) para entregar valor continuamente e reduzir riscos. Cada fatia é cumulativa: o trabalho da Fatia 1 continua sendo usado e estendido nas fatias seguintes.

```
[Fatia 1: Fundação] ---> [Fatia 2: Kanban Pessoal] ---> [Fatia 3: Real-Time] ---> [Fatia 4: Logs/Comentários]
```

| Fatia | Nome                          | Valor entregue ao final                                                    |
|-------|-------------------------------|----------------------------------------------------------------------------|
| 1     | Fundação e Quadros Básicos    | Cadastro, login, criação de quadros e colunas. Estrutura visual funcionando. |
| 2     | Gestão de Tarefas             | CRUD completo de cards com drag-and-drop. Kanban estático funcional.        |
| 3     | Colaboração em Tempo Real     | Convite de membros e atualizações instantâneas via WebSocket. Multiusuário. |
| 4     | Comunicação e Rastreabilidade | Comentários nos cards e histórico de atividades. Transparência total.       |

---

## Fatia 1: Fundação e Estrutura Base (MVP Inicial)

**Objetivo:** Usuário se cadastra, faz login e cria a estrutura básica do quadro.

| História | Descrição Resumida          |
|----------|-----------------------------|
| US01     | Cadastro de conta           |
| US02     | Login e logout              |
| US03     | Criar um novo quadro        |
| US04     | Editar e excluir quadro     |
| US05     | Gerenciar colunas           |

**Por que essa fatia?**
Com apenas isso, um usuário já consegue se cadastrar e montar a estrutura visual do seu fluxo de trabalho. Ainda não existem tarefas, mas já é possível validar a ideia e a usabilidade da navegação. O backend fornecerá APIs REST seguras, e o frontend terá a base de layout com Tailwind e React Router.

**Entregável Técnico:**

- Modelos: `User`, `Board`, `Column` com SQLAlchemy async.
- Endpoints REST autenticados (CRUD de quadros e colunas).
- Frontend com rotas protegidas, layout de quadro com colunas.

---

## Fatia 2: Kanban Pessoal (Modo Estático)

**Objetivo:** Um usuário gerencia cards sozinho no quadro, usando drag-and-drop.

| História | Descrição Resumida                       |
|----------|------------------------------------------|
| US06     | Criar um card                            |
| US07     | Editar detalhes do card                  |
| US08     | Mover card entre colunas (drag and drop) |
| US09     | Excluir um card                          |

**Por que essa fatia?**
Aqui o quadro ganha vida. O usuário já consegue gerenciar suas próprias tarefas de forma visual. O drag-and-drop e o painel de detalhes tornam o produto realmente utilizável, mesmo que sozinho. A comunicação em tempo real ainda não existe — as alterações são persistidas via API REST e a página pode ser atualizada manualmente. O estado é gerenciado com React Query, preparando o terreno para a sincronização da próxima fatia.

**Entregável Técnico:**

- Modelo `Card` e endpoints REST (CRUD + `PATCH .../move`).
- `@dnd-kit` integrado com atualizações otimistas (React Query).
- Painel de detalhes do card.

---

## Fatia 3: Colaboração em Tempo Real

**Objetivo:** Vários membros no mesmo quadro veem alterações instantaneamente.

| História | Descrição Resumida                      |
|----------|-----------------------------------------|
| US10     | Convite de membros ao quadro            |
| US11     | Visualizar alterações em tempo real     |

**Por que essa fatia?**
Este é o salto técnico mais significativo: introduzir WebSockets e transformar o quadro em uma experiência multiusuário. As histórias de cards e colunas das fatias anteriores são agora atualizadas com eventos em tempo real, sem recarregar a página. A parte de convite garante que apenas membros autorizados acessem o quadro. Ao final, o FlowBoard já funciona como um Trello simplificado e colaborativo.

**Entregável Técnico:**

- Modelo de associação `BoardMember`.
- WebSocket no FastAPI com salas por `board_id`.
- Hook customizado no React que escuta eventos e atualiza o cache do React Query.

---

## Fatia 4: Comunicação e Rastreabilidade

**Objetivo:** Discussão em cards e auditoria de todas as ações.

| História | Descrição Resumida                |
|----------|-----------------------------------|
| US12     | Comentar em um card               |
| US13     | Histórico de atividades do card   |

**Por que essa fatia?**
Adiciona a camada de discussão e auditoria, completando a experiência de trabalho em equipe. Os comentários também são transmitidos em tempo real, aproveitando a infraestrutura de WebSocket já construída. O histórico fornece a transparência que gestores esperam.

**Entregável Técnico:**

- Modelos `Comment` e `ActivityLog`.
- Endpoints e eventos WebSocket para comentários.
- Registro automático de atividades nas operações de card (middleware ou trigger no backend).

---

## Benefícios dessa Divisão

- **Entrega contínua de valor:** ao final da primeira fatia já há algo funcional para validar com usuários reais.
- **Aprendizado progressivo:** começa com FastAPI + REST, depois avança para WebSocket e estado otimista.
- **Redução de risco:** cada fatia é um checkpoint concreto; se houver atraso, a fatia anterior continua funcional e entregável.
- **Planejamento ágil:** as histórias dentro de uma fatia podem ser desenvolvidas em paralelo ou sequencialmente, dependendo da equipe.

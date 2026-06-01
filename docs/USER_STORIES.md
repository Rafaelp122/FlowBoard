# Histórias de Usuário — FlowBoard

Cada história segue o formato: **Como um(a) [persona], quero [ação], para [benefício].**
Os critérios de aceitação definem quando a história está concluída (Confirmação).

---

## Épico: Autenticação e Acesso

### US01 — Cadastro de Conta

**Como** um(a) novo(a) usuário(a),
**Quero** criar uma conta com e-mail e senha,
**Para** ter meu espaço pessoal no FlowBoard.

**Critérios de Aceitação:**

- [ ] Formulário de cadastro com nome, e-mail e senha (mínimo 8 caracteres).
- [ ] E-mail duplicado retorna erro amigável (`400 Bad Request`).
- [ ] Após cadastro, o usuário é logado automaticamente e redirecionado ao dashboard.

### US02 — Login e Logout

**Como** um(a) usuário(a) registrado(a),
**Quero** fazer login com minhas credenciais,
**Para** acessar meus quadros de qualquer dispositivo.

**Critérios de Aceitação:**

- [ ] Tela de login com e-mail e senha.
- [ ] Token JWT é armazenado no cliente e expira após período configurável.
- [ ] Botão de logout invalida a sessão e redireciona para a tela de login.

---

## Épico: Gestão de Quadros e Colunas

### US03 — Criar um Novo Quadro

**Como** um(a) gerente de projeto,
**Quero** criar um quadro com título e descrição,
**Para** organizar visualmente um novo fluxo de trabalho.

**Critérios de Aceitação:**

- [ ] Botão "Novo Quadro" na tela inicial.
- [ ] O quadro é criado com três colunas padrão: "A Fazer", "Em Andamento", "Concluído".
- [ ] Somente o criador pode renomear ou excluir o quadro.

### US04 — Editar e Excluir Quadro

**Como** proprietário(a) de um quadro,
**Quero** renomeá-lo ou removê-lo,
**Para** manter minha lista de projetos sempre atualizada.

**Critérios de Aceitação:**

- [ ] Edição inline do nome do quadro.
- [ ] Exclusão com confirmação, removendo colunas e cards associados.
- [ ] Não proprietários não veem opções de editar/excluir.

### US05 — Gerenciar Colunas

**Como** um(a) gerente de projeto,
**Quero** adicionar, renomear e excluir colunas,
**Para** adaptar o fluxo de trabalho à minha equipe.

**Critérios de Aceitação:**

- [ ] Botão "Adicionar Coluna" no final da linha de colunas.
- [ ] Renomeação refletida em tempo real para membros conectados (futuro WebSocket).
- [ ] Exclusão de coluna move cards existentes para a primeira coluna disponível.

---

## Épico: Manipulação de Cards

### US06 — Criar um Card

**Como** membro da equipe,
**Quero** adicionar uma tarefa com título em uma coluna,
**Para** registrar rapidamente o que precisa ser feito.

**Critérios de Aceitação:**

- [ ] Botão "+" no rodapé de cada coluna.
- [ ] Salvamento automático ao perder o foco ou pressionar Enter.
- [ ] Card aparece imediatamente na interface de todos os colaboradores do quadro (via WebSocket na fatia 3).

### US07 — Editar Detalhes do Card

**Como** responsável pela tarefa,
**Quero** abrir o card e editar título, descrição, data de entrega, etiquetas e responsável,
**Para** que a equipe tenha informações precisas.

**Critérios de Aceitação:**

- [ ] Painel lateral ou modal com formulários ao clicar no card.
- [ ] Campos: título, descrição (Markdown), date picker, dropdown de responsável, etiquetas coloridas.
- [ ] Alterações persistidas e (futuramente) transmitidas em tempo real.

### US08 — Mover Card entre Colunas (Drag and Drop)

**Como** membro da equipe,
**Quero** arrastar um card de uma coluna para outra,
**Para** sinalizar o progresso da tarefa sem abrir o card.

**Critérios de Aceitação:**

- [ ] Arrastar e soltar com `@dnd-kit`, sem recarregar a página.
- [ ] A nova posição (coluna e índice) é persistida via `PATCH /api/v1/cards/{id}/move`.
- [ ] Atualização otimista: o card move instantaneamente na UI e reverte se a API falhar.

### US09 — Excluir um Card

**Como** organizador,
**Quero** remover cards obsoletos,
**Para** manter o quadro limpo e focado.

**Critérios de Aceitação:**

- [ ] Opção de excluir no menu contextual do card, com confirmação.
- [ ] Card é removido do banco e desaparece da interface de todos os membros (tempo real na fatia 3).

---

## Épico: Colaboração em Tempo Real

### US10 — Convite de Membros ao Quadro

**Como** dono do quadro,
**Quero** convidar outros usuários por e-mail,
**Para** que a equipe possa colaborar junta.

**Critérios de Aceitação:**

- [ ] Tela de membros do quadro com campo de busca/convite por e-mail.
- [ ] Usuário convidado é adicionado à lista de membros e ganha acesso ao quadro.
- [ ] Não membros que tentarem acessar o quadro recebem erro `403 Forbidden`.

### US11 — Visualizar Alterações em Tempo Real

**Como** colaborador,
**Quero** ver quando colegas movem, criam ou editam cards e colunas,
**Para** que trabalhemos de forma sincronizada sem recarregar a página.

**Critérios de Aceitação:**

- [ ] Eventos de criação, edição e movimentação são transmitidos via WebSocket.
- [ ] A UI atualiza automaticamente com animações sutis.
- [ ] Conflitos resolvidos por "última alteração prevalece".

---

## Épico: Comunicação e Rastreabilidade

### US12 — Comentar em um Card

**Como** colaborador,
**Quero** deixar comentários em um card,
**Para** discutir detalhes da tarefa mantendo o contexto.

**Critérios de Aceitação:**

- [ ] Seção de comentários dentro do card com campo de texto e botão enviar.
- [ ] Cada comentário exibe autor, data e hora.
- [ ] Novos comentários são transmitidos em tempo real.

### US13 — Histórico de Atividades do Card

**Como** gestor de projeto,
**Quero** ver um log de ações realizadas em um card,
**Para** ter rastreabilidade das decisões da equipe.

**Critérios de Aceitação:**

- [ ] Aba "Atividade" no painel do card.
- [ ] Lista eventos: "Card criado", "Movido para Em Andamento por João", "Data alterada por Maria".
- [ ] Cada entrada com usuário, ação e timestamp.

---

## Definition of Done

Toda história só está concluída quando:

- [ ] Critérios de aceitação da história atendidos.
- [ ] Senhas armazenadas com hash (bcrypt), nunca em texto plano.
- [ ] Token JWT validado em toda rota REST e handshake WebSocket.
- [ ] Rotas verificam se o usuário é membro do quadro acessado.
- [ ] Operações de banco executadas de forma assíncrona.
- [ ] Dados recebidos via WebSocket validados com schema antes do broadcast.
- [ ] Conexões WebSocket isoladas por `board_id`.
- [ ] Atualizações otimistas no frontend com reversão em caso de falha.
- [ ] Tabela de atividades é append-only.
- [ ] Endpoints REST cobertos por testes automatizados.
- [ ] Componentes críticos do frontend testados.

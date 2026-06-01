# ADR 001: Python + FastAPI como Stack do Backend

## Status

Aceito

## Contexto

O FlowBoard exige um backend que suporte requisitos conflitantes: operações REST tradicionais (CRUD de quadros, colunas e cards), conexões WebSocket persistentes para colaboração em tempo real, validação rigorosa de dados em todas as camadas e documentação de API atualizada automaticamente. A equipe tem familiaridade com Python e o projeto tem propósito de aprendizado/consolidação nesse ecossistema.

## Decisão

Usar **Python 3.11+** com **FastAPI** como framework web.

## Alternativas Consideradas

| Alternativa                 | Prós                                               | Contras                                              |
|-----------------------------|-----------------------------------------------------|------------------------------------------------------|
| Django + DRF + Channels     | Admin automático, ecossistema maduro, ORM integrado | Pesado para WebSockets (Channels adiciona complexidade); síncrono por padrão; overengineering para escopo do projeto |
| Flask + Flask-SocketIO      | Simples, flexível                                   | Sem validação nativa de schemas (Pydantic); sem OpenAPI automático; SocketIO não é WebSocket nativo |
| LiteStar                    | Moderno, async-first, similar ao FastAPI            | Ecossistema ainda imaturo (menos plugins, tutoriais, comunidade) |

## Consequências

### Positivas

- **Validação integrada:** Pydantic garante contratos de request/response tipados em toda a API.
- **WebSockets nativos:** Starlette (base do FastAPI) suporta WebSocket sem dependências externas, simplificando o agrupamento em salas por `board_id`.
- **Documentação automática:** Swagger UI e ReDoc gerados a partir dos schemas, acelerando desenvolvimento e testes manuais.
- **Async/await:** Operações de I/O (banco, WebSocket) não bloqueiam a event loop, essencial para RNF04.
- **Dependency injection:** Sistema nativo para obter usuário autenticado e permissões em cada rota (RNF03).

### Negativas

- **Menos baterias inclusas** que Django: sem admin, sem ORM integrado, exigindo mais decisões separadas (ADR 002).
- **Curva de async:** SQLAlchemy async, pytest-asyncio e httpx.AsyncClient exigem familiaridade com padrões assíncronos.

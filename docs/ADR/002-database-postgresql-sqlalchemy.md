# ADR 002: PostgreSQL + SQLAlchemy 2.0 Async

## Status

Aceito

## Contexto

O backend definido no ADR 001 (FastAPI async) exige uma camada de persistência que suporte operações não bloqueantes (RNF04). Os modelos de domínio (`User`, `Board`, `Column`, `Card`, `Comment`, `ActivityLog`) envolvem relacionamentos complexos (muitos-para-muitos em membros de quadro, integridade referencial entre colunas e cards) e necessidade de consultas concorrentes por múltiplos usuários no mesmo quadro.

## Decisão

Usar **PostgreSQL 14+** como banco de dados relacional, com **SQLAlchemy 2.0** no modo async e **asyncpg** como driver.

## Alternativas Consideradas

| Alternativa              | Prós                                          | Contras                                              |
|--------------------------|------------------------------------------------|------------------------------------------------------|
| SQLite + aiosqlite       | Zero configuração, ideal para dev local        | Concorrência limitada; não escala para múltiplos usuários simultâneos; sem suporte robusto a JSON |
| MongoDB + Motor          | Schemaless, bom para documentos aninhados      | Dados do FlowBoard são relacionais por natureza; sem integridade referencial nativa entre entidades |
| PostgreSQL + psycopg3    | Async nativo, moderno                          | SQLAlchemy async com asyncpg é mais maduro e documentado |

## Consequências

### Positivas

- **Async nativo:** SQLAlchemy 2.0 + asyncpg permitem `select`, `insert`, `update` e `delete` assíncronos, alinhados ao RNF04.
- **Integridade referencial:** Foreign keys, constraints e transações ACID garantem consistência entre entidades relacionadas.
- **Suporte a JSON:** Colunas JSONB úteis para etiquetas de cards ou metadados.
- **Concorrência:** MVCC do PostgreSQL lida bem com múltiplos usuários lendo/escrevendo no mesmo quadro.

### Negativas

- **Complexidade de setup:** Requer instância PostgreSQL em desenvolvimento e produção (Docker Compose mitiga isso).
- **Migrations:** Exige ferramenta de migração (Alembic) para versionar o schema.
- **Curva de SQLAlchemy async:** Sessões assíncronas (`AsyncSession`) têm API diferente da síncrona; lazy loading não funciona, exigindo `selectinload` explícito.

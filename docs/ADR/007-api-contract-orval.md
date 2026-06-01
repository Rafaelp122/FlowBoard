# ADR 007: Orval para Contrato de API (OpenAPI → Hooks React Query)

## Status

Aceito

## Contexto

O backend FastAPI gera documentação OpenAPI automaticamente a partir dos schemas Pydantic e das rotas definidas. O frontend precisa consumir essa API com tipagem forte e integração com TanStack Query (cache, mutations otimistas, invalidação). Escrever `api.ts` manualmente para cada feature é repetitivo, propenso a erros de tipagem e desconectado dos schemas reais do backend.

## Decisão

Usar **Orval** para gerar automaticamente o cliente HTTP tipado e hooks do React Query a partir do spec OpenAPI do backend.

O frontend **não terá arquivos `api.ts` manuais** — cada feature importa os hooks gerados, que já incluem tipagem completa de request/response, cache keys e suporte a mutations.

## Alternativas Consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| HeyAPI | Moderno, suporte a múltiplos specs | Menos maduro na integração com React Query; comunidade menor |
| openapi-typescript + wrapper manual | Tipos precisos, controle total | Multiplica boilerplate; cada feature precisa de wrapper customizado; desconectado do React Query |
| api.ts manual por feature | Zero dependências externas | Sem garantia de contrato; mudanças no backend quebram silenciosamente; repetitivo |

## Consequências

### Positivas

- **Contrato vivo:** qualquer mudança no backend (novo campo, rota renomeada) quebra o build do frontend — não em runtime.
- **Zero boilerplate de API:** hooks como `useGetBoards`, `useCreateBoard`, `useMoveCard` são gerados com tipagem completa, cache keys e invalidação configurável.
- **React Query nativo:** Orval gera hooks do TanStack Query v5, com suporte a mutations otimistas e invalidação seletiva — alinhado ao RNF07.
- **Configuração declarativa:** `orval.config.ts` define input (URL do OpenAPI) e output (hooks por feature).

### Negativas

- **Dependência de build:** o frontend depende do backend rodando (ou de um spec estático) para gerar os hooks durante o desenvolvimento.
- **Curva de configuração:** requer ajuste inicial do `orval.config.ts` para mapear tags do OpenAPI para features do frontend.
- **Geração automática = código gerado:** hooks gerados não devem ser editados manualmente; qualquer customização precisa ser feita por wrapper ou output override.

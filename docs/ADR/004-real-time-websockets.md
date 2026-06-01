# ADR 004: WebSockets Nativos para Tempo Real

## Status

Aceito

## Contexto

O RF11 exige que alterações em cards e colunas sejam transmitidas instantaneamente para todos os membros conectados ao mesmo quadro. Isso implica um canal de comunicação bidirecional persistente entre cliente e servidor. Os eventos incluem criação, edição, movimentação e exclusão de cards/colunas, além de novos comentários (RF12).

## Decisão

Usar **WebSockets nativos do Starlette** (base do FastAPI), agrupando conexões em salas por `board_id`, com validação de autenticação no handshake e schemas Pydantic na troca de mensagens.

## Alternativas Consideradas

| Alternativa            | Prós                                      | Contras                                              |
|------------------------|--------------------------------------------|------------------------------------------------------|
| Polling (REST)         | Simples, sem mudança arquitetural          | Latência elevada; desperdício de banda e CPU; exigiria cache complexo para detectar mudanças |
| Server-Sent Events     | Unidirecional, mais simples que WS         | Só servidor→cliente; ações do cliente (criar, mover) precisariam de REST separado; duas conexões por cliente |
| Socket.IO              | Fallback para polling, reconexão built-in  | Adiciona camada de abstração e dependência; não é WebSocket nativo; overengineering para escopo |
| Mercure                | Nativo da web moderna, pub/sub             | Ecossistema Python imaturo; exige servidor separado (hub) |

## Consequências

### Positivas

- **Baixa latência:** Conexão persistente elimina overhead de handshake HTTP por evento.
- **Bidirecional:** Cliente envia ações via WS e recebe broadcast no mesmo canal, simplificando o protocolo (RNF08).
- **Sem dependências externas:** Starlette/FastAPI suportam WebSocket nativamente, sem bibliotecas adicionais.
- **Salas por board_id:** Isolamento natural (RNF06) — cada cliente só assina eventos do quadro em que está.

### Negativas

- **Gerenciamento de estado:** O servidor precisa manter um dicionário de conexões ativas por `board_id`, com limpeza de conexões mortas.
- **Reconexão:** Responsabilidade do cliente implementar backoff e retry em caso de desconexão.
- **Escalabilidade:** WebSockets são stateful — se houver múltiplas instâncias do backend no futuro, exigirá um pub/sub externo (Redis) para broadcast cross-instance.

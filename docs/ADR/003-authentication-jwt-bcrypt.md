# ADR 003: Autenticação JWT + bcrypt

## Status

Aceito

## Contexto

O FlowBoard é uma aplicação multiusuário onde o acesso a quadros e cards deve ser protegido (RNF01, RNF02, RNF03). A autenticação precisa funcionar tanto para requisições REST quanto para o handshake inicial de conexões WebSocket. O sistema não terá servidor de sessão centralizado.

## Decisão

Usar **JWT (JSON Web Tokens)** para autenticação stateless, com **bcrypt** (via `passlib`) para hash de senhas, e as bibliotecas **python-jose** para encode/decode de tokens e **passlib[bcrypt]** para hashing.

## Alternativas Consideradas

| Alternativa            | Prós                                  | Contras                                              |
|------------------------|----------------------------------------|------------------------------------------------------|
| Session-based (cookies)| Simples, revogação imediata            | Exige servidor de sessão ou sticky sessions; não funciona bem com WebSocket cross-origin |
| OAuth2 (Google/GitHub) | Zero senha para gerenciar              | Adiciona dependência externa; público-alvo é projeto de estudo, não produto SaaS |
| Argon2 (em vez de bcrypt) | Mais moderno, resistente a GPU       | bcrypt é suficientemente seguro e mais difundido; `passlib` abstrai a troca futura |

## Consequências

### Positivas

- **Stateless:** Sem estado de sessão no servidor, facilitando escalabilidade horizontal.
- **WebSocket compatível:** Token pode ser enviado como query parameter ou no primeiro frame do WebSocket para autenticar a conexão (RNF02).
- **Decodificação rápida:** Validação de token em toda request é uma operação criptográfica leve (sem acesso a banco).
- **Expiração embutida:** Tokens expiram automaticamente, limitando janela de ataque.

### Negativas

- **Revogação difícil:** Uma vez emitido, o token é válido até expirar (mitigável com refresh tokens de curta duração).
- **Payload visível:** Claims do JWT são apenas codificados (Base64), não criptografados — jamais incluir dados sensíveis no payload.
- **Complexidade de refresh:** Exige lógica adicional para renovar tokens sem forçar re-login.

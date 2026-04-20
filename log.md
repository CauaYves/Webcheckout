# Log de Desenvolvimento — Webcheckout-v2

## Login

### Goal

Implementar o sistema de autenticação completo de um app de webcheckout, incluindo: cliente HTTP, store de sessão, login funcional com a API real, sistema de token artificial com `origin`, e guards de rota para proteger páginas autenticadas.

### Instructions

- O projeto é uma SPA com **Vite + React 19 + TypeScript + TanStack Router** (file-based routing). **Não é Next.js**.
- Usar **fetch nativo** para chamadas HTTP — sem axios ou qualquer wrapper de cliente HTTP.
- Variáveis de ambiente com prefixo `VITE_` (padrão Vite).
- O linter/formatter é **Biome** (não ESLint/Prettier).
- `erasableSyntaxOnly: true` no tsconfig — **não pode usar `class` com `implements`** ou outros construtos TypeScript não-apagáveis.
- O roteador é **TanStack Router** com file-based routing — guards usam `beforeLoad` com `throw redirect(...)`.
- O `routeTree.gen.ts` é **gerado automaticamente** pelo Vite build — nunca editar manualmente.
- Sessão deve ser salva em **`sessionStorage`** (expira ao fechar a aba, isolamento entre clientes).
- O token deve conter os dados da API + campos artificiais `Email` (credencial usada no login) e `origin` (o `client` param da URL, ex: `"multiclubes"`).
- A `AUTH_KEY` fica no `.env` como `VITE_AUTH_KEY` — o usuário já atualizou o valor.
- Logger no `onSubmit` da página de login: `console.group` com URL, body, status e response para facilitar debug.

### Discoveries

- A API retorna erro `AuthenticationKeyInvalid` com status diferente de 401 — a auth key no `.env` precisou ser atualizada pelo usuário.
- O TanStack Router registra o index route (`/$client/index.tsx`) com `to: '/$client'` (sem barra final) no tipo TypeScript — usar `"/$client/"` causa erro de tipo.
- O `routeTree.gen.ts` só é regenerado ao rodar o build/dev do Vite — foi necessário rodar `vite build` para registrar a nova rota `/$client/index.tsx`.
- `useAuthStore.getState()` funciona fora de componentes React (nos `beforeLoad` do TanStack Router), pois o Zustand expõe `getState()` diretamente na store.
- O guard de rotas protegidas está no `/$client/route.tsx` (layout pai), o que garante proteção automática para **qualquer nova rota** adicionada dentro de `/$client/` sem precisar repetir o guard.

### Accomplished

Tudo concluído e passando em `tsc --noEmit` sem erros:

- `.env` criado com `VITE_API_URL`, `VITE_ACCOUNT_PATH`, `VITE_AUTH_KEY`
- `src/stores/auth.store.ts` — Zustand store com `persist` no `sessionStorage`, tipo `Session` com campos da API + `Email` + `origin`
- `src/routes/$client/entrar.tsx` — fetch direto, logger no `onSubmit`, salva token com `origin: client` e `Email: data.credential`, redireciona para `/$client` após login; guard `beforeLoad` redireciona para `/$client` se já autenticado
- `src/routes/$client/route.tsx` — guard `beforeLoad` que protege todas as rotas filhas: verifica sessão e `origin === params.client`, redireciona para `/entrar` se inválido
- `src/routes/$client/index.tsx` — página inicial protegida (placeholder com "Página inicial")
- `src/lib/api.ts` — **removido** a pedido do usuário (não usar wrapper, usar fetch simples)

### Relevant files / directories

```
/mnt/e/Webcheckout-v2/
├── .env                                  # Variáveis de ambiente (VITE_API_URL, VITE_ACCOUNT_PATH, VITE_AUTH_KEY)
├── src/
│   ├── stores/
│   │   └── auth.store.ts                 # Zustand store de sessão (sessionStorage)
│   ├── routes/
│   │   ├── __root.tsx                    # Root layout (Toaster + max-w-[578px])
│   │   └── $client/
│   │       ├── route.tsx                 # Layout pai: aplica tema + guard de autenticação
│   │       ├── index.tsx                 # Página inicial protegida (/$client/)
│   │       └── entrar.tsx                # Página de login com fetch + logger + guard
│   └── routeTree.gen.ts                  # Gerado automaticamente pelo Vite — não editar
```

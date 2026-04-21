# Component Creation Skill

Esta pasta `/components/` segue padrões estritos baseados nas primitivas localizadas em `./ui/`. Ao criar novos componentes nesta pasta, siga as regras abaixo.

## Referência Rápida (Baseada em `/ui`)

| Recurso | Padrão | Exemplo de Referência |
| :--- | :--- | :--- |
| **Estrutura** | Funções Nomeadas | `button.tsx`, `card.tsx` |
| **Estilo** | Tailwind v4 + `cn()` | `item.tsx`, `badge.tsx` |
| **Variantes** | `cva` | `button.tsx`, `field.tsx` |
| **Targeting** | `data-slot` | Todos em `/ui` |
| **Indentação** | Tabs | Ver qualquer arquivo `.tsx` |

## Como criar um novo componente

1.  **Analise a UI:** Antes de criar, veja se o componente já existe ou pode ser composto usando `Card`, `Item` ou `Field`.
2.  **Copie o Boilerplate:** Use o padrão de função nomeada com `React.ComponentProps`.
3.  **Use Slots:** Atribua um `data-slot` único ao elemento raiz (ex: `data-slot="meu-componente"`).
4.  **Respeite o Design:** Use `rounded-4xl` para o raio padrão de containers grandes e `rounded-xl` para botões/itens menores.

---

*Para instruções detalhadas e templates de código, consulte a skill em: `.agents/skills/component-generator/SKILL.md`*

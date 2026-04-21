---
name: component-generator
description: Guia e padrões para criação de novos componentes no projeto Webcheckout-v2. Baseado nos componentes da pasta /ui.
---

# Component Generator Skill

Esta skill fornece diretrizes e templates para criar componentes React 19 que seguem rigorosamente a arquitetura e o design system do Webcheckout-v2.

## Princípios Core

1.  **Indentação:** SEMPRE use TABs.
2.  **Naming:** Use `PascalCase` para componentes e exportações nomeadas (não use `export default`).
3.  **Tipagem:** Extenda `React.ComponentProps<"tag">` ou `React.ComponentProps<typeof UIComponent>`.
4.  **Estilização:** Use Tailwind CSS v4 e a função utilitária `cn()`.
5.  **Acessibilidade:** Use atributos `data-slot` em todos os elementos raiz e sub-componentes para permitir estilização via seletores CSS (ex: `has-data-[slot=card-header]`).
6.  **Polimorfismo:** Implemente o padrão `asChild` usando `Slot` do Radix UI sempre que o componente for um container ou botão.

## Template de Componente Base

```tsx
import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

interface MyComponentProps extends React.ComponentProps<"div"> {
	asChild?: boolean;
}

function MyComponent({ className, asChild = false, ...props }: MyComponentProps) {
	const Comp = asChild ? Slot.Root : "div";

	return (
		<Comp
			data-slot="my-component"
			className={cn(
				"flex flex-col gap-2 rounded-4xl bg-card p-4 text-sm",
				className
			)}
			{...props}
		/>
	);
}

export { MyComponent };
export type { MyComponentProps };
```

## Template de Componente com Variantes (CVA)

Use `class-variance-authority` para componentes com múltiplos estados ou tamanhos.

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const myComponentVariants = cva(
	"inline-flex items-center justify-center transition-colors",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground",
				outline: "border border-border bg-background",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-8 px-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

interface MyComponentProps 
	extends React.ComponentProps<"div">, 
	VariantProps<typeof myComponentVariants> {}

function MyComponent({ className, variant, size, ...props }: MyComponentProps) {
	return (
		<div
			data-slot="my-component"
			data-variant={variant}
			data-size={size}
			className={cn(myComponentVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { MyComponent, myComponentVariants };
```

## Padrões de Composição (Inspirado em `card.tsx` e `item.tsx`)

Para componentes complexos, separe em sub-componentes que se comunicam via seletores `data-slot` ou `group`.

```tsx
function ComplexComponent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="complex-component"
			className={cn("group/complex flex flex-col gap-4", className)}
			{...props}
		/>
	);
}

function ComplexHeader({ className, ...props }: React.ComponentProps<"header">) {
	return (
		<header
			data-slot="complex-header"
			className={cn("flex items-center justify-between px-4", className)}
			{...props}
		/>
	);
}

export { ComplexComponent, ComplexHeader };
```

## Regras de Design (Tailwind v4)

*   **Bordas:** Prefira `rounded-4xl` para containers principais e `rounded-xl` para elementos internos.
*   **Cores:** Use as variáveis de contexto: `primary`, `secondary`, `muted`, `accent`, `destructive`, `card`.
*   **Animações:** Use `framer-motion` para transições complexas ou classes Tailwind (`animate-spin`, `transition-all`) para estados simples.
*   **Espaçamento:** Mantenha a consistência com `gap-4` (1rem) ou `gap-6` (1.5rem) em layouts de lista.

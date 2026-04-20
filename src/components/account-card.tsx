import { Ellipsis } from "lucide-react";
import type { AccountResult } from "@/types/refresh";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
	account: AccountResult;
}

export function AccountCard({ account }: AccountCardProps) {
	// Contas sem Code não são renderizadas
	if (!account.Code) return null;

	return (
		<article
			className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3"
			aria-label={`Conta de ${account.Owner}, código ${account.Code}`}
		>
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold text-foreground">
					{account.Owner}
				</span>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`Opções da conta ${account.Code}`}
				>
					<Ellipsis className="size-4 text-muted-foreground" aria-hidden="true" />
				</Button>
			</div>

			<dl className="flex items-center justify-between text-xs text-muted-foreground">
				<div className="flex gap-1">
					<dt>Consumo:</dt>
					<dd className="font-medium text-foreground">
						{formatCurrency(account.PayableValue)}
					</dd>
				</div>
				<div className="flex gap-1">
					<dt>Código:</dt>
					<dd>{account.Code}</dd>
				</div>
			</dl>
		</article>
	);
}

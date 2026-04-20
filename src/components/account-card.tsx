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
		<div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold text-foreground">
					{account.Owner}
				</span>
				<Button variant="ghost" size="icon-sm" aria-label="Opções da conta">
					<Ellipsis className="size-4 text-muted-foreground" />
				</Button>
			</div>

			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span>
					Consumo:{" "}
					<span className="font-medium text-foreground">
						{formatCurrency(account.PayableValue)}
					</span>
				</span>
				<span>Código: {account.Code}</span>
			</div>
		</div>
	);
}

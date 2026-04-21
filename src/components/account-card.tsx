import { CreditCard, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { AccountResult } from "@/types/refresh";
import { isAccountRechargeable } from "@/lib/accounts";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

interface AccountCardProps {
	account: AccountResult;
	allowPosPaidRecharge: boolean;
}

export function AccountCard({ account, allowPosPaidRecharge }: AccountCardProps) {
	const navigate = useNavigate();
	const { client } = useParams({ from: "/$client/" });

	// Contas sem Code não são renderizadas
	if (!account.Code) return null;

	const rechargeable = isAccountRechargeable(account, { allowPosPaidRecharge });
	const hasConsumption = account.PayableValue > 0;

	function handleViewDetails() {
		void navigate({
			to: "/$client/conta/$accountNumber",
			params: { client, accountNumber: String(account.AccountNumber) },
		});
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<article
					role="button"
					tabIndex={0}
					className="flex cursor-pointer flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					aria-label={`Conta de ${account.Owner}, código ${account.Code}. Toque para ver opções.`}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							(e.currentTarget as HTMLElement).click();
						}
					}}
				>
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-foreground">
							{account.Owner}
						</span>
						<CreditCard className="size-4 text-muted-foreground" aria-hidden="true" />
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
			</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{account.Owner}</DrawerTitle>
					<DrawerDescription>Código: {account.Code}</DrawerDescription>
				</DrawerHeader>

				<DrawerFooter>
					{rechargeable && (
						<Button
							variant="outline"
							size="lg"
							className="w-full rounded-full"
							aria-label={`Fazer recarga na conta de ${account.Owner}`}
						>
							<RotateCcw className="size-4" aria-hidden="true" />
							Fazer recarga
						</Button>
					)}

					<Button
						size="lg"
						className="w-full rounded-full"
						disabled={!hasConsumption}
						aria-disabled={!hasConsumption}
						aria-label={
							hasConsumption
								? `Pagar consumo de ${formatCurrency(account.PayableValue)} da conta de ${account.Owner}`
								: "Sem consumo a pagar nesta conta"
						}
					>
						Pagar consumo
					</Button>

					<Button
						variant="ghost"
						size="lg"
						className="w-full rounded-full"
						onClick={handleViewDetails}
						aria-label={`Ver detalhes da conta de ${account.Owner}`}
					>
						Ver detalhes
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

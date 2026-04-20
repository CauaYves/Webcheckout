import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useAccountsStore } from "@/stores/accounts.store";
import { fetchRefresh } from "@/services/refresh.service";
import { isAccountRechargeable, getInitials, getFirstName } from "@/lib/accounts";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AccountCard } from "@/components/account-card";

export const Route = createFileRoute("/$client/")({
	loader: async () => {
		const session = useAuthStore.getState().session!;
		const result = await fetchRefresh({ CloudAccountEid: session.CloudAccountEid });
		useAccountsStore.getState().applyRefresh(result);
	},
	component: HomePage,
});

function HomePage() {
	const session = useAuthStore((s) => s.session!);
	const accounts = useAccountsStore((s) => s.accounts);
	const allowPosPaidRecharge = useAccountsStore((s) => s.allowPosPaidRecharge);

	const initials = getInitials(session.Name);
	const firstName = getFirstName(session.Name);

	const totalToPay = accounts.reduce((sum, a) => sum + a.PayableValue, 0);

	const hasRechargeable = accounts.some((a) =>
		isAccountRechargeable(a, { allowPosPaidRecharge }),
	);

	return (
		<div className="flex min-h-svh flex-col">
			{/* Header */}
			<header className="flex items-center justify-between px-6 pt-6 pb-4">
				<div className="flex items-center gap-2.5">
					<Avatar size="default">
						<AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm font-medium text-foreground">
						Olá, {firstName}
					</span>
				</div>

				<button
					type="button"
					className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
					aria-label={`Selecionar perfil de ${firstName}`}
				>
					<span aria-hidden="true">{initials}</span>
					<ChevronDown className="size-3.5" aria-hidden="true" />
				</button>
			</header>

			{/* Total a pagar */}
			<section
				className="flex flex-col items-center gap-1 px-6 py-6"
				aria-label="Resumo financeiro"
			>
				<span className="text-xs text-muted-foreground">Total a pagar</span>
				<span
					className="text-3xl font-bold tracking-tight text-foreground"
					aria-live="polite"
					aria-atomic="true"
				>
					{formatCurrency(totalToPay)}
				</span>
			</section>

			{/* Lista de contas */}
			<section className="flex flex-1 flex-col gap-3 px-6 pb-6">
				<h2 className="text-sm font-semibold text-foreground">
					Suas contas de consumo
				</h2>

				{accounts.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Nenhuma conta de consumo encontrada.
					</p>
				) : (
					<ul className="flex flex-col gap-3" aria-label="Contas de consumo">
						{accounts.map((account) => (
							<li key={account.AccountNumber}>
								<AccountCard account={account} />
							</li>
						))}
					</ul>
				)}
			</section>

			{/* Ações — fixadas no rodapé */}
			<footer className="sticky bottom-0 flex flex-col gap-3 border-t border-border bg-background px-6 py-5">
				<Button
					size="lg"
					className={cn(
						"w-full rounded-full",
						totalToPay === 0 && "pointer-events-none opacity-50",
					)}
					disabled={totalToPay === 0}
					aria-label={`Pagar consumo total de ${formatCurrency(totalToPay)}`}
					aria-disabled={totalToPay === 0}
				>
					Pagar consumo total
				</Button>

				{hasRechargeable && (
					<Button
						variant="outline"
						size="lg"
						className="w-full rounded-full"
						aria-label="Fazer recarga nas contas elegíveis"
					>
						Fazer recarga
					</Button>
				)}
			</footer>
		</div>
	);
}

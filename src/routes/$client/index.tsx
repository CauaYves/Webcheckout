import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { accountsQueryOptions } from "@/queries/accounts.queries";
import { isAccountRechargeable, getInitials, getFirstName } from "@/lib/accounts";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountCard } from "@/components/account-card";

export const Route = createFileRoute("/$client/")({
	loader: async ({ context: { queryClient } }) => {
		const session = useAuthStore.getState().session!;
		// Pré-carrega (bloqueante) os dados no cache do React Query.
		// Se os dados já estiverem frescos no cache, não faz nova requisição.
		await queryClient.ensureQueryData(
			accountsQueryOptions(session.CloudAccountEid),
		);
	},
	component: HomePage,
});

function AccountListSkeleton() {
	return (
		<ul className="flex flex-col gap-3" aria-label="Carregando contas">
			{Array.from({ length: 3 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton estático sem identidade real
				<li key={i}>
					<Skeleton className="h-[72px] w-full rounded-xl" />
				</li>
			))}
		</ul>
	);
}

function HomePage() {
	const session = useAuthStore((s) => s.session!);
	const queryOptions = accountsQueryOptions(session.CloudAccountEid);

	const { data, isPending, isFetching, refetch } = useQuery(queryOptions);

	const accounts = data?.Accounts ?? [];
	const allowPosPaidRecharge = data?.AllowPosPaidRecharge ?? false;

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

				<div className="flex items-center gap-1">
					{/* Indicador de refetch em background */}
					{isFetching && !isPending && (
						<RefreshCw
							className="size-3.5 animate-spin text-muted-foreground"
							aria-label="Atualizando dados"
						/>
					)}

					<button
						type="button"
						className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
						aria-label={`Selecionar perfil de ${firstName}`}
					>
						<span aria-hidden="true">{initials}</span>
						<ChevronDown className="size-3.5" aria-hidden="true" />
					</button>
				</div>
			</header>

			{/* Total a pagar */}
			<section
				className="flex flex-col items-center gap-1 px-6 py-6"
				aria-label="Resumo financeiro"
			>
				<span className="text-xs text-muted-foreground">Total a pagar</span>
				{isPending ? (
					<Skeleton className="h-9 w-32 rounded-lg" />
				) : (
					<span
						className="text-3xl font-bold tracking-tight text-foreground"
						aria-live="polite"
						aria-atomic="true"
					>
						{formatCurrency(totalToPay)}
					</span>
				)}
			</section>

			{/* Lista de contas */}
			<section className="flex flex-1 flex-col gap-3 px-6 pb-6">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold text-foreground">
						Suas contas de consumo
					</h2>
					<button
						type="button"
						onClick={() => void refetch()}
						disabled={isFetching}
						className="text-xs font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Atualizar contas de consumo"
					>
						Atualizar
					</button>
				</div>

				{isPending ? (
					<AccountListSkeleton />
				) : accounts.length === 0 ? (
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
						(isPending || totalToPay === 0) && "pointer-events-none opacity-50",
					)}
					disabled={isPending || totalToPay === 0}
					aria-label={
						isPending
							? "Carregando dados de consumo"
							: `Pagar consumo total de ${formatCurrency(totalToPay)}`
					}
					aria-disabled={isPending || totalToPay === 0}
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

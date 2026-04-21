import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	ChevronDown,
	ShoppingBag,
	Undo2,
	ArrowLeftRight,
	Wallet,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { accountsQueryOptions } from "@/queries/accounts.queries";
import { movementsQueryOptions } from "@/queries/movements.queries";
import { isAccountRechargeable } from "@/lib/accounts";
import { formatCurrency } from "@/lib/format";
import {
	groupMovementsByDate,
	formatMovementTime,
	getMovementLabel,
} from "@/lib/movements";
import { AccountMovementType } from "@/types/movements";
import type { MovementResult } from "@/types/movements";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$client/conta/$accountNumber")({
	loader: async ({ context: { queryClient }, params }) => {
		const session = useAuthStore.getState().session!;
		const accountNumber = Number(params.accountNumber);

		// Garante que o cache de contas existe (normalmente já está presente
		// após a visita à home, mas protege acesso direto via URL).
		await queryClient.ensureQueryData(
			accountsQueryOptions(session.CloudAccountEid),
		);

		// Pré-carrega os movimentos de forma bloqueante.
		await queryClient.ensureQueryData(
			movementsQueryOptions(session.CloudAccountEid, accountNumber),
		);
	},
	component: AccountDetailPage,
});

// ─── Ícone por tipo de movimento ─────────────────────────────────────────────

function MovementIcon({ type }: { type: MovementResult["Type"] }) {
	const base = "size-4 shrink-0";

	if (type === AccountMovementType.Reversal) {
		return <Undo2 className={cn(base, "text-amber-500")} aria-hidden="true" />;
	}
	if (type === AccountMovementType.Transfer) {
		return (
			<ArrowLeftRight className={cn(base, "text-blue-500")} aria-hidden="true" />
		);
	}
	// Movement (consumo / recarga / outros)
	return <ShoppingBag className={cn(base, "text-primary")} aria-hidden="true" />;
}

// ─── Rótulo legível por tipo ──────────────────────────────────────────────────

function getMovementTypeLabel(type: MovementResult["Type"]): string {
	if (type === AccountMovementType.Reversal) return "Estorno";
	if (type === AccountMovementType.Transfer) return "Transferência";
	return "Consumo";
}

// ─── Item de movimento ────────────────────────────────────────────────────────

function MovementItem({ movement }: { movement: MovementResult }) {
	const time = formatMovementTime(movement.DateTime);
	const label = getMovementLabel(movement);
	const typeLabel = getMovementTypeLabel(movement.Type);
	const hasDetails =
		movement.Type === AccountMovementType.Movement &&
		movement.Details &&
		movement.Details.length > 0;

	return (
		<li
			className={cn(
				"flex flex-col gap-1.5",
				movement.IsReversed && "opacity-50",
			)}
			aria-label={`${typeLabel}: ${label}, ${formatCurrency(movement.Value)}${movement.IsReversed ? ", estornado" : ""}`}
		>
			{/* Linha principal */}
			<div className="flex items-center gap-3">
				<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
					<MovementIcon type={movement.Type} />
				</div>

				<div className="flex flex-1 items-center justify-between gap-2">
					<div className="flex flex-col">
						{time && (
							<span className="text-xs text-muted-foreground">{time}</span>
						)}
						<span className="text-sm font-medium text-foreground">{label}</span>
					</div>
					<span className="shrink-0 text-sm font-semibold text-foreground">
						{formatCurrency(movement.Value)}
					</span>
				</div>
			</div>

			{/* Detalhes dos itens */}
			{hasDetails && (
				<ul className="ml-11 flex flex-col gap-1" aria-label="Itens do movimento">
					{movement.Details!.map((detail) => (
						<li
							key={detail.ItemNumber}
							className={cn(
								"flex items-center justify-between text-xs text-muted-foreground",
								detail.IsReversed && "line-through opacity-60",
							)}
						>
							<span className="flex-1 pr-2">{detail.ItemName}</span>
							<span className="shrink-0">{formatCurrency(detail.SubTotal)}</span>
						</li>
					))}
				</ul>
			)}
		</li>
	);
}

// ─── Skeleton de carregamento ─────────────────────────────────────────────────

function DetailSkeleton() {
	return (
		<div className="flex flex-col gap-6 px-6 pt-6">
			{/* Cabeçalho da conta */}
			<div className="flex flex-col gap-2">
				<Skeleton className="h-7 w-48 rounded-lg" />
				<Skeleton className="h-4 w-28 rounded" />
			</div>

			{/* Saldo */}
			<div className="flex flex-col gap-3">
				<div className="flex justify-between">
					<Skeleton className="h-4 w-32 rounded" />
					<Skeleton className="h-4 w-20 rounded" />
				</div>
				<div className="flex justify-between">
					<Skeleton className="h-4 w-28 rounded" />
					<Skeleton className="h-4 w-20 rounded" />
				</div>
			</div>

			<Separator />

			{/* Movimentos */}
			{Array.from({ length: 4 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton estático sem identidade real
				<div key={i} className="flex items-center gap-3">
					<Skeleton className="size-8 shrink-0 rounded-full" />
					<div className="flex flex-1 flex-col gap-1.5">
						<Skeleton className="h-3 w-16 rounded" />
						<Skeleton className="h-4 w-40 rounded" />
					</div>
					<Skeleton className="h-4 w-16 shrink-0 rounded" />
				</div>
			))}
		</div>
	);
}

// ─── Página principal ─────────────────────────────────────────────────────────

function AccountDetailPage() {
	const { client, accountNumber: accountNumberParam } = Route.useParams();
	const navigate = useNavigate();
	const session = useAuthStore((s) => s.session!);
	const accountNumber = Number(accountNumberParam);

	// Dados da conta vindos do cache da home (sem nova requisição)
	const { data: accountsData } = useQuery(
		accountsQueryOptions(session.CloudAccountEid),
	);

	// Movimentos da conta
	const { data: movementsData, isPending } = useQuery(
		movementsQueryOptions(session.CloudAccountEid, accountNumber),
	);

	const account = accountsData?.Accounts.find(
		(a) => a.AccountNumber === accountNumber,
	);
	const allowPosPaidRecharge = accountsData?.AllowPosPaidRecharge ?? false;

	const movements = movementsData?.Movements ?? [];
	const previousBalance = movementsData?.PreviousBalance ?? 0;
	const groups = groupMovementsByDate(movements);

	const rechargeable = account
		? isAccountRechargeable(account, { allowPosPaidRecharge })
		: false;
	const hasConsumption = (account?.PayableValue ?? 0) > 0;

	return (
		<div className="flex min-h-svh flex-col">
			{/* Header de navegação */}
			<header className="flex items-center justify-between px-4 pt-6 pb-4">
				<button
					type="button"
					onClick={() =>
						void navigate({ to: "/$client", params: { client } })
					}
					className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
					aria-label="Voltar para a lista de contas"
				>
					<ArrowLeft className="size-5" aria-hidden="true" />
				</button>

				<h1 className="text-base font-semibold text-foreground">
					Detalhes de cartão
				</h1>

				{account ? (
					<button
						type="button"
						className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
						aria-label={`Conta de ${account.Owner}`}
					>
						<span>{account.Code}</span>
						<ChevronDown className="size-3.5" aria-hidden="true" />
					</button>
				) : (
					<div className="w-16" aria-hidden="true" />
				)}
			</header>

			{isPending || !account ? (
				<DetailSkeleton />
			) : (
				<div className="flex flex-1 flex-col">
					{/* Dados da conta */}
					<section className="px-6 pt-4 pb-6" aria-label="Dados da conta">
						<h2 className="text-2xl font-bold text-foreground">{account.Owner}</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Código: {account.Code}
						</p>

						<dl className="mt-5 flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<dt className="text-sm text-muted-foreground">Saldo disponível</dt>
								<dd className="text-sm font-semibold text-foreground">
									{formatCurrency(account.AvailableCredit)}
								</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-sm text-muted-foreground">Consumo atual</dt>
								<dd className="text-sm font-semibold text-foreground">
									{formatCurrency(account.PayableValue)}
								</dd>
							</div>
						</dl>
					</section>

					<Separator />

					{/* Movimentos */}
					<section
						className="flex flex-1 flex-col gap-6 px-6 pt-6 pb-24"
						aria-label="Movimentos dos últimos 30 dias"
					>
						{/* Saldo anterior */}
						{previousBalance !== 0 && (
							<div className="flex flex-col gap-3">
								<span className="text-sm font-semibold text-muted-foreground">
									Saldo anterior
								</span>
								<div className="flex items-center gap-3">
									<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
										<Wallet className="size-4 text-muted-foreground" aria-hidden="true" />
									</div>
									<div className="flex flex-1 items-center justify-between gap-2">
										<span className="text-sm text-muted-foreground">
											Movimentos anteriores a 30 dias
										</span>
										<span className="shrink-0 text-sm font-semibold text-foreground">
											{formatCurrency(previousBalance)}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Grupos de movimentos */}
						{groups.length === 0 && previousBalance === 0 ? (
							<p className="text-sm text-muted-foreground">
								Nenhum movimento nos últimos 30 dias.
							</p>
						) : (
							groups.map((group) => (
								<div key={group.dateKey} className="flex flex-col gap-4">
									<span className="text-sm font-semibold text-muted-foreground">
										{group.label}
									</span>
									<ul className="flex flex-col gap-4" aria-label={`Movimentos de ${group.label}`}>
										{group.movements.map((movement) => (
											<MovementItem
												key={movement.MovementUID}
												movement={movement}
											/>
										))}
									</ul>
								</div>
							))
						)}
					</section>
				</div>
			)}

			{/* Ações fixadas no rodapé */}
			{!isPending && account && (
				<footer className="sticky bottom-0 flex flex-col gap-3 border-t border-border bg-background px-6 py-5">
					{rechargeable && (
						<Button
							variant="outline"
							size="lg"
							className="w-full rounded-full"
							aria-label={`Fazer recarga na conta de ${account.Owner}`}
						>
							Fazer recarga
						</Button>
					)}

					<Button
						size="lg"
						className={cn(
							"w-full rounded-full",
							!hasConsumption && "pointer-events-none opacity-50",
						)}
						disabled={!hasConsumption}
						aria-disabled={!hasConsumption}
						aria-label={
							hasConsumption
								? `Pagar consumo de ${formatCurrency(account.PayableValue)}`
								: "Sem consumo a pagar nesta conta"
						}
					>
						Pagar consumo
					</Button>
				</footer>
			)}
		</div>
	);
}

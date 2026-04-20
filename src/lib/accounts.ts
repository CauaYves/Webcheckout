import { AccountStatus, type AccountResult } from "@/types/refresh";

interface IsAccountRechargeableOptions {
	allowPosPaidRecharge: boolean;
}

/**
 * Uma conta é recarregável quando:
 * - Status é Active
 * - É pré-paga (CreditLimit === null) OU é pós-paga e allowPosPaidRecharge está habilitado
 */
export function isAccountRechargeable(
	account: AccountResult,
	{ allowPosPaidRecharge }: IsAccountRechargeableOptions,
): boolean {
	if (account.Status !== AccountStatus.Active) return false;

	const isPrePaid = account.CreditLimit === null;
	const isPosPaid = account.CreditLimit !== null;

	return isPrePaid || (isPosPaid && allowPosPaidRecharge);
}

/**
 * Retorna as iniciais do nome completo (máximo 2 letras).
 * Ex: "Eduardo Santos" → "ES"
 */
export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Retorna o primeiro nome do usuário.
 * Ex: "Eduardo Santos" → "Eduardo"
 */
export function getFirstName(name: string): string {
	return name.trim().split(/\s+/)[0];
}

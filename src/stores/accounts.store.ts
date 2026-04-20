import { create } from "zustand";
import type { AccountResult, RefreshResult } from "@/types/refresh";

interface AccountsState {
	// Configurações globais retornadas pelo /refresh
	allowPosPaidRecharge: boolean;
	allowLowCreditNotification: boolean;
	lowCreditNotificationValue: number | null;
	lowCreditNotificationInterval: number | null;
	// Contas de consumo
	accounts: AccountResult[];
	// Aplica o resultado completo do /refresh, substituindo tudo
	applyRefresh: (result: RefreshResult) => void;
	// Limpa tudo (ex: ao fazer logout)
	clearAccounts: () => void;
}

export const useAccountsStore = create<AccountsState>()((set) => ({
	allowPosPaidRecharge: false,
	allowLowCreditNotification: false,
	lowCreditNotificationValue: null,
	lowCreditNotificationInterval: null,
	accounts: [],

	applyRefresh: (result) =>
		set({
			allowPosPaidRecharge: result.AllowPosPaidRecharge ?? false,
			allowLowCreditNotification: result.AllowLowCreditNotification ?? false,
			lowCreditNotificationValue: result.LowCreditNotificationValue ?? null,
			lowCreditNotificationInterval:
				result.LowCreditNotificationInterval ?? null,
			accounts: result.Accounts ?? [],
		}),

	clearAccounts: () =>
		set({
			allowPosPaidRecharge: false,
			allowLowCreditNotification: false,
			lowCreditNotificationValue: null,
			lowCreditNotificationInterval: null,
			accounts: [],
		}),
}));

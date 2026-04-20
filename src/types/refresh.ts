// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * Tipo de conta: sócio, visitante ou hóspede de hotel.
 * Usado para determinar regras de exibição e recarga.
 */
export const AccountType = {
	Member: 0,
	Visitor: 1,
	HotelGuest: 2,
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

/**
 * Status operacional da conta de consumo.
 * Apenas contas com status Active são elegíveis para recarga.
 */
export const AccountStatus = {
	Active: 0,
	Blocked: 1,
	Damaged: 2,
	Deactivated: 3,
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

// ─── Nested types ─────────────────────────────────────────────────────────────

export interface CustomerType {
	Id: number;
	Name: string;
}

export interface HotelReserveResult {
	HotelEid: string;
	RoomNumber: string;
	GuestEid: string;
	Reserve: string;
	ReserveEid: string;
}

// ─── Request ──────────────────────────────────────────────────────────────────

export interface RefreshData {
	CloudAccountEid: number;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export interface AccountResult {
	AccountNumber: number;
	MemberId: number;
	Type: AccountType;
	CustomerType: CustomerType;
	Owner: string;
	Code: string | null;
	CreditLimit: number | null;
	CurrentBalance: number;
	AvailableCredit: number;
	PayableValue: number;
	OpenInvoiceValue: number;
	Status: AccountStatus;
	HotelReserve: HotelReserveResult | null;
}

export interface RefreshResult {
	AllowPosPaidRecharge: boolean;
	AllowLowCreditNotification: boolean;
	LowCreditNotificationValue: number | null;
	LowCreditNotificationInterval: number | null;
	Accounts: AccountResult[];
}

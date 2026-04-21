// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * Tipo do movimento de consumo.
 */
export const AccountMovementType = {
	/** Consumo. */
	Movement: 0,
	/** Estorno. */
	Reversal: 1,
	/** Transferência. */
	Transfer: 2,
} as const;

export type AccountMovementType =
	(typeof AccountMovementType)[keyof typeof AccountMovementType];

/**
 * Origem do movimento de consumo.
 */
export const AccountMovementOrigin = {
	/** Consumo de produtos e serviços. */
	Consumption: 0,
	/** Recarga de créditos. */
	Recharge: 1,
	/** Devolução de créditos. */
	Refund: 2,
	/** Pagamento de fatura. */
	Bill: 3,
	/** Desconto por cartão danificado. */
	CardDamage: 4,
	/** Crédito retido. */
	Drop: 5,
	/** Recarga de créditos MultiClubes. */
	MultiClubesRecharge: 6,
	/** Pagamento de pós-pago MultiClubes. */
	MultiClubesPayment: 6,
	/** Crédito inicial na ativação de cartão com valor de face. */
	CardActivation: 7,
	/** Custo do cartão na ativação. */
	CardActivationDrop: 8,
	/** Consumo, venda paga pelo MultiClubes. */
	MultiClubesConsumption: 9,
	/** Crédito inserido como um Voucher. */
	VoucherRecharge: 10,
	/** Crédito removido por desativação de um produto voucher. */
	ProductVoucherDrop: 11,
	/** Devolução de créditos feita no MultiClubes. */
	MultiClubesRefund: 12,
	/** Consumo de produto voucher. */
	VoucherConsumption: 13,
	/** Crédito inserido como um Voucher pelo MultiClubes. */
	MultiClubesVoucherRecharge: 14,
	/**
	 * Movimento sem valor referente ao consumo de produtos all inclusive (gratuitos).
	 * Não é exibido nos extratos de consumo para o cliente final.
	 */
	AllInclusive: 17,
} as const;

export type AccountMovementOrigin =
	(typeof AccountMovementOrigin)[keyof typeof AccountMovementOrigin];

// ─── Nested types ─────────────────────────────────────────────────────────────

/**
 * Item consumido dentro de um movimento de consumo.
 * Somente movimentos do tipo `Movement` possuem detalhes.
 */
export interface MovementDetailResult {
	/** Número do item. */
	ItemNumber: number;
	/** Nome do item. */
	ItemName: string;
	/** Quantidade. */
	Quantity: number | null;
	/** Unidade de medida (ex: "un", "kg"). */
	MeasureUnit: string;
	/** Se o item é fracionável. */
	CanFractionate: boolean;
	/** Preço unitário do item. */
	UnitPrice: number | null;
	/** Subtotal: UnitPrice × Quantity. */
	SubTotal: number;
	/** Se o item foi estornado. */
	IsReversed: boolean;
}

/**
 * Movimento de consumo de uma conta.
 */
export interface MovementResult {
	/** Identificador da conta de consumo. */
	AccountNumber: number;
	/**
	 * Identificador do movimento. Opcional — movimentos de integração
	 * externa não possuem número até o pagamento ser realizado.
	 */
	MovementNumber: number | null;
	/** Identificador único do movimento. */
	MovementUID: string;
	/** Nome do ponto de venda. Opcional. */
	Shop: string | null;
	/** Tipo do movimento. */
	Type: AccountMovementType;
	/** Origem do movimento. */
	Origin: AccountMovementOrigin;
	/** Descrição do movimento. */
	Description: string;
	/** Data e hora do movimento. Opcional. */
	DateTime: string | null;
	/** Valor total do movimento. */
	Value: number;
	/** Número do ponto de venda. */
	PosNumber: number;
	/** Tipo do ponto de venda. */
	PosType: string | null;
	/** Nome do operador que realizou o movimento. */
	Operator: string | null;
	/** Se o movimento foi estornado. */
	IsReversed: boolean;
	/**
	 * Itens consumidos. Somente o tipo `Movement` possui detalhes.
	 */
	Details: MovementDetailResult[] | null;
}

// ─── Request ──────────────────────────────────────────────────────────────────

export interface LoadMovementsData {
	CloudAccountEid: number;
	AccountNumber: number;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export interface LoadMovementsResult {
	/** Saldo dos movimentos anteriores aos últimos 30 dias. */
	PreviousBalance: number;
	/** Movimentos dos últimos 30 dias. */
	Movements: MovementResult[];
}

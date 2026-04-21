import type { MovementResult } from "@/types/movements";

export interface MovementGroup {
	/** Chave da data no formato "YYYY-MM-DD" para identificação única do grupo. */
	dateKey: string;
	/** Rótulo exibido ao usuário: "Hoje", "Ontem" ou "18 de abril". */
	label: string;
	/** Movimentos pertencentes a este grupo, na ordem original da API. */
	movements: MovementResult[];
}

/**
 * Formata uma data como rótulo amigável.
 * - Mesmo dia de hoje → "Hoje"
 * - Dia anterior → "Ontem"
 * - Outros → "18 de abril" ou "18 de abril de 2024" (se ano diferente)
 */
function formatDateLabel(date: Date, today: Date): string {
	const todayKey = toDateKey(today);
	const dateKey = toDateKey(date);

	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	const yesterdayKey = toDateKey(yesterday);

	if (dateKey === todayKey) return "Hoje";
	if (dateKey === yesterdayKey) return "Ontem";

	const sameYear = date.getFullYear() === today.getFullYear();
	return date.toLocaleDateString("pt-BR", {
		day: "numeric",
		month: "long",
		...(sameYear ? {} : { year: "numeric" }),
	});
}

/**
 * Converte uma Date para chave "YYYY-MM-DD" em hora local.
 */
function toDateKey(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

/**
 * Formata a hora de um movimento para exibição (HH:mm).
 * Retorna null se o movimento não possui DateTime.
 */
export function formatMovementTime(dateTime: string | null): string | null {
	if (!dateTime) return null;
	const date = new Date(dateTime);
	return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Agrupa uma lista de movimentos por data (hora local), do mais recente
 * para o mais antigo. Movimentos sem DateTime ficam no grupo "Sem data"
 * ao final da lista.
 */
export function groupMovementsByDate(movements: MovementResult[]): MovementGroup[] {
	const today = new Date();
	const map = new Map<string, MovementGroup>();
	const undatedKey = "__undated__";

	for (const movement of movements) {
		if (!movement.DateTime) {
			if (!map.has(undatedKey)) {
				map.set(undatedKey, {
					dateKey: undatedKey,
					label: "Sem data",
					movements: [],
				});
			}
			map.get(undatedKey)!.movements.push(movement);
			continue;
		}

		const date = new Date(movement.DateTime);
		const key = toDateKey(date);

		if (!map.has(key)) {
			map.set(key, {
				dateKey: key,
				label: formatDateLabel(date, today),
				movements: [],
			});
		}
		map.get(key)!.movements.push(movement);
	}

	// Ordena os grupos: datas reais do mais recente para o mais antigo;
	// o grupo "Sem data" vai ao final.
	return [...map.values()].sort((a, b) => {
		if (a.dateKey === undatedKey) return 1;
		if (b.dateKey === undatedKey) return -1;
		return b.dateKey.localeCompare(a.dateKey);
	});
}

/**
 * Retorna o rótulo legível para o tipo/origem de um movimento.
 * Usado como título na linha do movimento.
 */
export function getMovementLabel(movement: MovementResult): string {
	// Prioriza a descrição da API quando disponível e informativa
	if (movement.Shop) return movement.Shop;
	return movement.Description;
}

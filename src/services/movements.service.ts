/**
 * Service de movimentos de consumo.
 *
 * Consulta os movimentos dos últimos 30 dias de uma conta de consumo.
 * O saldo dos movimentos anteriores a 30 dias é retornado como PreviousBalance.
 */

import type { LoadMovementsData, LoadMovementsResult } from "@/types/movements";
import { getDefaultHeaders, parseJsonResponse } from "@/lib/http";

const API_URL = import.meta.env.VITE_API_URL as string;
const CONSUMPTION_PATH = import.meta.env.VITE_CONSUMPTION_PATH as string;

export async function fetchLoadMovements(
	data: LoadMovementsData,
): Promise<LoadMovementsResult> {
	const url = `${API_URL}/${CONSUMPTION_PATH}/loadMovements`;

	const response = await fetch(url, {
		method: "POST",
		headers: getDefaultHeaders(),
		body: JSON.stringify(data),
	});

	const body = await parseJsonResponse(response);

	if (!response.ok) {
		throw new Error(
			`loadMovements failed: ${response.status} ${JSON.stringify(body)}`,
		);
	}

	return body as LoadMovementsResult;
}

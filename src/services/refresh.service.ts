/**
 * Service de consumo — carrega as contas vinculadas ao usuário autenticado.
 */

import type { RefreshData, RefreshResult } from "@/types/refresh";
import { getDefaultHeaders, parseJsonResponse } from "@/lib/http";

const API_URL = import.meta.env.VITE_API_URL as string;
const CONSUMPTION_PATH = import.meta.env.VITE_CONSUMPTION_PATH as string;

export async function fetchRefresh(data: RefreshData): Promise<RefreshResult> {
	const url = `${API_URL}/${CONSUMPTION_PATH}/refresh`;

	const response = await fetch(url, {
		method: "POST",
		headers: getDefaultHeaders(),
		body: JSON.stringify(data),
	});

	const body = await parseJsonResponse(response);

	if (!response.ok) {
		throw new Error(`refresh failed: ${response.status} ${JSON.stringify(body)}`);
	}

	return body as RefreshResult;
}

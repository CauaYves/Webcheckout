/**
 * Service de autenticação.
 *
 * Encapsula a chamada ao endpoint de login, separando a lógica de
 * comunicação com a API do componente de UI.
 */

import type { Session } from "@/stores/auth.store";
import { getDefaultHeaders, parseJsonResponse } from "@/lib/http";

const API_URL = import.meta.env.VITE_API_URL as string;
const ACCOUNT_PATH = import.meta.env.VITE_ACCOUNT_PATH as string;

export interface LoginPayload {
	credential: string;
	senha: string;
}

/** Forma dos dados retornados pela API de login (campos relevantes). */
export interface LoginApiResponse {
	LoginMode: number;
	Titles: Session["Titles"];
	CloudAccountEid: number;
	Name: string;
	Document: string;
}

/**
 * Realiza o login do usuário na API.
 *
 * @throws {Error} Quando a resposta HTTP não é bem-sucedida (4xx / 5xx).
 */
export async function loginUser(payload: LoginPayload): Promise<LoginApiResponse> {
	const url = `${API_URL}/${ACCOUNT_PATH}/login`;

	const response = await fetch(url, {
		method: "POST",
		headers: getDefaultHeaders(),
		body: JSON.stringify({
			Credential: payload.credential,
			Password: payload.senha,
		}),
	});

	const body = await parseJsonResponse(response);

	if (!response.ok) {
		throw new Error(`login failed: ${response.status}`);
	}

	return body as LoginApiResponse;
}

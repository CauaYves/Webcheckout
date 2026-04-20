/**
 * Utilitários para requisições HTTP.
 *
 * Centraliza a lógica de parse de respostas e montagem de headers
 * padrão para evitar duplicação entre os services.
 */

const AUTH_KEY = import.meta.env.VITE_AUTH_KEY as string;

/**
 * Retorna os headers padrão usados em todas as requisições à API.
 */
export function getDefaultHeaders(): HeadersInit {
	return {
		"Content-Type": "application/json",
		_AuthenticationKey: AUTH_KEY,
	};
}

/**
 * Faz o parse do corpo de uma resposta HTTP de forma segura.
 * Tenta JSON primeiro; se falhar, retorna o texto bruto.
 */
export async function parseJsonResponse(response: Response): Promise<unknown> {
	const text = await response.text();
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

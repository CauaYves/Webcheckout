import type { RefreshData, RefreshResult } from "@/types/refresh";

const API_URL = import.meta.env.VITE_API_URL as string;
const CONSUMPTION_PATH = import.meta.env.VITE_CONSUMPTION_PATH as string;
const AUTH_KEY = import.meta.env.VITE_AUTH_KEY as string;

export async function fetchRefresh(data: RefreshData): Promise<RefreshResult> {
	const url = `${API_URL}/${CONSUMPTION_PATH}/refresh`;

	console.group("[refresh] POST", url);
	console.log("body:", data);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			_AuthenticationKey: AUTH_KEY,
		},
		body: JSON.stringify(data),
	});

	const responseText = await response.text();
	let responseBody: unknown;
	try {
		responseBody = JSON.parse(responseText);
	} catch {
		responseBody = responseText;
	}

	console.log("status:", response.status);
	console.log("response:", responseBody);
	console.groupEnd();

	if (!response.ok) {
		throw new Error(
			`refresh failed: ${response.status} ${JSON.stringify(responseBody)}`,
		);
	}

	return responseBody as RefreshResult;
}

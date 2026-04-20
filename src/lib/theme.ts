/**
 * Utilitário de tema por cliente.
 *
 * O CSS do cliente fica em /public/themes/:client.css e é carregado via
 * fetch() em runtime. O conteúdo é injetado numa <style> tag no <head>,
 * sobrescrevendo os CSS custom properties do :root padrão do tailwind.css.
 *
 * Se o arquivo de tema não existir, o fallback é o tema default (silencioso
 * para o usuário, erro registrado no console).
 */

const STYLE_TAG_ID = "client-theme";

function injectStyleTag(css: string): void {
	let el = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
	if (!el) {
		el = document.createElement("style");
		el.id = STYLE_TAG_ID;
		document.head.appendChild(el);
	}
	el.textContent = css;
}

function removeStyleTag(): void {
	const el = document.getElementById(STYLE_TAG_ID);
	if (el) el.remove();
}

/**
 * Carrega e aplica o tema CSS do cliente informado.
 *
 * @param client - Nome do cliente (ex: "flamengo"). Deve corresponder a um
 *                 arquivo em /public/themes/:client.css.
 *
 * Em caso de falha (404 ou erro de rede), o tema default do tailwind.css é
 * mantido e o erro é registrado no console.
 */
export async function applyClientTheme(client: string): Promise<void> {
	const url = `/themes/${client.toLowerCase()}.css`;
	try {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ao buscar tema: ${url}`);
		}
		const css = await res.text();
		injectStyleTag(css);
	} catch (err) {
		console.error(
			`[WebCheckout] Tema para "${client}" não encontrado em ${url}. Usando tema default.`,
			err,
		);
		// Remove qualquer tema anterior para garantir o default limpo
		removeStyleTag();
	}
}

/**
 * Remove o tema do cliente atual, restaurando o tema default.
 * Chamado quando o usuário sai do fluxo de checkout.
 */
export function clearClientTheme(): void {
	removeStyleTag();
}

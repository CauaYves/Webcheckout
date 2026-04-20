import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LoginTitle {
	Id: number;
	TitleType: string;
	Code: string;
}

/**
 * Dados da sessão do usuário autenticado.
 *
 * Campos vindos diretamente da resposta da API de login (PascalCase):
 *   LoginMode, Titles, CloudAccountEid, Name, Document
 *
 * Campos adicionados pelo cliente para controle de sessão (camelCase):
 *   Email    — credencial usada no login (pode ser e-mail ou código)
 *   origin   — slug do cliente (ex: "flamengo") usado para validar a sessão por rota
 */
export interface Session {
	// Campos da API
	LoginMode: number;
	Titles: LoginTitle[];
	CloudAccountEid: number;
	Name: string;
	Document: string;
	// Campos locais
	Email: string;
	origin: string;
}

interface AuthState {
	session: Session | null;
	setSession: (session: Session) => void;
	clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			session: null,
			setSession: (session) => set({ session }),
			clearSession: () => set({ session: null }),
		}),
		{
			name: "auth-session",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

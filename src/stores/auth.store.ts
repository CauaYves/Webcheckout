import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LoginTitle {
	Id: number;
	TitleType: string;
	Code: string;
}

export interface Session {
	// Campos retornados pela API
	LoginMode: number;
	Titles: LoginTitle[];
	CloudAccountEid: number;
	Name: string;
	Document: string;
	// Campos artificiais do token
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

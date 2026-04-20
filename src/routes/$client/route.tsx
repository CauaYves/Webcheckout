import { applyClientTheme } from "@/lib/theme";
import { useAuthStore } from "@/stores/auth.store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$client")({
	beforeLoad: ({ params, location }) => {
		const isLoginPage = location.pathname.endsWith("/entrar");
		if (isLoginPage) return;

		const session = useAuthStore.getState().session;

		if (!session || session.origin !== params.client) {
			useAuthStore.getState().clearSession();
			throw redirect({ to: "/$client/entrar", params: { client: params.client } });
		}
	},
	loader: async ({ params }) => {
		await applyClientTheme(params.client);
	},
	component: ClientLayout,
});

function ClientLayout() {
	return <Outlet />;
}

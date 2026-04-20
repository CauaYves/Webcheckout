import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	return (
		<div className="mx-auto min-h-svh w-full max-w-[578px] bg-background">
			<Outlet />
			<Toaster />
		</div>
	);
}

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
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

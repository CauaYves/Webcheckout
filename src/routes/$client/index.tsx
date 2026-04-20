import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$client/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center px-6">
			<h1 className="text-2xl font-bold text-foreground">Página inicial</h1>
		</div>
	);
}

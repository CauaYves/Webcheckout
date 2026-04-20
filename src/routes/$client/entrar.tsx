import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/$client/entrar")({
	beforeLoad: ({ params }) => {
		const session = useAuthStore.getState().session;
		if (session?.origin === params.client) {
			throw redirect({ to: "/$client", params: { client: params.client } });
		}
	},
	component: EntrarPage,
});

const API_URL = import.meta.env.VITE_API_URL as string;
const ACCOUNT_PATH = import.meta.env.VITE_ACCOUNT_PATH as string;
const AUTH_KEY = import.meta.env.VITE_AUTH_KEY as string;

const schema = z.object({
	credential: z.string().min(1, "Credencial obrigatória"),
	senha: z.string().min(1, "Senha obrigatória"),
});

type FormValues = z.infer<typeof schema>;

function EntrarPage() {
	const { client } = Route.useParams();
	const navigate = useNavigate();
	const setSession = useAuthStore((s) => s.setSession);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	async function onSubmit(data: FormValues) {
		const url = `${API_URL}/${ACCOUNT_PATH}/login`;
		const body = { Credential: data.credential, Password: data.senha };

		console.group("[login] POST", url);
		console.log("body:", body);

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					_AuthenticationKey: AUTH_KEY,
				},
				body: JSON.stringify(body),
			});

			let responseBody: unknown;
			try {
				responseBody = await response.json();
			} catch {
				responseBody = await response.text();
			}

			console.log("status:", response.status);
			console.log("response:", responseBody);
			console.groupEnd();

			if (!response.ok) {
				toast.error("Credencial ou senha inválidos.");
				return;
			}

			setSession({
				...(responseBody as Omit<Parameters<typeof setSession>[0], "Email" | "origin">),
				Email: data.credential,
				origin: client,
			});

			void navigate({ to: "/$client", params: { client } });
		} catch (err) {
			console.error("network error:", err);
			console.groupEnd();
			toast.error("Não foi possível conectar ao servidor. Tente novamente.");
		}
	}

	return (
		<div className="relative flex min-h-svh flex-col px-6">
			{/* Conteúdo principal */}
			<div className="flex flex-1 flex-col pt-16">
				{/* Logo */}
				<div className="mb-8 flex items-center justify-center gap-2">
					<img
						src={`/images/${client.toLowerCase()}/logo-light.svg`}
						alt={client}
						className="h-8 w-auto"
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = "none";
						}}
					/>
				</div>

				{/* Título */}
				<h1 className="mb-8 text-2xl font-bold text-foreground">
					Acesse os seus gastos
				</h1>

				{/* Formulário */}
				<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
					{/* Credencial */}
					<div className="space-y-1.5">
						<Label htmlFor="credential">E-mail ou código do título</Label>
						<Input
							id="credential"
							type="text"
							placeholder="Digite seu e-mail ou código do título"
							autoComplete="username"
							aria-invalid={!!errors.credential}
							{...register("credential")}
						/>
						{errors.credential && (
							<p className="text-xs text-destructive">{errors.credential.message}</p>
						)}
					</div>

					{/* Senha */}
					<div className="space-y-1.5">
						<Label htmlFor="senha">Senha</Label>
						<div className="relative">
							<Input
								id="senha"
								type={showPassword ? "text" : "password"}
								placeholder="Digite sua senha"
								autoComplete="current-password"
								className="pr-10"
								aria-invalid={!!errors.senha}
								{...register("senha")}
							/>
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)}
								className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
								tabIndex={-1}
								aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
							>
								{showPassword ? (
									<EyeOff className="size-4" />
								) : (
									<Eye className="size-4" />
								)}
							</button>
						</div>
						{errors.senha && (
							<p className="text-xs text-destructive">{errors.senha.message}</p>
						)}
					</div>

					{/* Esqueci a senha */}
					<button
						type="button"
						className="text-sm font-medium text-primary underline-offset-4 hover:underline"
					>
						Esqueci a senha
					</button>

					{/* Botão de submit */}
					<Button
						type="submit"
						size="lg"
						className="w-full rounded-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Acessando..." : "Acessar conta"}
					</Button>
				</form>
			</div>

			{/* Rodapé */}
			<div className="py-8 text-center text-sm text-muted-foreground">
				Não tem uma conta?{" "}
				<button
					type="button"
					className="font-medium text-primary underline-offset-4 hover:underline"
				>
					Criar conta
				</button>
			</div>
		</div>
	);
}

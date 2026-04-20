import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { loginUser } from "@/services/auth.service";

export const Route = createFileRoute("/$client/entrar")({
	beforeLoad: ({ params }) => {
		const session = useAuthStore.getState().session;
		if (session?.origin === params.client) {
			throw redirect({ to: "/$client", params: { client: params.client } });
		}
	},
	component: EntrarPage,
});

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
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	const loginMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (result, variables) => {
			setSession({
				...result,
				Email: variables.credential,
				origin: client,
			});
			void navigate({ to: "/$client", params: { client } });
		},
		onError: () => {
			toast.error("Credencial ou senha inválidos.");
		},
	});

	return (
		<div className="relative flex min-h-svh flex-col px-6">
			{/* Conteúdo principal */}
			<div className="flex flex-1 flex-col pt-16">
				{/* Logo */}
				<div className="mb-8 flex items-center justify-center gap-2">
					<img
						src={`/images/${client.toLowerCase()}/logo-light.svg`}
						alt={`Logo ${client}`}
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
				<form
					onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
					noValidate
					className="space-y-5"
				>
					{/* Credencial */}
					<div className="space-y-1.5">
						<Label htmlFor="credential">E-mail ou código do título</Label>
						<Input
							id="credential"
							type="text"
							inputMode="email"
							placeholder="Digite seu e-mail ou código do título"
							autoComplete="username"
							autoCapitalize="none"
							spellCheck={false}
							aria-invalid={!!errors.credential}
							aria-describedby={errors.credential ? "credential-error" : undefined}
							{...register("credential")}
						/>
						{errors.credential && (
							<p id="credential-error" role="alert" className="text-xs text-destructive">
								{errors.credential.message}
							</p>
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
								aria-describedby={errors.senha ? "senha-error" : undefined}
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
									<EyeOff className="size-4" aria-hidden="true" />
								) : (
									<Eye className="size-4" aria-hidden="true" />
								)}
							</button>
						</div>
						{errors.senha && (
							<p id="senha-error" role="alert" className="text-xs text-destructive">
								{errors.senha.message}
							</p>
						)}
					</div>

					{/* Esqueci a senha */}
					<button
						type="button"
						disabled
						aria-disabled="true"
						className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
					>
						Esqueci a senha
					</button>

					{/* Botão de submit */}
					<Button
						type="submit"
						size="lg"
						className="w-full rounded-full"
						disabled={loginMutation.isPending}
						aria-busy={loginMutation.isPending}
					>
						{loginMutation.isPending ? "Acessando..." : "Acessar conta"}
					</Button>
				</form>
			</div>

			{/* Rodapé */}
			<div className="py-8 text-center text-sm text-muted-foreground">
				Não tem uma conta?{" "}
				<button
					type="button"
					disabled
					aria-disabled="true"
					className="font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
				>
					Criar conta
				</button>
			</div>
		</div>
	);
}

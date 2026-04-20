import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			/**
			 * Dados são considerados frescos por 30s.
			 * Durante esse período, useQuery retorna o cache sem refetch.
			 */
			staleTime: 30 * 1000,
			/**
			 * 1 retry automático em falha de rede antes de lançar erro.
			 * Evita erros imediatos por instabilidade momentânea.
			 */
			retry: 1,
			/**
			 * Refetch automático ao usuário voltar para a aba.
			 * Garante dados atualizados após o app ficar em background.
			 */
			refetchOnWindowFocus: true,
		},
	},
});

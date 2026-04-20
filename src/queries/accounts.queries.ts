import { queryOptions } from "@tanstack/react-query";
import { fetchRefresh } from "@/services/refresh.service";

/**
 * Query options para carregar as contas de consumo do usuário.
 *
 * Usar `queryOptions()` garante que o mesmo objeto (queryKey + queryFn)
 * seja compartilhado entre o loader da rota (prefetch via ensureQueryData)
 * e o componente (useQuery), sem duplicação e com type-safety completo.
 *
 * queryKey: ['accounts', cloudAccountEid]
 * — O cloudAccountEid isola o cache por usuário, evitando vazamento
 *   de dados entre sessões distintas.
 */
export const accountsQueryOptions = (cloudAccountEid: number) =>
	queryOptions({
		queryKey: ["accounts", cloudAccountEid],
		queryFn: () => fetchRefresh({ CloudAccountEid: cloudAccountEid }),
	});

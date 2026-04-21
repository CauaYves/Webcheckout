import { queryOptions } from "@tanstack/react-query";
import { fetchLoadMovements } from "@/services/movements.service";

/**
 * Query options para os movimentos de consumo de uma conta específica.
 *
 * queryKey: ['movements', cloudAccountEid, accountNumber]
 * — Isola o cache por usuário e por conta, evitando colisão entre
 *   contas distintas ou sessões de usuários diferentes.
 */
export const movementsQueryOptions = (
	cloudAccountEid: number,
	accountNumber: number,
) =>
	queryOptions({
		queryKey: ["movements", cloudAccountEid, accountNumber],
		queryFn: () =>
			fetchLoadMovements({ CloudAccountEid: cloudAccountEid, AccountNumber: accountNumber }),
	});

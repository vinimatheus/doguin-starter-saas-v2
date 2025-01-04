import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // Retornar nulo enquanto a sessão carrega
  }

  return session?.user || null; // Retornar o usuário ou null se não autenticado
};

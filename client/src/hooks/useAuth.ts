import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: true, // Refresh auth when tab becomes visible
    refetchInterval: 10 * 60 * 1000, // Silently refresh every 10 minutes
    refetchIntervalInBackground: false, // Only refresh when tab is visible
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch,
  };
}

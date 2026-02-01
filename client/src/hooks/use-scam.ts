import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { CheckScamRequest, ScamCheckResponse } from "@shared/schema";

export function useScamCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CheckScamRequest): Promise<ScamCheckResponse> => {
      const res = await fetch(api.scam.check.path, {
        method: api.scam.check.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error('Scam check failed');
      }
      
      const response = api.scam.check.responses[200].parse(await res.json());
      return response;
    },
    // Invalidate stats and conversations after a check (since it likely updates them)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.conversations.list.path] });
    }
  });
}

export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return api.stats.get.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Live stats update
  });
}

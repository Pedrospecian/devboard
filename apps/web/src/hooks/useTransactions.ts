import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface FormState {
  title: string;
  amount: string;
  type: string;
  category: string;
  date: string;
}

// Chaves de cache centralizadas — evita strings duplicadas em vários arquivos
export const transactionKeys = {
  all: ["transactions"] as const,
  summary: ["transactions", "summary"] as const,
  chart: ["transactions", "chart"] as const,
};

export function useSummary() {
  return useQuery({
    queryKey: transactionKeys.summary,
    queryFn: () => api.get("/transactions/summary").then((r) => r.data),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: () => api.get("/transactions").then((r) => r.data),
  });
}

export function useMonthlyChart() {
  return useQuery({
    queryKey: transactionKeys.chart,
    queryFn: () => api.get("/transactions/chart").then((r) => r.data),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: FormState) =>
      api.post("/transactions", {
        title: form.title,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: new Date(form.date).toISOString(),
      }),
    // Invalida o cache após criar — React Query refaz os fetches automaticamente
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary });
      queryClient.invalidateQueries({ queryKey: transactionKeys.chart });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary });
      queryClient.invalidateQueries({ queryKey: transactionKeys.chart });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface FormState {
  title: string;
  amount: string;
  type: string;
  category: string;
  date: string;
}

interface TransactionFilters {
  month?: string;
  category?: string;
}

export const transactionKeys = {
  all: (filters?: TransactionFilters) => ["transactions", filters] as const,
  summary: ["transactions", "summary"] as const,
  chart: ["transactions", "chart"] as const,
  categories: ["transactions", "categories"] as const,
};

export function useSummary() {
  return useQuery({
    queryKey: transactionKeys.summary,
    queryFn: () => api.get("/transactions/summary").then((r) => r.data),
  });
}

export function useTransactions(filters: TransactionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.month) params.set("month", filters.month);
  if (filters.category) params.set("category", filters.category);
  const query = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: transactionKeys.all(filters),
    queryFn: () => api.get(`/transactions${query}`).then((r) => r.data),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: transactionKeys.categories,
    queryFn: () => api.get("/transactions/categories").then((r) => r.data as string[]),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
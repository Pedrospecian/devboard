import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from "@/hooks/useTransactions";
import { api } from "@/lib/api";

// Mocka o client axios inteiro — os hooks não devem fazer chamadas de rede reais
vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useTransactions hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useTransactions retorna a lista vinda da API", async () => {
    const mockData = [{ id: "1", title: "Salário", amount: 5000 }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith("/transactions");
    expect(result.current.data).toEqual(mockData);
  });

  it("useCreateTransaction envia os dados formatados corretamente para a API", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: "2" } });

    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Groceries",
      amount: "150.9",
      type: "EXPENSE",
      category: "Food",
      date: "2026-07-08",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/transactions", {
      title: "Groceries",
      amount: 150.9,
      type: "EXPENSE",
      category: "Food",
      date: new Date("2026-07-08").toISOString(),
    });
  });

  it("useDeleteTransaction chama DELETE com o id correto", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useDeleteTransaction(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("42");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.delete).toHaveBeenCalledWith("/transactions/42");
  });
});

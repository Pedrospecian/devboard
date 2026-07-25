import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/auth.store";

const initialState = useAuthStore.getState();

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState(initialState, true);
    localStorage.clear();
  });

  it("começa sem usuário autenticado", () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("setAuth armazena usuário, token e persiste no localStorage", () => {
    const user = { id: "1", name: "Ana", email: "ana@example.com" };

    useAuthStore.getState().setAuth(user, "access-123", "refresh-456");

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().accessToken).toBe("access-123");
    expect(localStorage.getItem("accessToken")).toBe("access-123");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-456");
  });

  it("logout limpa o estado e o localStorage", () => {
    const user = { id: "1", name: "Ana", email: "ana@example.com" };
    useAuthStore.getState().setAuth(user, "access-123", "refresh-456");

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });
});

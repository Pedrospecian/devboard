import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "@/store/theme.store";

const initialState = useThemeStore.getState();

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState(initialState, true);
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("começa no tema light", () => {
    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("toggle alterna de light para dark", () => {
    useThemeStore.getState().toggle();

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("toggle alterna de volta para light na segunda chamada", () => {
    useThemeStore.getState().toggle();
    useThemeStore.getState().toggle();

    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});

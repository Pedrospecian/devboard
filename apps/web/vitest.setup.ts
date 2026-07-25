import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Garante que cada teste começa com o DOM limpo — evita vazamento entre testes
afterEach(() => {
  cleanup();
});

// Garante que config/env.ts (validado com Zod) encontre valores válidos
// antes de qualquer módulo da aplicação ser importado pelos testes.
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/devboard_test";
process.env.JWT_SECRET ??= "test-jwt-secret-with-at-least-32-characters";
process.env.JWT_REFRESH_SECRET ??= "test-jwt-refresh-secret-with-32-characters";
process.env.PORT ??= "3001";
process.env.NODE_ENV = "test";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import "dotenv/config";
import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${env.PORT}`);
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schemas",
  out: "./migrations",
  dialect: "sqlite",
  casing: "snake_case",
  driver: "d1-http",
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
    driver: "turso",
    dbCredentials: {
        url: process.env.DB_URL!,
        authToken: process.env.DB_TOKEN!,
    },
    schema: "./src/schema.ts",
    out: "./drizzle",
});
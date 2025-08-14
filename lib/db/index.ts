import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";

// const client = postgres("postgres://postgres:uww4KBAG6TjQE4nhHKfa@bagapp-dev.cbq2ce06uwra.eu-west-2.rds.amazonaws.com:5432/dev?sslmode=no-verify");
const client = postgres(env.DATABASE_URL,{
     ssl: {
      rejectUnauthorized: false,
    },
});
export const db = drizzle(client);


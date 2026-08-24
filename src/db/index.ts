import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzleDb?: ReturnType<typeof drizzle>;
};

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  return databaseUrl;
}

let poolInstance: Pool | undefined;

function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: getDatabaseUrl(),
    });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = poolInstance;
    }
  }

  return poolInstance;
}

function getDb() {
  if (!globalForDb.__arenaNextJsDrizzleDb) {
    globalForDb.__arenaNextJsDrizzleDb = drizzle({ client: getPool() });
  }

  return globalForDb.__arenaNextJsDrizzleDb;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const poolRef = getPool();
    const value = Reflect.get(poolRef as object, prop, receiver);
    return typeof value === "function" ? value.bind(poolRef) : value;
  },
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop, receiver) {
    const dbRef = getDb();
    const value = Reflect.get(dbRef as object, prop, receiver);
    return typeof value === "function" ? value.bind(dbRef) : value;
  },
});

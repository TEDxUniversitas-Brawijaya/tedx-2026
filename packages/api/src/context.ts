import type { D1Database } from "@tedx-2026/db";
// import { createDB } from "@tedx-2026/db";
import type {
  // createKV,
  KVNamespaceType,
} from "@tedx-2026/kv";
import type { LoggerType } from "@tedx-2026/logger";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

type CreateContextOptions = {
  env: {
    db: D1Database;
    kv: KVNamespaceType;
  };
  fetchCreateContextFnOptions: FetchCreateContextFnOptions;
  logger: LoggerType;
  requestId: string;
  waitUntil: (promise: Promise<unknown>) => void;
};

export const createContext = ({
  // env,
  logger,
  requestId,
  waitUntil,
}: CreateContextOptions): Context => {
  // const baseContext = {
  //   requestId,
  //   waitUntil,
  // };

  // const db = createDB(env.db);
  // const kv = createKV(env.kv);

  return {
    requestId,
    logger,
    waitUntil,
  };
};

export type Context = {
  requestId: string;
  logger: LoggerType;
  // services: {};
  // operations: {};
  waitUntil: (promise: Promise<unknown>) => void;
};

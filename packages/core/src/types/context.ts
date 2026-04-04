import type { LoggerType } from "@tedx-2026/logger";

export type BaseContext = {
  /**
   * This will be extends the lifetime of your Worker, allowing you to perform
   * work without blocking returning a response, and that may continue after a response is returned.
   * It accepts a Promise, which the Workers runtime will continue executing, even after a response has
   * been returned by the Worker's handler.
   */
  waitUntil: (promise: Promise<unknown>) => void;
  logger: LoggerType;
  requestId: string;
};

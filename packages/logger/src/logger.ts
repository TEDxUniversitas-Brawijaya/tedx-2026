export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = Record<string, unknown>;

export type LoggerType = {
  debug: (message: string, fields?: LogFields) => void;
  info: (message: string, fields?: LogFields) => void;
  warn: (message: string, fields?: LogFields) => void;
  error: (message: string, fields?: LogFields) => void;
  child: (fields: LogFields) => Logger;
};

export class Logger implements LoggerType {
  private readonly boundFields: LogFields;

  constructor(boundFields: LogFields = {}) {
    this.boundFields = boundFields;
  }

  debug(message: string, fields?: LogFields): void {
    this.log("debug", message, fields);
  }

  info(message: string, fields?: LogFields): void {
    this.log("info", message, fields);
  }

  warn(message: string, fields?: LogFields): void {
    this.log("warn", message, fields);
  }

  error(message: string, fields?: LogFields): void {
    this.log("error", message, fields);
  }

  child(fields: LogFields): Logger {
    return new Logger({
      ...this.boundFields,
      ...fields,
    });
  }

  private log(level: LogLevel, message: string, fields?: LogFields): void {
    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...normalizeLogFields(this.boundFields),
      ...normalizeLogFields(fields),
    };

    const logString = JSON.stringify(logEntry);

    switch (level) {
      case "debug":
        console.debug(logString);
        break;
      case "info":
        console.info(logString);
        break;
      case "warn":
        console.warn(logString);
        break;
      case "error":
        console.error(logString);
        break;
      default:
        console.log(logString);
    }
  }
}

export const createLogger = (fields?: LogFields): Logger => new Logger(fields);

const SENSITIVE_KEY = [
  "password",
  "apiKey",
  "token",
  "secret",
  "credential",
  "auth",
  "key",
  "api_key",
  "access_token",
  "refresh_token",
  "client_id",
  "client_secret",
  "Auth",
  "authorization",
];

function normalizeLogFields(fields?: LogFields): LogFields {
  const normalizedFields: LogFields = {};
  if (!fields) {
    return normalizedFields;
  }

  for (const key in fields) {
    if (
      SENSITIVE_KEY.some((sensitiveKey) => key.includes(sensitiveKey)) &&
      typeof fields[key] === "string"
    ) {
      normalizedFields[key] = "REDACTED";
    } else {
      normalizedFields[key] = fields[key];
    }
  }

  return normalizedFields;
}

export const ErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export type ErrorMetadata = {
  requestId?: string;
  userId?: string;
  timestamp: string;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;
  readonly metadata: ErrorMetadata;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      details?: Record<string, unknown>;
      metadata?: Partial<ErrorMetadata>;
      cause?: Error;
    }
  ) {
    super(message, { cause: options?.cause });

    this.code = code;
    this.details = options?.details;
    this.metadata = {
      timestamp: new Date().toISOString(),
      ...options?.metadata,
    };
  }
}

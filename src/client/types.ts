import type { ApiClass } from "../resources/shared.ts";

export type ImgwireLogger = {
  debug?: (message: string, context?: Record<string, unknown>) => void;
  info?: (message: string, context?: Record<string, unknown>) => void;
  warn?: (message: string, context?: Record<string, unknown>) => void;
  error?: (message: string, context?: Record<string, unknown>) => void;
};

export type RetryOptions = {
  maxRetries?: number;
  retryDelayMs?: number;
};

export type ImgwireClientOptions = RetryOptions & {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  logger?: ImgwireLogger;
  timeoutMs?: number;
};

export type ResourceConstructorMap = Record<string, ApiClass>;

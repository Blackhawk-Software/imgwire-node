import { HttpError } from "../../generated/api/apis.ts";
import type { RetryOptions } from "../client/types.ts";

export async function withRetry<T>(
  operationName: string,
  action: () => Promise<T>,
  options: RetryOptions = {},
  hooks?: {
    onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
  }
): Promise<T> {
  const maxRetries = options.maxRetries ?? 0;
  const retryDelayMs = options.retryDelayMs ?? 250;

  let attempt = 0;
  for (;;) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= maxRetries || !isRetryableError(error)) {
        throw error;
      }

      attempt += 1;
      const delayMs = retryDelayMs * attempt;
      hooks?.onRetry?.(attempt, error, delayMs);
      await sleep(delayMs);
    }
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof HttpError) {
    const statusCode = error.statusCode ?? error.response.statusCode ?? 0;
    return statusCode === 408 || statusCode === 429 || statusCode >= 500;
  }

  if (error instanceof Error) {
    return Boolean(
      "code" in error &&
        typeof (error as { code?: unknown }).code === "string" &&
        ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND"].includes(
          (error as { code: string }).code
        )
    );
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

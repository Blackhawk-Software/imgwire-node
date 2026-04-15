import type http from "node:http";

import type { RetryOptions, ImgwireLogger } from "../client/types.ts";
import {
  toPaginatedResult,
  type PaginatedResult
} from "../pagination/index.ts";
import { withRetry } from "../http/retry.ts";

export type ApiClass = new (basePath?: string) => {
  defaultHeaders: Record<string, string>;
};

export type ResourceContext = RetryOptions & {
  logger?: ImgwireLogger;
};

export type GeneratedResponse<T> = Promise<{
  body: T;
  response: http.IncomingMessage;
}>;

export class BaseResource {
  constructor(protected readonly context: ResourceContext) {}

  protected async unwrap<T>(
    operationName: string,
    action: () => GeneratedResponse<T>
  ): Promise<T> {
    return withRetry(
      operationName,
      async () => {
        this.context.logger?.debug?.("imgwire.request", {
          operation: operationName
        });
        const result = await action();
        this.context.logger?.debug?.("imgwire.response", {
          operation: operationName,
          statusCode: result.response.statusCode
        });
        return result.body;
      },
      this.context,
      {
        onRetry: (attempt, error, delayMs) => {
          this.context.logger?.warn?.("imgwire.retry", {
            attempt,
            delayMs,
            error: error instanceof Error ? error.message : String(error),
            operation: operationName
          });
        }
      }
    );
  }

  protected async unwrapPaginated<T>(
    operationName: string,
    action: () => GeneratedResponse<T[]>
  ): Promise<PaginatedResult<T>> {
    return withRetry(
      operationName,
      async () => {
        this.context.logger?.debug?.("imgwire.request", {
          operation: operationName
        });
        const result = await action();
        this.context.logger?.debug?.("imgwire.response", {
          operation: operationName,
          statusCode: result.response.statusCode
        });
        return toPaginatedResult(result.body, result.response.headers);
      },
      this.context
    );
  }
}

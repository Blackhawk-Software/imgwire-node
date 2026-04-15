import type { CorsOriginCreateSchema } from "../../generated/model/corsOriginCreateSchema.ts";
import type { CorsOriginSchema } from "../../generated/model/corsOriginSchema.ts";
import type { CorsOriginUpdateSchema } from "../../generated/model/corsOriginUpdateSchema.ts";
import { CorsOriginsApi } from "../../generated/api/corsOriginsApi.ts";
import type { PaginatedResult } from "../pagination/types.ts";

import { BaseResource, type ResourceContext } from "./shared.ts";

export class CorsOriginsResource extends BaseResource {
  private readonly api: CorsOriginsApi;

  constructor(baseUrl: string, apiKey: string, context: ResourceContext) {
    super(context);
    this.api = new CorsOriginsApi(baseUrl);
    this.api.defaultHeaders = {
      Authorization: `Bearer ${apiKey}`
    };
  }

  create(input: CorsOriginCreateSchema): Promise<CorsOriginSchema> {
    return this.unwrap("corsOrigins.create", () =>
      this.api.corsOriginsCreate(input)
    );
  }

  delete(corsOriginId: string): Promise<Record<string, string | null>> {
    return this.unwrap("corsOrigins.delete", () =>
      this.api.corsOriginsDelete(corsOriginId)
    );
  }

  list(input?: {
    limit?: number;
    page?: number;
  }): Promise<PaginatedResult<CorsOriginSchema>> {
    return this.unwrapPaginated("corsOrigins.list", () =>
      this.api.corsOriginsList(input?.limit, input?.page)
    );
  }

  retrieve(corsOriginId: string): Promise<CorsOriginSchema> {
    return this.unwrap("corsOrigins.retrieve", () =>
      this.api.corsOriginsRetrieve(corsOriginId)
    );
  }

  update(
    corsOriginId: string,
    input: CorsOriginUpdateSchema
  ): Promise<CorsOriginSchema> {
    return this.unwrap("corsOrigins.update", () =>
      this.api.corsOriginsUpdate(corsOriginId, input)
    );
  }
}

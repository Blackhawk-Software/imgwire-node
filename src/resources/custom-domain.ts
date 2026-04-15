import type { CustomDomainCreateSchema } from "../../generated/model/customDomainCreateSchema.ts";
import type { CustomDomainSchema } from "../../generated/model/customDomainSchema.ts";
import { CustomDomainApi } from "../../generated/api/customDomainApi.ts";

import { BaseResource, type ResourceContext } from "./shared.ts";

export class CustomDomainResource extends BaseResource {
  private readonly api: CustomDomainApi;

  constructor(baseUrl: string, apiKey: string, context: ResourceContext) {
    super(context);
    this.api = new CustomDomainApi(baseUrl);
    this.api.defaultHeaders = {
      Authorization: `Bearer ${apiKey}`
    };
  }

  create(input: CustomDomainCreateSchema): Promise<CustomDomainSchema> {
    return this.unwrap("customDomain.create", () =>
      this.api.customDomainCreate(input)
    );
  }

  delete(): Promise<Record<string, string | null>> {
    return this.unwrap("customDomain.delete", () => this.api.customDomainDelete());
  }

  retrieve(): Promise<CustomDomainSchema> {
    return this.unwrap("customDomain.retrieve", () =>
      this.api.customDomainRetrieve()
    );
  }

  testConnection(): Promise<CustomDomainSchema> {
    return this.unwrap("customDomain.testConnection", () =>
      this.api.customDomainTestConnection()
    );
  }
}

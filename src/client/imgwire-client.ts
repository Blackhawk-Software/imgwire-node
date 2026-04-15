import { CorsOriginsResource } from "../resources/cors-origins.ts";
import { CustomDomainResource } from "../resources/custom-domain.ts";
import { ImagesResource } from "../resources/images.ts";
import { MetricsResource } from "../resources/metrics.ts";
import type { ImgwireClientOptions } from "./types.ts";

export class ImgwireClient {
  readonly corsOrigins: CorsOriginsResource;
  readonly customDomain: CustomDomainResource;
  readonly images: ImagesResource;
  readonly metrics: MetricsResource;
  readonly options: ImgwireClientOptions;

  constructor(options: ImgwireClientOptions) {
    this.options = options;

    const baseUrl = options.baseUrl ?? "https://api.imgwire.dev";
    const context = {
      logger: options.logger,
      maxRetries: options.maxRetries,
      retryDelayMs: options.retryDelayMs
    };

    this.corsOrigins = new CorsOriginsResource(
      baseUrl,
      options.apiKey,
      context
    );
    this.customDomain = new CustomDomainResource(
      baseUrl,
      options.apiKey,
      context
    );
    this.images = new ImagesResource(options, baseUrl, options.apiKey, context);
    this.metrics = new MetricsResource(baseUrl, options.apiKey, context);
  }
}

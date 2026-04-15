import { MetricsApi } from "../../generated/api/metricsApi.ts";
import type { MetricsDatasetInterval } from "../../generated/model/metricsDatasetInterval.ts";
import type { MetricsDatasetsSchema } from "../../generated/model/metricsDatasetsSchema.ts";
import type { MetricsStatsSchema } from "../../generated/model/metricsStatsSchema.ts";

import { BaseResource, type ResourceContext } from "./shared.ts";

export type MetricsQuery = {
  dateEnd?: Date;
  dateStart?: Date;
  interval?: MetricsDatasetInterval;
  tz?: string;
};

export class MetricsResource extends BaseResource {
  private readonly api: MetricsApi;

  constructor(baseUrl: string, apiKey: string, context: ResourceContext) {
    super(context);
    this.api = new MetricsApi(baseUrl);
    this.api.defaultHeaders = {
      Authorization: `Bearer ${apiKey}`
    };
  }

  getDatasets(input?: MetricsQuery): Promise<MetricsDatasetsSchema> {
    return this.unwrap("metrics.getDatasets", () =>
      this.api.metricsGetDatasets(
        input?.dateEnd,
        input?.dateStart,
        input?.interval,
        input?.tz
      )
    );
  }

  getStats(input?: MetricsQuery): Promise<MetricsStatsSchema> {
    return this.unwrap("metrics.getStats", () =>
      this.api.metricsGetStats(
        input?.dateEnd,
        input?.dateStart,
        input?.interval,
        input?.tz
      )
    );
  }
}

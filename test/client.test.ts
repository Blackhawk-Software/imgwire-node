import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import fs from "node:fs";
import { Readable } from "node:stream";

import { afterEach, describe, expect, it } from "vitest";

import { ImgwireClient } from "../src/index.ts";
import { MetricsDatasetInterval } from "../generated/model/metricsDatasetInterval.ts";
import { readRequestBody, withServer } from "./helpers/server.ts";

const cleanup: Array<() => Promise<void>> = [];

afterEach(async () => {
  while (cleanup.length > 0) {
    await cleanup.pop()?.();
  }
});

describe("ImgwireClient", () => {
  it("initializes grouped resources", () => {
    const client = new ImgwireClient({
      apiKey: "sk_test"
    });

    expect(client.images).toBeDefined();
    expect(client.customDomain).toBeDefined();
    expect(client.corsOrigins).toBeDefined();
    expect(client.metrics).toBeDefined();
  });

  describe("images", () => {
    it("sends auth and parses paginated list responses", async () => {
      const server = await withServer(async (request, response) => {
        expect(request.method).toBe("GET");
        expect(request.headers.authorization).toBe("Bearer sk_test");
        expect(request.url).toBe("/api/v1/images/?limit=5&page=2");

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.setHeader("X-Limit", "5");
        response.setHeader("X-Next-Page", "3");
        response.setHeader("X-Page", "2");
        response.setHeader("X-Prev-Page", "1");
        response.setHeader("X-Total-Count", "15");
        response.end(JSON.stringify([imageResponse()]));
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const result = await client.images.list({ limit: 5, page: 2 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.id).toBe("img_123");
      expect(result.pagination).toEqual({
        limit: 5,
        nextPage: 3,
        page: 2,
        prevPage: 1,
        totalCount: 15
      });
    });

    it("supports the non-upload image resource methods", async () => {
      const requests: Array<{
        body: string;
        method: string;
        url: string;
      }> = [];
      const server = await withServer(async (request, response) => {
        requests.push({
          body: await readRequestBody(request),
          method: request.method ?? "UNKNOWN",
          url: request.url ?? ""
        });

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        if (
          request.method === "GET" &&
          request.url === "/api/v1/images/img_123"
        ) {
          response.end(JSON.stringify(imageResponse()));
          return;
        }

        if (
          request.method === "POST" &&
          request.url === "/api/v1/images/downloads"
        ) {
          response.end(JSON.stringify(downloadJobResponse()));
          return;
        }

        if (
          request.method === "GET" &&
          request.url === "/api/v1/images/downloads/job_123"
        ) {
          response.end(JSON.stringify(downloadJobResponse()));
          return;
        }

        if (
          request.method === "POST" &&
          request.url === "/api/v1/images/token"
        ) {
          response.end(
            JSON.stringify({
              created_at: "2026-04-14T00:00:00Z",
              environment_id: "env_123",
              expires_at: "2026-04-15T00:00:00Z",
              id: "ut_123",
              token: "ut_token_123",
              updated_at: "2026-04-14T00:00:00Z",
              used_at: null
            })
          );
          return;
        }

        if (
          request.method === "POST" &&
          request.url === "/api/v1/images/bulk_delete"
        ) {
          response.end(JSON.stringify({ status: "ok" }));
          return;
        }

        if (
          request.method === "DELETE" &&
          request.url === "/api/v1/images/img_123"
        ) {
          response.end(JSON.stringify({ status: "deleted" }));
          return;
        }

        response.statusCode = 404;
        response.end("");
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const image = await client.images.retrieve("img_123");
      const uploadToken = await client.images.createUploadToken();
      const downloadJob = await client.images.createBulkDownloadJob({
        image_ids: ["img_123", "img_456"]
      });
      const retrievedJob =
        await client.images.retrieveBulkDownloadJob("job_123");
      const bulkDelete = await client.images.bulkDelete({
        image_ids: ["img_123", "img_456"]
      });
      const deleted = await client.images.delete("img_123");

      expect(image.id).toBe("img_123");
      expect(
        image.url({
          preset: "thumbnail",
          width: 150,
          height: 150
        })
      ).toBe("https://cdn.imgwire.dev/example@thumbnail?height=150&width=150");
      expect(uploadToken.id).toBe("ut_123");
      expect(uploadToken.token).toBe("ut_token_123");
      expect(downloadJob.id).toBe("job_123");
      expect(retrievedJob.id).toBe("job_123");
      expect(bulkDelete.status).toBe("ok");
      expect(deleted.status).toBe("deleted");

      expect(requests.map(({ method, url }) => ({ method, url }))).toEqual([
        { method: "GET", url: "/api/v1/images/img_123" },
        { method: "POST", url: "/api/v1/images/token" },
        { method: "POST", url: "/api/v1/images/downloads" },
        { method: "GET", url: "/api/v1/images/downloads/job_123" },
        { method: "POST", url: "/api/v1/images/bulk_delete" },
        { method: "DELETE", url: "/api/v1/images/img_123" }
      ]);
      expect(requests[2]?.body).toContain('"image_ids":["img_123","img_456"]');
      expect(requests[4]?.body).toContain('"image_ids":["img_123","img_456"]');
    });

    it("passes upload token query parameters through create()", async () => {
      const server = await withServer(async (request, response) => {
        expect(request.method).toBe("POST");
        expect(request.url).toBe(
          "/api/v1/images/standard_upload?upload_token=ut_123"
        );
        expect(await readRequestBody(request)).toContain(
          '"file_name":"hero.png"'
        );

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(
          JSON.stringify({
            image: imageResponse(),
            upload_url: "https://uploads.example.test/upload-target"
          })
        );
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const created = await client.images.create(
        {
          file_name: "hero.png"
        },
        {
          uploadToken: "ut_123"
        }
      );

      expect(created.image.id).toBe("img_123");
      expect(
        created.image.url({
          rotate: 90
        })
      ).toBe("https://cdn.imgwire.dev/example?rotate=90");
    });

    it("uploads a Buffer through the standard upload workflow", async () => {
      const requests: Array<{ method: string; url: string; body: string }> = [];
      const server = await withServer(async (request, response) => {
        if (
          request.method === "POST" &&
          request.url === "/api/v1/images/standard_upload"
        ) {
          requests.push({
            body: await readRequestBody(request),
            method: request.method,
            url: request.url
          });
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(
            JSON.stringify({
              image: imageResponse(),
              upload_url: `${server.origin}/upload-target`
            })
          );
          return;
        }

        if (request.method === "PUT" && request.url === "/upload-target") {
          requests.push({
            body: await readRequestBody(request),
            method: request.method,
            url: request.url
          });
          response.statusCode = 200;
          response.end("");
          return;
        }

        response.statusCode = 404;
        response.end("");
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const image = await client.images.upload({
        file: Buffer.from("data"),
        fileName: "hero.png",
        mimeType: "image/png"
      });

      expect(image.id).toBe("img_123");
      expect(
        image.url({
          preset: "thumbnail",
          rotate: 90
        })
      ).toBe("https://cdn.imgwire.dev/example@thumbnail?rotate=90");
      expect(requests).toHaveLength(2);
      expect(requests[0]?.body).toContain('"file_name":"hero.png"');
      expect(requests[0]?.body).toContain('"content_length":4');
      expect(requests[1]).toEqual({
        body: "data",
        method: "PUT",
        url: "/upload-target"
      });
    });

    it("supports fs streams and generic readable streams for uploads", async () => {
      const uploadBodies: string[] = [];
      const server = await withServer(async (request, response) => {
        if (
          request.method === "POST" &&
          request.url === "/api/v1/images/standard_upload"
        ) {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(
            JSON.stringify({
              image: imageResponse(),
              upload_url: `${server.origin}/upload-target`
            })
          );
          return;
        }

        if (request.method === "PUT" && request.url === "/upload-target") {
          uploadBodies.push(await readRequestBody(request));
          response.statusCode = 200;
          response.end("");
          return;
        }

        response.statusCode = 404;
        response.end("");
      });
      cleanup.push(server.close);

      const tempDir = await mkdtemp(resolve(tmpdir(), "imgwire-node-test-"));
      cleanup.push(async () => {
        await fs.promises.rm(tempDir, { force: true, recursive: true });
      });
      const filePath = resolve(tempDir, "streamed.txt");
      await writeFile(filePath, "file-data", "utf8");

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      await client.images.upload({
        file: fs.createReadStream(filePath),
        mimeType: "image/png"
      });

      await client.images.upload({
        file: Readable.from("stream-data"),
        contentLength: "stream-data".length,
        fileName: "stream.txt",
        mimeType: "image/png"
      });

      expect(uploadBodies).toEqual(["file-data", "stream-data"]);
    });
  });

  describe("corsOrigins", () => {
    it("covers create, list, retrieve, update, and delete", async () => {
      const requests: Array<{ body: string; method: string; url: string }> = [];
      const server = await withServer(async (request, response) => {
        requests.push({
          body: await readRequestBody(request),
          method: request.method ?? "UNKNOWN",
          url: request.url ?? ""
        });
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        if (
          request.method === "POST" &&
          request.url === "/api/v1/cors_origins/"
        ) {
          response.end(
            JSON.stringify(corsOriginResponse("https://app.example.com"))
          );
          return;
        }

        if (
          request.method === "GET" &&
          request.url === "/api/v1/cors_origins/?limit=10&page=1"
        ) {
          response.setHeader("X-Limit", "10");
          response.setHeader("X-Next-Page", "2");
          response.setHeader("X-Page", "1");
          response.setHeader("X-Prev-Page", "");
          response.setHeader("X-Total-Count", "11");
          response.end(
            JSON.stringify([corsOriginResponse("https://app.example.com")])
          );
          return;
        }

        if (
          request.method === "GET" &&
          request.url === "/api/v1/cors_origins/cors_123"
        ) {
          response.end(
            JSON.stringify(corsOriginResponse("https://app.example.com"))
          );
          return;
        }

        if (
          request.method === "PATCH" &&
          request.url === "/api/v1/cors_origins/cors_123"
        ) {
          response.end(
            JSON.stringify(corsOriginResponse("https://admin.example.com"))
          );
          return;
        }

        if (
          request.method === "DELETE" &&
          request.url === "/api/v1/cors_origins/cors_123"
        ) {
          response.end(JSON.stringify({ status: "deleted" }));
          return;
        }

        response.statusCode = 404;
        response.end("");
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const created = await client.corsOrigins.create({
        pattern: "https://app.example.com"
      });
      const listed = await client.corsOrigins.list({ limit: 10, page: 1 });
      const retrieved = await client.corsOrigins.retrieve("cors_123");
      const updated = await client.corsOrigins.update("cors_123", {
        pattern: "https://admin.example.com"
      });
      const deleted = await client.corsOrigins.delete("cors_123");

      expect(created.pattern).toBe("https://app.example.com");
      expect(listed.data[0]?.id).toBe("cors_123");
      expect(listed.pagination.totalCount).toBe(11);
      expect(retrieved.id).toBe("cors_123");
      expect(updated.pattern).toBe("https://admin.example.com");
      expect(deleted.status).toBe("deleted");

      expect(requests.map(({ method, url }) => ({ method, url }))).toEqual([
        { method: "POST", url: "/api/v1/cors_origins/" },
        { method: "GET", url: "/api/v1/cors_origins/?limit=10&page=1" },
        { method: "GET", url: "/api/v1/cors_origins/cors_123" },
        { method: "PATCH", url: "/api/v1/cors_origins/cors_123" },
        { method: "DELETE", url: "/api/v1/cors_origins/cors_123" }
      ]);
      expect(requests[0]?.body).toContain(
        '"pattern":"https://app.example.com"'
      );
      expect(requests[3]?.body).toContain(
        '"pattern":"https://admin.example.com"'
      );
    });
  });

  describe("customDomain", () => {
    it("covers create, retrieve, testConnection, and delete", async () => {
      const requests: Array<{ body: string; method: string; url: string }> = [];
      const server = await withServer(async (request, response) => {
        requests.push({
          body: await readRequestBody(request),
          method: request.method ?? "UNKNOWN",
          url: request.url ?? ""
        });
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        if (
          request.method === "POST" &&
          request.url === "/api/v1/custom_domain/"
        ) {
          response.end(JSON.stringify(customDomainResponse("img.example.com")));
          return;
        }

        if (
          request.method === "GET" &&
          request.url === "/api/v1/custom_domain/"
        ) {
          response.end(JSON.stringify(customDomainResponse("img.example.com")));
          return;
        }

        if (
          request.method === "POST" &&
          request.url === "/api/v1/custom_domain/test_connection"
        ) {
          response.end(JSON.stringify(customDomainResponse("img.example.com")));
          return;
        }

        if (
          request.method === "DELETE" &&
          request.url === "/api/v1/custom_domain/"
        ) {
          response.end(JSON.stringify({ status: "deleted" }));
          return;
        }

        response.statusCode = 404;
        response.end("");
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const created = await client.customDomain.create({
        hostname: "img.example.com"
      });
      const retrieved = await client.customDomain.retrieve();
      const tested = await client.customDomain.testConnection();
      const deleted = await client.customDomain.delete();

      expect(created.hostname).toBe("img.example.com");
      expect(retrieved.id).toBe("cd_123");
      expect(tested.cname_record).toBe("cdn.img.example.com");
      expect(deleted.status).toBe("deleted");

      expect(requests.map(({ method, url }) => ({ method, url }))).toEqual([
        { method: "POST", url: "/api/v1/custom_domain/" },
        { method: "GET", url: "/api/v1/custom_domain/" },
        { method: "POST", url: "/api/v1/custom_domain/test_connection" },
        { method: "DELETE", url: "/api/v1/custom_domain/" }
      ]);
      expect(requests[0]?.body).toContain('"hostname":"img.example.com"');
    });
  });

  describe("metrics", () => {
    it("covers getDatasets and getStats with query parameters", async () => {
      const requests: Array<{ method: string; url: string }> = [];
      const server = await withServer(async (request, response) => {
        requests.push({
          method: request.method ?? "UNKNOWN",
          url: request.url ?? ""
        });
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        if (
          request.method === "GET" &&
          request.url?.startsWith("/api/v1/metrics/datasets?")
        ) {
          response.end(JSON.stringify(metricsDatasetsResponse()));
          return;
        }

        if (
          request.method === "GET" &&
          request.url?.startsWith("/api/v1/metrics/stats?")
        ) {
          response.end(JSON.stringify(metricsStatsResponse()));
          return;
        }

        response.statusCode = 404;
        response.end("");
      });
      cleanup.push(server.close);

      const client = new ImgwireClient({
        apiKey: "sk_test",
        baseUrl: server.origin
      });

      const dateStart = new Date("2026-04-01T00:00:00.000Z");
      const dateEnd = new Date("2026-04-15T00:00:00.000Z");

      const datasets = await client.metrics.getDatasets({
        dateEnd,
        dateStart,
        interval: MetricsDatasetInterval.DAILY,
        tz: "America/Chicago"
      });
      const stats = await client.metrics.getStats({
        dateEnd,
        dateStart,
        interval: MetricsDatasetInterval.DAILY,
        tz: "America/Chicago"
      });

      expect(datasets.uploads[0]?.uploads).toBe(3);
      expect(stats.uploads.value).toBe(9);
      expect(requests).toEqual([
        {
          method: "GET",
          url: "/api/v1/metrics/datasets?date_end=2026-04-15T00%3A00%3A00.000Z&date_start=2026-04-01T00%3A00%3A00.000Z&interval=DAILY&tz=America%2FChicago"
        },
        {
          method: "GET",
          url: "/api/v1/metrics/stats?date_end=2026-04-15T00%3A00%3A00.000Z&date_start=2026-04-01T00%3A00%3A00.000Z&interval=DAILY&tz=America%2FChicago"
        }
      ]);
    });
  });
});

function imageResponse() {
  return {
    can_upload: true,
    cdn_url: "https://cdn.imgwire.dev/example",
    created_at: "2026-04-14T00:00:00Z",
    custom_metadata: {},
    deleted_at: null,
    environment_id: null,
    exif_data: {},
    extension: "png",
    hash_sha256: null,
    height: 1,
    id: "img_123",
    idempotency_key: null,
    is_directly_deliverable: true,
    mime_type: "image/png",
    original_filename: "hero.png",
    processed_metadata_at: null,
    purpose: null,
    size_bytes: 4,
    status: "READY",
    updated_at: "2026-04-14T00:00:00Z",
    upload_token_id: null,
    width: 1
  };
}

function downloadJobResponse() {
  return {
    created_at: "2026-04-14T00:00:00Z",
    download_url: "https://downloads.imgwire.dev/job_123.zip",
    environment_id: null,
    id: "job_123",
    image_ids: ["img_123", "img_456"],
    status: "READY",
    updated_at: "2026-04-14T00:00:00Z"
  };
}

function corsOriginResponse(pattern: string) {
  return {
    created_at: "2026-04-14T00:00:00Z",
    environment_id: "env_123",
    id: "cors_123",
    pattern,
    updated_at: "2026-04-14T00:00:00Z"
  };
}

function customDomainResponse(hostname: string) {
  return {
    certificate_status: "ACTIVE",
    cname_record: "cdn.img.example.com",
    cname_value: "imgwire.example.net",
    created_at: "2026-04-14T00:00:00Z",
    dcv_cname_record: "_imgwire-challenge.img.example.com",
    dcv_cname_value: "challenge-token",
    environment_id: "env_123",
    hostname,
    id: "cd_123",
    last_verified_at: "2026-04-14T00:00:00Z",
    status: "CONNECTED",
    updated_at: "2026-04-14T00:00:00Z"
  };
}

function metricsDatasetsResponse() {
  return {
    cache_hit_ratio: [{ label: "2026-04-14", value: 0.9 }],
    requests: [{ requests: 11, timestamp: "2026-04-14T00:00:00Z" }],
    storage_bytes: [
      {
        storage_bytes_added: 48,
        storage_bytes_current: 2048,
        timestamp: "2026-04-14T00:00:00Z"
      }
    ],
    transfer_bytes: [
      { timestamp: "2026-04-14T00:00:00Z", transfer_bytes: 512 }
    ],
    transformations: [
      { timestamp: "2026-04-14T00:00:00Z", transformations: 5 }
    ],
    uploads: [{ timestamp: "2026-04-14T00:00:00Z", uploads: 3 }]
  };
}

function metricsStatsResponse() {
  return {
    cache_hit_ratio: { pct_change: 0.1, prev: 0.8, value: 0.9 },
    requests: { pct_change: 0.5, prev: 6, value: 9 },
    storage_bytes: { pct_change: 0.2, prev: 1000, value: 1200 },
    transfer_bytes: { pct_change: 0.4, prev: 300, value: 420 },
    transformations: { pct_change: null, prev: 0, value: 5 },
    uploads: { pct_change: 0.5, prev: 6, value: 9 }
  };
}

import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import fs from "node:fs";
import { Readable } from "node:stream";

import { afterEach, describe, expect, it } from "vitest";

import { ImgwireClient } from "../src/index.ts";
import { withServer, readRequestBody } from "./helpers/server.ts";

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
      response.end(
        JSON.stringify([
          {
            cdn_url: "https://cdn.imgwire.dev/example.png",
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
            mime_type: "image/png",
            original_filename: "hero.png",
            processed_metadata_at: null,
            purpose: null,
            size_bytes: 1,
            status: "READY",
            updated_at: "2026-04-14T00:00:00Z",
            upload_token_id: null,
            width: 1
          }
        ])
      );
    });
    cleanup.push(server.close);

    const client = new ImgwireClient({
      apiKey: "sk_test",
      baseUrl: server.origin
    });

    const result = await client.images.list({ limit: 5, page: 2 });

    expect(result.data).toHaveLength(1);
    expect(result.pagination).toEqual({
      limit: 5,
      nextPage: 3,
      page: 2,
      prevPage: 1,
      totalCount: 15
    });
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
            image: {
              cdn_url: "https://cdn.imgwire.dev/example.png",
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
              mime_type: "image/png",
              original_filename: "hero.png",
              processed_metadata_at: null,
              purpose: null,
              size_bytes: 4,
              status: "READY",
              updated_at: "2026-04-14T00:00:00Z",
              upload_token_id: null,
              width: 1
            },
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
            image: {
              cdn_url: "https://cdn.imgwire.dev/example.png",
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
              mime_type: "image/png",
              original_filename: "hero.png",
              processed_metadata_at: null,
              purpose: null,
              size_bytes: 4,
              status: "READY",
              updated_at: "2026-04-14T00:00:00Z",
              upload_token_id: null,
              width: 1
            },
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

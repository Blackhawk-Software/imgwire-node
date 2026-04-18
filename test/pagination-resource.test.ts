import { afterEach, describe, expect, it } from "vitest";

import { ImgwireClient } from "../src/index.ts";
import { withServer } from "./helpers/server.ts";

const cleanup: Array<() => Promise<void>> = [];

afterEach(async () => {
  while (cleanup.length > 0) {
    await cleanup.pop()?.();
  }
});

describe("paginated resource iterators", () => {
  it("images.listPages() iterates full page results", async () => {
    const server = await withServer(async (request, response) => {
      const url = new URL(request.url ?? "/", "http://localhost");
      const page = Number(url.searchParams.get("page") ?? "1");
      const limit = Number(url.searchParams.get("limit") ?? "2");

      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.setHeader("X-Limit", String(limit));
      response.setHeader("X-Page", String(page));
      response.setHeader("X-Prev-Page", page > 1 ? String(page - 1) : "");
      response.setHeader("X-Next-Page", page < 2 ? String(page + 1) : "");
      response.setHeader("X-Total-Count", "4");
      response.end(
        JSON.stringify([
          imageResponse(`img_${page}a`),
          imageResponse(`img_${page}b`)
        ])
      );
    });
    cleanup.push(server.close);

    const client = new ImgwireClient({
      apiKey: "sk_test",
      baseUrl: server.origin
    });

    const pages: string[][] = [];
    for await (const page of client.images.listPages({ page: 1, limit: 2 })) {
      pages.push(page.data.map((item) => item.id));
    }

    expect(pages).toEqual([
      ["img_1a", "img_1b"],
      ["img_2a", "img_2b"]
    ]);
  });

  it("corsOrigins.listAll() iterates items across pages", async () => {
    const server = await withServer(async (request, response) => {
      const url = new URL(request.url ?? "/", "http://localhost");
      const page = Number(url.searchParams.get("page") ?? "1");
      const limit = Number(url.searchParams.get("limit") ?? "2");

      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.setHeader("X-Limit", String(limit));
      response.setHeader("X-Page", String(page));
      response.setHeader("X-Prev-Page", page > 1 ? String(page - 1) : "");
      response.setHeader("X-Next-Page", page < 2 ? String(page + 1) : "");
      response.setHeader("X-Total-Count", "4");
      response.end(
        JSON.stringify([
          corsOriginResponse(`cors_${page}a`, `https://${page}a.example.com`),
          corsOriginResponse(`cors_${page}b`, `https://${page}b.example.com`)
        ])
      );
    });
    cleanup.push(server.close);

    const client = new ImgwireClient({
      apiKey: "sk_test",
      baseUrl: server.origin
    });

    const ids: string[] = [];
    for await (const item of client.corsOrigins.listAll({
      page: 1,
      limit: 2
    })) {
      ids.push(item.id);
    }

    expect(ids).toEqual(["cors_1a", "cors_1b", "cors_2a", "cors_2b"]);
  });
});

function imageResponse(id: string) {
  return {
    can_upload: true,
    cdn_url: `https://cdn.imgwire.dev/${id}`,
    created_at: "2026-04-14T00:00:00Z",
    custom_metadata: {},
    deleted_at: null,
    environment_id: null,
    exif_data: {},
    extension: "png",
    hash_sha256: null,
    height: 1,
    id,
    idempotency_key: null,
    is_directly_deliverable: true,
    mime_type: "image/png",
    original_filename: `${id}.png`,
    processed_metadata_at: null,
    purpose: null,
    size_bytes: 4,
    status: "READY",
    updated_at: "2026-04-14T00:00:00Z",
    upload_token_id: null,
    width: 1
  };
}

function corsOriginResponse(id: string, pattern: string) {
  return {
    created_at: "2026-04-14T00:00:00Z",
    environment_id: "env_123",
    id,
    pattern,
    updated_at: "2026-04-14T00:00:00Z"
  };
}

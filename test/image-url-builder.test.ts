import { describe, expect, it } from "vitest";

import { extendImage } from "../src/images/url-builder.ts";

function makeImage() {
  return extendImage({
    cdn_url: "https://cdn.imgwire.dev/example.jpg",
    created_at: new Date("2026-04-14T00:00:00Z"),
    custom_metadata: {},
    deleted_at: null,
    environment_id: null,
    exif_data: {},
    extension: "jpg",
    hash_sha256: null,
    height: 100,
    id: "img_1",
    idempotency_key: null,
    mime_type: "image/jpeg" as never,
    original_filename: "example.jpg",
    processed_metadata_at: null,
    purpose: null,
    size_bytes: 100,
    status: "READY" as never,
    updated_at: new Date("2026-04-14T00:00:00Z"),
    upload_token_id: null,
    width: 100
  });
}

describe("extendImage", () => {
  it("builds transformed urls with presets and canonical params", () => {
    const image = makeImage();

    expect(
      image.url({
        preset: "thumbnail",
        bg: "#ffffff",
        h: 150,
        rot: 90,
        w: 150
      })
    ).toBe(
      "https://cdn.imgwire.dev/example.jpg@thumbnail?background=ffffff&height=150&rotate=90&width=150"
    );
  });

  it("normalizes worker-compatible boolean behavior", () => {
    const image = makeImage();

    expect(
      image.url({
        enlarge: false,
        strip_metadata: true
      })
    ).toBe("https://cdn.imgwire.dev/example.jpg?strip_metadata=true");
  });

  it("rejects duplicate aliases for the same canonical rule", () => {
    const image = makeImage();

    expect(() =>
      image.url({
        width: 100,
        w: 200
      })
    ).toThrow("Duplicate transformation rule: width");
  });

  it("rejects invalid worker transformation values", () => {
    const image = makeImage();

    expect(() =>
      image.url({
        rotate: 45 as never
      })
    ).toThrow("Invalid transformation rule value for rotate");
  });
});

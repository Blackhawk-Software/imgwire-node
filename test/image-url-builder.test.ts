import { describe, expect, it } from "vitest";

import { extendImage } from "../src/images/url-builder.ts";

function makeImage() {
  return extendImage({
    can_upload: true,
    cdn_url: "https://cdn.imgwire.dev/example",
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
    is_directly_deliverable: true,
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

function searchParams(url: string) {
  return new URL(url).searchParams;
}

function jsonParam(urlSearchParams: URLSearchParams, key: string) {
  const value = urlSearchParams.get(key);
  expect(value).not.toBeNull();
  return JSON.parse(value ?? "") as unknown;
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
      "https://cdn.imgwire.dev/example@thumbnail?background=ffffff&height=150&rotate=90&width=150"
    );
  });

  it("normalizes worker-compatible boolean behavior", () => {
    const image = makeImage();

    expect(
      image.url({
        enlarge: false,
        strip_metadata: true
      })
    ).toBe("https://cdn.imgwire.dev/example?enlarge=false&strip_metadata=true");
  });

  it("accepts auto as an output format", () => {
    const image = makeImage();

    expect(
      image.url({
        format: "auto"
      })
    ).toBe("https://cdn.imgwire.dev/example?format=auto");
  });

  it("accepts automatic quality, progressive, and chroma subsampling values", () => {
    const image = makeImage();
    const params = searchParams(
      image.url({
        quality: "auto",
        progressive: "auto",
        chroma_subsampling: "4:2:2"
      })
    );

    expect(params.get("quality")).toBe("auto");
    expect(params.get("progressive")).toBe("auto");
    expect(params.get("chroma_subsampling")).toBe("4:2:2");

    const booleanParams = searchParams(
      image.url({
        progressive: false,
        chroma_subsampling: "4:4:4"
      })
    );

    expect(booleanParams.get("progressive")).toBe("false");
    expect(booleanParams.get("chroma_subsampling")).toBe("4:4:4");
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

  it("omits invalid worker transformation values", () => {
    const image = makeImage();

    expect(
      image.url({
        chroma_subsampling: "4:2:0" as never,
        format: "bmp" as never,
        pixelate: 1,
        progressive: "maybe" as never,
        quality: 0,
        rotate: 45,
        width: 600
      })
    ).toBe("https://cdn.imgwire.dev/example?rotate=45&width=600");

    expect(
      image.url({
        pixelate: 257,
        width: 600
      })
    ).toBe("https://cdn.imgwire.dev/example?width=600");
  });

  it("builds the URL transformation guide examples", () => {
    const image = makeImage();

    expect(
      image.url({
        w: 800,
        h: 600,
        resizing_type: "cover"
      })
    ).toBe(
      "https://cdn.imgwire.dev/example?height=600&resizing_type=cover&width=800"
    );

    expect(
      image.url({
        width: 1200,
        format: "jpg",
        q: 85
      })
    ).toBe("https://cdn.imgwire.dev/example?format=jpg&quality=85&width=1200");

    expect(
      searchParams(
        image.url({
          crop: "400:300:noea"
        })
      ).get("crop")
    ).toBe("400:300:northeast");

    const publicWatermarkUrl = "https://example.com/logo.png";
    const watermarkUrlParams = searchParams(
      image.url({
        watermark_url: publicWatermarkUrl,
        watermark_position: "southeast:-24:-24:0.85",
        format: "webp"
      })
    );
    expect(watermarkUrlParams.get("watermark_url")).toBe(
      Buffer.from(publicWatermarkUrl, "utf8").toString("base64")
    );
    expect(watermarkUrlParams.get("watermark_position")).toBe(
      "southeast:-24:-24:0.85"
    );
    expect(watermarkUrlParams.get("format")).toBe("webp");

    const watermarkImageParams = searchParams(
      image.url({
        watermark: "logo_image_id",
        watermark_position: "se:-24:-24",
        format: "webp"
      })
    );
    expect(watermarkImageParams.get("watermark")).toBe("logo_image_id");
    expect(watermarkImageParams.get("watermark_position")).toBe(
      "southeast:-24:-24"
    );
    expect(watermarkImageParams.get("format")).toBe("webp");

    const duotoneParams = searchParams(
      image.url({
        duotone: {
          shadowColor: "#0b1f5e",
          highlightColor: "#ff2a2a"
        }
      })
    );
    expect(jsonParam(duotoneParams, "duotone")).toEqual({
      shadowColor: "#0b1f5e",
      highlightColor: "#ff2a2a"
    });
  });

  it("serializes object-style transform values", () => {
    const image = makeImage();
    const params = searchParams(
      image.url({
        gradient: {
          colors: ["#ff0000", "#00ff00", { r: 0, g: 0, b: 255 }],
          angle: 90,
          opacity: 0.25,
          blend: "overlay"
        },
        zoom: {
          factor: 2,
          gravity: "se"
        },
        normalize: {
          lower: 1,
          upper: 99
        }
      })
    );

    expect(jsonParam(params, "gradient")).toEqual({
      colors: ["#ff0000", "#00ff00", { r: 0, g: 0, b: 255 }],
      angle: 90,
      opacity: 0.25,
      blend: "overlay"
    });
    expect(params.get("zoom")).toBe("2:southeast");
    expect(params.get("normalize")).toBe("1:99");
  });

  it("covers every supported transformation key", () => {
    const image = makeImage();
    const params = searchParams(
      image.url({
        adjust: { brightness: 1.2, saturation: 0.8, color: 1.1 },
        background: "#ffffff",
        background_alpha: 0.5,
        blur: 1.5,
        brightness: 1.1,
        chroma_subsampling: "auto",
        color_profile: "srgb",
        colorize: "#112233",
        contrast: { multiplier: 1.2, pivot: 128 },
        crop: { width: 300, height: 200, gravity: "nw" },
        dpi: 144,
        dpr: 2,
        duotone: {
          shadowColor: "#0b1f5e",
          highlightColor: "#ff2a2a"
        },
        enlarge: false,
        extend: { top: 10, right: 20, bottom: 30, left: 40 },
        extend_aspect_ratio: { width: 16, height: 9 },
        flip: { horizontal: true },
        format: "webp",
        gradient: { colors: ["#111111", "#eeeeee"], angle: 180 },
        gravity: "ce:sm",
        height: 600,
        hue: 45,
        keep_copyright: false,
        lightness: 1.05,
        "min-height": 300,
        "min-width": 400,
        monochrome: "#cccccc",
        negate: { alpha: true },
        normalize: "1:99",
        padding: { top: 1, right: 2, bottom: 3, left: 4 },
        pixelate: 4,
        progressive: true,
        quality: 80,
        resizing_algorithm: "lanczos3",
        resizing_type: "fit",
        rotate: { angle: 45, background: "#00000000" },
        saturation: 1.2,
        sharpen: { sigma: 2 },
        strip_color_profile: true,
        strip_metadata: true,
        watermark_text: {
          text: "Logo",
          gravity: "so",
          size: 48,
          color: "#ffffff"
        },
        watermark_position: { gravity: "se", x: -24, y: -24, opacity: 0.85 },
        watermark_rotate: { angle: -15, background: "#00000000" },
        watermark_shadow: { color: "#000000", blur: 4, x: 2, y: 2 },
        watermark_size: { width: 160, scale: 0.5 },
        width: 800,
        zoom: { factor: 1.25, gravity: "ce" }
      })
    );

    expect([...params.keys()]).toEqual([
      "adjust",
      "background",
      "background_alpha",
      "blur",
      "brightness",
      "chroma_subsampling",
      "color_profile",
      "colorize",
      "contrast",
      "crop",
      "dpi",
      "dpr",
      "duotone",
      "enlarge",
      "extend",
      "extend_aspect_ratio",
      "flip",
      "format",
      "gradient",
      "gravity",
      "height",
      "hue",
      "keep_copyright",
      "lightness",
      "min-height",
      "min-width",
      "monochrome",
      "negate",
      "normalize",
      "padding",
      "pixelate",
      "progressive",
      "quality",
      "resizing_algorithm",
      "resizing_type",
      "rotate",
      "saturation",
      "sharpen",
      "strip_color_profile",
      "strip_metadata",
      "watermark_position",
      "watermark_rotate",
      "watermark_shadow",
      "watermark_size",
      "watermark_text",
      "width",
      "zoom"
    ]);
    expect(params.get("resizing_type")).toBe("inside");
    expect(params.get("gravity")).toBe("attention");
    expect(params.get("flip")).toBe("horizontal");
  });

  it("drops watermark modifiers without a valid watermark source", () => {
    const image = makeImage();

    expect(
      image.url({
        watermark_position: "se:-24:-24",
        width: 800
      })
    ).toBe("https://cdn.imgwire.dev/example?width=800");
  });
});

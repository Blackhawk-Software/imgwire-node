import type { ImageSchema } from "../../generated/model/imageSchema.ts";

export const IMAGE_URL_PRESETS = [
  "thumbnail",
  "small",
  "medium",
  "large"
] as const;

export const IMAGE_URL_GRAVITY_TYPES = [
  "ce",
  "center",
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
  "attention",
  "entropy",
  "n",
  "s",
  "e",
  "w",
  "ne",
  "se",
  "nw",
  "sw",
  "no",
  "so",
  "ea",
  "we",
  "noea",
  "soea",
  "nowe",
  "sowe"
] as const;

export const IMAGE_URL_RESIZING_TYPES = [
  "cover",
  "contain",
  "fill",
  "inside",
  "outside",
  "fit",
  "fill-down",
  "force",
  "auto"
] as const;

export const IMAGE_URL_RESIZING_ALGORITHMS = [
  "nearest",
  "cubic",
  "mitchell",
  "lanczos2",
  "lanczos3"
] as const;

export const IMAGE_URL_OUTPUT_FORMATS = [
  "auto",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff"
] as const;

export const IMAGE_URL_COLOR_PROFILES = [
  "srgb",
  "rgb16",
  "cmyk",
  "keep",
  "preserve"
] as const;

export const IMAGE_URL_CHROMA_SUBSAMPLING_VALUES = [
  "4:4:4",
  "4:2:2",
  "auto"
] as const;

export type ImageUrlPreset = (typeof IMAGE_URL_PRESETS)[number];
export type GravityType = (typeof IMAGE_URL_GRAVITY_TYPES)[number];
export type ResizingType = (typeof IMAGE_URL_RESIZING_TYPES)[number];
export type ResizingAlgorithm = (typeof IMAGE_URL_RESIZING_ALGORITHMS)[number];
export type OutputFormat = (typeof IMAGE_URL_OUTPUT_FORMATS)[number];
export type ColorProfile = (typeof IMAGE_URL_COLOR_PROFILES)[number];
export type ChromaSubsampling =
  (typeof IMAGE_URL_CHROMA_SUBSAMPLING_VALUES)[number];
export type BooleanString =
  | "true"
  | "false"
  | "t"
  | "f"
  | "1"
  | "0"
  | "yes"
  | "no"
  | "on"
  | "off";
export type BooleanLike = boolean | BooleanString;
export type NumericValue = number | `${number}`;
export type QualityValue = NumericValue | "auto";
export type ProgressiveValue = BooleanLike | "auto";

export type ImageUrlColor =
  | string
  | {
      alpha?: NumericValue;
      b: NumericValue;
      g: NumericValue;
      r: NumericValue;
    };

export type GravityValue =
  | GravityType
  | `${GravityType}:sm`
  | `${GravityType}:${number}:${number}`;

export type AdjustValue =
  | `${number}`
  | `${number}:${number}`
  | `${number}:${number}:${number}`
  | {
      brightness?: NumericValue;
      color?: NumericValue;
      saturation?: NumericValue;
    };

export type ContrastValue =
  | NumericValue
  | `${number}:${number}`
  | {
      multiplier: NumericValue;
      pivot?: NumericValue;
    };

export type CropValue =
  | `${number}:${number}`
  | `${number}:${number}:${GravityType}`
  | `${number}:${number}:${number}:${number}`
  | `${number}:${number}:${number}:${number}:${GravityType}`
  | {
      gravity?: GravityType;
      height: NumericValue;
      mode?: "extract";
      width: NumericValue;
      x?: NumericValue;
      y?: NumericValue;
    };

export type DuotoneValue =
  | `${string}:${string}`
  | {
      highlightColor: ImageUrlColor;
      shadowColor: ImageUrlColor;
    };

export type ExtendValue =
  | NumericValue
  | `${number}:${number}`
  | `${number}:${number}:${number}`
  | `${number}:${number}:${number}:${number}`
  | `${number}:${number}:${number}:${number}:${string}`
  | {
      background?: ImageUrlColor;
      bottom?: NumericValue;
      left?: NumericValue;
      right?: NumericValue;
      top?: NumericValue;
    };

export type ExtendAspectRatioValue =
  | NumericValue
  | `${number}:${number}`
  | {
      aspectRatio?: NumericValue;
      height?: NumericValue;
      ratio?: NumericValue;
      width?: NumericValue;
    };

export type FlipValue =
  | "vertical"
  | "horizontal"
  | "both"
  | `${BooleanString}:${BooleanString}`
  | {
      horizontal?: BooleanLike;
      vertical?: BooleanLike;
    };

export type GradientValue =
  | string
  | {
      angle?: NumericValue;
      blend?: string;
      colors?: ImageUrlColor[];
      opacity?: NumericValue;
    };

export type NegateValue =
  | true
  | "true"
  | "t"
  | "1"
  | `alpha:${BooleanString}`
  | {
      alpha: BooleanLike;
    };

export type NormalizeValue =
  | BooleanLike
  | `${number}:${number}`
  | {
      lower: NumericValue;
      upper: NumericValue;
    };

export type PaddingValue =
  | NumericValue
  | `${number}:${number}`
  | `${number}:${number}:${number}`
  | `${number}:${number}:${number}:${number}`
  | {
      all?: NumericValue;
      bottom?: NumericValue;
      left?: NumericValue;
      right?: NumericValue;
      top?: NumericValue;
      x?: NumericValue;
      y?: NumericValue;
    };

export type RotateValue =
  | NumericValue
  | `${number}:${string}`
  | {
      angle: NumericValue;
      background?: ImageUrlColor;
    };

export type SharpenValue =
  | true
  | "true"
  | "t"
  | "1"
  | NumericValue
  | {
      flat?: NumericValue;
      jagged?: NumericValue;
      m1?: NumericValue;
      m2?: NumericValue;
      sigma?: NumericValue;
      x1?: NumericValue;
      y2?: NumericValue;
      y3?: NumericValue;
    };

export type WatermarkValue =
  | string
  | {
      blend?: string;
      gravity?: GravityType;
      image_id?: string;
      imageId?: string;
      opacity?: NumericValue;
      x?: NumericValue;
      y?: NumericValue;
    };

export type WatermarkPositionValue =
  | string
  | {
      blend?: string;
      gravity?: GravityType;
      left?: NumericValue;
      opacity?: NumericValue;
      top?: NumericValue;
      x?: NumericValue;
      y?: NumericValue;
    };

export type WatermarkShadowValue =
  | true
  | "true"
  | "t"
  | "1"
  | string
  | {
      blur?: NumericValue;
      color?: ImageUrlColor;
      x?: NumericValue;
      y?: NumericValue;
    };

export type WatermarkSizeValue =
  | string
  | {
      height?: NumericValue;
      scale?: NumericValue;
      width?: NumericValue;
    };

export type WatermarkTextValue =
  | string
  | {
      align?: string;
      blend?: string;
      color?: ImageUrlColor;
      font?: string;
      gravity?: GravityType;
      height?: NumericValue;
      left?: NumericValue;
      opacity?: NumericValue;
      size?: NumericValue;
      text: string;
      top?: NumericValue;
      width?: NumericValue;
      x?: NumericValue;
      y?: NumericValue;
    };

export type WatermarkUrlValue = string | URL;

export type ZoomValue =
  | NumericValue
  | `${number}:${GravityType}`
  | {
      factor: NumericValue;
      gravity?: GravityType;
    };

export type ImageUrlOptions = {
  preset?: ImageUrlPreset;
  a?: AdjustValue;
  adjust?: AdjustValue;
  background?: ImageUrlColor;
  background_alpha?: NumericValue;
  bg?: ImageUrlColor;
  bga?: NumericValue;
  bl?: true | NumericValue;
  blur?: true | NumericValue;
  br?: NumericValue;
  brightness?: NumericValue;
  c?: CropValue;
  col?: ImageUrlColor;
  color_profile?: ColorProfile;
  chroma_subsampling?: ChromaSubsampling;
  colorize?: ImageUrlColor;
  contrast?: ContrastValue;
  co?: ContrastValue;
  cp?: ColorProfile;
  crop?: CropValue;
  dpi?: NumericValue;
  dpr?: NumericValue;
  dt?: DuotoneValue;
  duotone?: DuotoneValue;
  el?: BooleanLike;
  enlarge?: BooleanLike;
  ex?: ExtendValue;
  exar?: ExtendAspectRatioValue;
  extend?: ExtendValue;
  extend_ar?: ExtendAspectRatioValue;
  extend_aspect_ratio?: ExtendAspectRatioValue;
  ext?: OutputFormat;
  extension?: OutputFormat;
  f?: OutputFormat;
  fl?: FlipValue;
  flip?: FlipValue;
  format?: OutputFormat;
  g?: GravityValue;
  gr?: GradientValue;
  gradient?: GradientValue;
  gravity?: GravityValue;
  h?: NumericValue;
  height?: NumericValue;
  hu?: NumericValue;
  hue?: NumericValue;
  icc?: ColorProfile;
  kcr?: BooleanLike;
  keep_copyright?: BooleanLike;
  l?: NumericValue;
  lightness?: NumericValue;
  mc?: ImageUrlColor | BooleanLike;
  mh?: NumericValue;
  "min-height"?: NumericValue;
  min_height?: NumericValue;
  "min-width"?: NumericValue;
  min_width?: NumericValue;
  monochrome?: ImageUrlColor | BooleanLike;
  mw?: NumericValue;
  neg?: NegateValue;
  negate?: NegateValue;
  norm?: NormalizeValue;
  normalise?: NormalizeValue;
  normalize?: NormalizeValue;
  padding?: PaddingValue;
  pd?: PaddingValue;
  pix?: NumericValue;
  pixelate?: NumericValue;
  progressive?: ProgressiveValue;
  q?: QualityValue;
  quality?: QualityValue;
  ra?: ResizingAlgorithm;
  resizing_algorithm?: ResizingAlgorithm;
  resizing_type?: ResizingType;
  rot?: RotateValue;
  rotate?: RotateValue;
  sa?: NumericValue;
  saturation?: NumericValue;
  scp?: BooleanLike;
  sh?: SharpenValue;
  sharpen?: SharpenValue;
  sm?: BooleanLike;
  strip_color_profile?: BooleanLike;
  strip_metadata?: BooleanLike;
  watermark?: WatermarkValue;
  watermark_offset?: WatermarkPositionValue;
  watermark_position?: WatermarkPositionValue;
  watermark_rotate?: RotateValue;
  watermark_shadow?: WatermarkShadowValue;
  watermark_size?: WatermarkSizeValue;
  watermark_text?: WatermarkTextValue;
  watermark_url?: WatermarkUrlValue;
  width?: NumericValue;
  wm?: WatermarkValue;
  wm_rot?: RotateValue;
  wmp?: WatermarkPositionValue;
  wmr?: RotateValue;
  wmsh?: WatermarkShadowValue;
  wms?: WatermarkSizeValue;
  wmt?: WatermarkTextValue;
  wmu?: WatermarkUrlValue;
  w?: NumericValue;
  z?: ZoomValue;
  zoom?: ZoomValue;
};

export type ImgwireImage = ImageSchema & {
  url(options?: ImageUrlOptions): string;
};

type CanonicalTransformName =
  | "adjust"
  | "background"
  | "background_alpha"
  | "blur"
  | "brightness"
  | "chroma_subsampling"
  | "color_profile"
  | "colorize"
  | "contrast"
  | "crop"
  | "dpi"
  | "dpr"
  | "duotone"
  | "enlarge"
  | "extend"
  | "extend_aspect_ratio"
  | "flip"
  | "format"
  | "gradient"
  | "gravity"
  | "height"
  | "hue"
  | "keep_copyright"
  | "lightness"
  | "min-height"
  | "min-width"
  | "monochrome"
  | "negate"
  | "normalize"
  | "padding"
  | "pixelate"
  | "progressive"
  | "quality"
  | "resizing_algorithm"
  | "resizing_type"
  | "rotate"
  | "saturation"
  | "sharpen"
  | "strip_color_profile"
  | "strip_metadata"
  | "watermark"
  | "watermark_position"
  | "watermark_rotate"
  | "watermark_shadow"
  | "watermark_size"
  | "watermark_text"
  | "watermark_url"
  | "width"
  | "zoom";

type JsonValue =
  | boolean
  | number
  | string
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

type UnknownRecord = Record<string, unknown>;

type TransformationEntry = {
  canonical: CanonicalTransformName;
  cacheValue: string;
};

type Rule = {
  aliases: readonly string[];
  canonical: CanonicalTransformName;
  parse: (
    value: unknown,
    canonical: CanonicalTransformName
  ) => TransformationEntry | null;
};

const GRAVITY_ALIASES = new Map<string, string>([
  ["n", "north"],
  ["s", "south"],
  ["e", "east"],
  ["w", "west"],
  ["ne", "northeast"],
  ["se", "southeast"],
  ["nw", "northwest"],
  ["sw", "southwest"],
  ["no", "north"],
  ["so", "south"],
  ["ea", "east"],
  ["we", "west"],
  ["noea", "northeast"],
  ["soea", "southeast"],
  ["nowe", "northwest"],
  ["sowe", "southwest"]
]);

const CANONICAL_GRAVITIES = new Set([
  "ce",
  "center",
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
  "attention",
  "entropy"
]);

const RESIZING_TYPE_ALIASES = new Map<string, string>([
  ["fit", "inside"],
  ["fill-down", "inside"],
  ["force", "fill"],
  ["auto", "inside"]
]);

const CANONICAL_RESIZING_TYPES = new Set([
  "cover",
  "contain",
  "fill",
  "inside",
  "outside"
]);

const WATERMARK_SOURCES = new Set<CanonicalTransformName>([
  "watermark",
  "watermark_text",
  "watermark_url"
]);

const WATERMARK_MODIFIERS = new Set<CanonicalTransformName>([
  "watermark_position",
  "watermark_rotate",
  "watermark_shadow",
  "watermark_size"
]);

const MAX_IMAGE_DIMENSION = 8192;
const MAX_TRANSFORM_MULTIPLIER = 10;
const MAX_WATERMARK_TEXT_CHARACTERS = 2048;

export class ImageUrlBuilder {
  constructor(private readonly image: ImageSchema) {}

  build(options: ImageUrlOptions = {}): string {
    const url = new URL(this.image.cdn_url);
    const entries = parseTransformationEntries(options);

    if (isPreset(options.preset)) {
      url.pathname = appendPresetToPath(url.pathname, options.preset);
    }

    if (entries.length === 0) {
      url.search = "";
      return url.toString();
    }

    entries.sort((left, right) =>
      left.canonical.localeCompare(right.canonical)
    );
    const searchParams = new URLSearchParams();
    for (const entry of entries) {
      searchParams.set(entry.canonical, entry.cacheValue);
    }
    url.search = searchParams.toString();
    return url.toString();
  }
}

export function extendImage(image: ImageSchema): ImgwireImage {
  const builder = new ImageUrlBuilder(image);
  return Object.assign(image, {
    url(options?: ImageUrlOptions) {
      return builder.build(options);
    }
  });
}

function parseTransformationEntries(
  options: ImageUrlOptions
): TransformationEntry[] {
  const entries: TransformationEntry[] = [];

  for (const rule of RULES) {
    const presentAliases = rule.aliases.filter((alias) =>
      Object.prototype.hasOwnProperty.call(options, alias)
    );
    if (presentAliases.length === 0) {
      continue;
    }
    if (presentAliases.length > 1) {
      throw new Error(`Duplicate transformation rule: ${rule.canonical}`);
    }

    try {
      const entry = rule.parse(
        (options as Record<string, unknown>)[presentAliases[0]],
        rule.canonical
      );
      if (entry) {
        entries.push(entry);
      }
    } catch {
      continue;
    }
  }

  return applyCrossRuleGuardrails(entries);
}

function applyCrossRuleGuardrails(
  entries: TransformationEntry[]
): TransformationEntry[] {
  const firstWatermarkSource = entries.find((entry) =>
    WATERMARK_SOURCES.has(entry.canonical)
  )?.canonical;

  return entries.filter((entry) => {
    if (
      WATERMARK_SOURCES.has(entry.canonical) &&
      entry.canonical !== firstWatermarkSource
    ) {
      return false;
    }

    if (WATERMARK_MODIFIERS.has(entry.canonical) && !firstWatermarkSource) {
      return false;
    }

    return true;
  });
}

function appendPresetToPath(pathname: string, preset: ImageUrlPreset): string {
  const slashIndex = pathname.lastIndexOf("/");
  const prefix = slashIndex >= 0 ? pathname.slice(0, slashIndex + 1) : "";
  const fileName = slashIndex >= 0 ? pathname.slice(slashIndex + 1) : pathname;

  if (fileName.length === 0) {
    throw new Error(
      "Cannot apply an image URL preset to a CDN url without a path."
    );
  }

  return `${prefix}${fileName}@${preset}`;
}

function isPreset(value: unknown): value is ImageUrlPreset {
  return (
    typeof value === "string" &&
    IMAGE_URL_PRESETS.includes(value as ImageUrlPreset)
  );
}

function createTransformation(
  canonical: CanonicalTransformName,
  cacheValue: string
): TransformationEntry {
  return { canonical, cacheValue };
}

function parseWidth(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseDimension(value, canonical))
  );
}

function parseHeight(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseDimension(value, canonical))
  );
}

function parseMinWidth(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseDimension(value, canonical))
  );
}

function parseMinHeight(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseDimension(value, canonical))
  );
}

function parseDpi(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseInteger(value, canonical, { min: 1, max: 600 }))
  );
}

function parseDpr(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseNumber(value, canonical, { min: 0.01, max: 8 }))
  );
}

function parseZoom(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const factor = parseNumber(objectValue.factor, canonical, {
      min: 1,
      max: MAX_TRANSFORM_MULTIPLIER
    });
    const gravity =
      objectValue.gravity === undefined
        ? undefined
        : normalizeGravity(objectValue.gravity, canonical);
    return createTransformation(
      canonical,
      gravity ? `${factor}:${gravity}` : String(factor)
    );
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length !== 1 && parts.length !== 2) {
    throw invalidValue(canonical);
  }

  const factor = parseNumber(parts[0], canonical, {
    min: 1,
    max: MAX_TRANSFORM_MULTIPLIER
  });
  if (parts.length === 1) {
    return createTransformation(canonical, String(factor));
  }

  return createTransformation(
    canonical,
    `${factor}:${normalizeGravity(parts[1], canonical)}`
  );
}

function parseResizingType(value: unknown, canonical: CanonicalTransformName) {
  const raw = stringifyValue(value, canonical).trim().toLowerCase();
  const resizingType = RESIZING_TYPE_ALIASES.get(raw) ?? raw;
  if (!CANONICAL_RESIZING_TYPES.has(resizingType)) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, resizingType);
}

function parseResizingAlgorithm(
  value: unknown,
  canonical: CanonicalTransformName
) {
  const raw = stringifyValue(value, canonical).trim().toLowerCase();
  if (!IMAGE_URL_RESIZING_ALGORITHMS.includes(raw as ResizingAlgorithm)) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, raw);
}

function parseEnlarge(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    parseBoolean(value, canonical) ? "true" : "false"
  );
}

function parseExtend(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      top: optionalInteger(objectValue.top, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      right: optionalInteger(objectValue.right, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      bottom: optionalInteger(objectValue.bottom, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      left: optionalInteger(objectValue.left, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      background:
        objectValue.background === undefined
          ? undefined
          : normalizeColorForJson(objectValue.background, canonical)
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 5) {
    throw invalidValue(canonical);
  }

  const normalizedParts = parts.map((part, index) =>
    index === 4
      ? normalizeColorForUrl(part, canonical)
      : String(
          parseInteger(part, canonical, {
            min: 0,
            max: MAX_IMAGE_DIMENSION
          })
        )
  );
  return createTransformation(canonical, normalizedParts.join(":"));
}

function parseExtendAspectRatio(
  value: unknown,
  canonical: CanonicalTransformName
) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    if (objectValue.width !== undefined && objectValue.height !== undefined) {
      const normalized = {
        height: parseNumber(objectValue.height, canonical, {
          min: 1,
          max: MAX_IMAGE_DIMENSION
        }),
        width: parseNumber(objectValue.width, canonical, {
          min: 1,
          max: MAX_IMAGE_DIMENSION
        })
      };
      return createTransformation(canonical, JSON.stringify(normalized));
    }

    const ratio = parseNumber(
      objectValue.ratio ?? objectValue.aspectRatio,
      canonical,
      { min: 0.01, max: MAX_IMAGE_DIMENSION }
    );
    return createTransformation(canonical, String(ratio));
  }

  const raw = stringifyValue(value, canonical);
  if (/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(raw)) {
    const [width, height] = raw
      .split(":")
      .map((part) =>
        parseNumber(part, canonical, { min: 1, max: MAX_IMAGE_DIMENSION })
      );
    return createTransformation(canonical, `${width}:${height}`);
  }

  return createTransformation(
    canonical,
    String(parseNumber(raw, canonical, { min: 0.01, max: MAX_IMAGE_DIMENSION }))
  );
}

function parseGravity(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    parseGravityParts(stringifyValue(value, canonical).split(":"), canonical)
  );
}

function parseCrop(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized =
      objectValue.x !== undefined || objectValue.y !== undefined
        ? compactObject({
            mode: "extract",
            x: parseInteger(objectValue.x, canonical, { min: 0 }),
            y: parseInteger(objectValue.y, canonical, { min: 0 }),
            width: parseDimension(objectValue.width, canonical),
            height: parseDimension(objectValue.height, canonical),
            gravity:
              objectValue.gravity === undefined
                ? undefined
                : normalizeGravity(objectValue.gravity, canonical)
          })
        : compactObject({
            width: parseDimension(objectValue.width, canonical),
            height: parseDimension(objectValue.height, canonical),
            gravity:
              objectValue.gravity === undefined
                ? undefined
                : normalizeGravity(objectValue.gravity, canonical)
          });
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length === 4 || parts.length === 5) {
    const [x, y, width, height, gravity] = parts;
    const normalized = [
      parseInteger(x, canonical, { min: 0 }),
      parseInteger(y, canonical, { min: 0 }),
      parseDimension(width, canonical),
      parseDimension(height, canonical)
    ].map(String);
    if (gravity !== undefined && gravity !== "") {
      normalized.push(normalizeGravity(gravity, canonical));
    }
    return createTransformation(canonical, normalized.join(":"));
  }

  if (parts.length !== 2 && parts.length !== 3) {
    throw invalidValue(canonical);
  }

  const [width, height, gravity] = parts;
  const normalized: Array<number | string> = [
    parseDimension(width, canonical),
    parseDimension(height, canonical)
  ].map(String);
  if (gravity !== undefined && gravity !== "") {
    normalized.push(normalizeGravity(gravity, canonical));
  }
  return createTransformation(canonical, normalized.join(":"));
}

function parsePadding(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      all: optionalInteger(objectValue.all, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      x: optionalInteger(objectValue.x, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      y: optionalInteger(objectValue.y, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      top: optionalInteger(objectValue.top, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      right: optionalInteger(objectValue.right, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      bottom: optionalInteger(objectValue.bottom, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      }),
      left: optionalInteger(objectValue.left, canonical, {
        min: 0,
        max: MAX_IMAGE_DIMENSION
      })
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 4) {
    throw invalidValue(canonical);
  }
  return createTransformation(
    canonical,
    parts
      .map((part) =>
        parseInteger(part, canonical, { min: 0, max: MAX_IMAGE_DIMENSION })
      )
      .join(":")
  );
}

function parseRotate(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      angle: parseInteger(objectValue.angle, canonical),
      background:
        objectValue.background === undefined
          ? undefined
          : normalizeColorForJson(objectValue.background, canonical)
    });
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length !== 1 && parts.length !== 2) {
    throw invalidValue(canonical);
  }

  const angle = parseInteger(parts[0], canonical);
  if (parts.length === 1) {
    return createTransformation(canonical, String(angle));
  }

  return createTransformation(
    canonical,
    `${angle}:${normalizeColorForUrl(parts[1], canonical)}`
  );
}

function parseFlip(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const horizontal =
      objectValue.horizontal === undefined
        ? false
        : parseBoolean(objectValue.horizontal, canonical);
    const vertical =
      objectValue.vertical === undefined
        ? false
        : parseBoolean(objectValue.vertical, canonical);
    return flipEntry(horizontal, vertical, canonical);
  }

  const raw = stringifyValue(value, canonical).trim().toLowerCase();
  if (raw === "vertical" || raw === "horizontal" || raw === "both") {
    return createTransformation(canonical, raw);
  }

  const parts = raw.split(":");
  if (parts.length !== 2) {
    throw invalidValue(canonical);
  }
  return flipEntry(
    parseBoolean(parts[0], canonical),
    parseBoolean(parts[1], canonical),
    canonical
  );
}

function flipEntry(
  horizontal: boolean,
  vertical: boolean,
  canonical: CanonicalTransformName
) {
  if (horizontal && vertical) {
    return createTransformation(canonical, "both");
  }
  if (horizontal) {
    return createTransformation(canonical, "horizontal");
  }
  if (vertical) {
    return createTransformation(canonical, "vertical");
  }
  return null;
}

function parseBackground(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    normalizeColorForUrl(value, canonical)
  );
}

function parseBackgroundAlpha(
  value: unknown,
  canonical: CanonicalTransformName
) {
  return createTransformation(
    canonical,
    String(parseNumber(value, canonical, { min: 0, max: 1 }))
  );
}

function parseBlur(value: unknown, canonical: CanonicalTransformName) {
  if (isTruthy(value, canonical)) {
    return createTransformation(canonical, "true");
  }
  if (isFalsy(value, canonical)) {
    return null;
  }
  return createTransformation(
    canonical,
    String(parseNumber(value, canonical, { min: 0.3, max: 100 }))
  );
}

function parseSharpen(value: unknown, canonical: CanonicalTransformName) {
  if (isTruthy(value, canonical)) {
    return createTransformation(canonical, "true");
  }
  if (isFalsy(value, canonical)) {
    return null;
  }

  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      sigma: optionalNumber(objectValue.sigma, canonical, { min: 0 }),
      m1: optionalNumber(objectValue.m1, canonical),
      m2: optionalNumber(objectValue.m2, canonical),
      x1: optionalNumber(objectValue.x1, canonical),
      y2: optionalNumber(objectValue.y2, canonical),
      y3: optionalNumber(objectValue.y3, canonical),
      flat: optionalNumber(objectValue.flat, canonical),
      jagged: optionalNumber(objectValue.jagged, canonical)
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  return createTransformation(
    canonical,
    String(parseNumber(value, canonical, { min: 0, minExclusive: true }))
  );
}

function parsePixelate(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(
    canonical,
    String(parseInteger(value, canonical, { min: 2, max: 256 }))
  );
}

function parseBooleanTransformation(
  value: unknown,
  canonical: CanonicalTransformName
) {
  return createTransformation(
    canonical,
    parseBoolean(value, canonical) ? "true" : "false"
  );
}

function parseQuality(value: unknown, canonical: CanonicalTransformName) {
  const raw = stringifyValue(value, canonical).trim().toLowerCase();
  if (raw === "auto") {
    return createTransformation(canonical, raw);
  }

  return createTransformation(
    canonical,
    String(parseInteger(raw, canonical, { min: 1, max: 100 }))
  );
}

function parseProgressive(value: unknown, canonical: CanonicalTransformName) {
  const raw = stringifyValue(value, canonical).trim().toLowerCase();
  if (raw === "auto") {
    return createTransformation(canonical, raw);
  }

  return createTransformation(
    canonical,
    parseBoolean(raw, canonical) ? "true" : "false"
  );
}

function parseChromaSubsampling(
  value: unknown,
  canonical: CanonicalTransformName
) {
  const raw = stringifyValue(value, canonical).trim().toLowerCase();
  if (!IMAGE_URL_CHROMA_SUBSAMPLING_VALUES.includes(raw as ChromaSubsampling)) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, raw);
}

function parseFormat(value: unknown, canonical: CanonicalTransformName) {
  const format = stringifyValue(value, canonical).trim().toLowerCase();
  if (!IMAGE_URL_OUTPUT_FORMATS.includes(format as OutputFormat)) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, format === "jpeg" ? "jpg" : format);
}

function parseSimpleNumber(
  value: unknown,
  canonical: CanonicalTransformName,
  min = 0.01,
  max = MAX_TRANSFORM_MULTIPLIER
) {
  return createTransformation(
    canonical,
    String(parseNumber(value, canonical, { min, max }))
  );
}

function parseHue(value: unknown, canonical: CanonicalTransformName) {
  return createTransformation(canonical, String(parseNumber(value, canonical)));
}

function parseAdjust(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      brightness: optionalNumber(objectValue.brightness, canonical, {
        min: 0.01,
        max: MAX_TRANSFORM_MULTIPLIER
      }),
      saturation: optionalNumber(objectValue.saturation, canonical, {
        min: 0.01,
        max: MAX_TRANSFORM_MULTIPLIER
      }),
      color: optionalNumber(objectValue.color, canonical, {
        min: 0.01,
        max: MAX_TRANSFORM_MULTIPLIER
      })
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 3) {
    throw invalidValue(canonical);
  }

  const normalized: Array<number | string> = [
    parseNumber(parts[0], canonical, {
      min: 0.01,
      max: MAX_TRANSFORM_MULTIPLIER
    })
  ];
  if (parts[1] !== undefined || parts[2] !== undefined) {
    normalized.push(
      parts[1] === undefined || parts[1] === ""
        ? ""
        : parseNumber(parts[1], canonical, {
            min: 0.01,
            max: MAX_TRANSFORM_MULTIPLIER
          })
    );
  }
  if (parts[2] !== undefined) {
    normalized.push(
      parts[2] === ""
        ? ""
        : parseNumber(parts[2], canonical, {
            min: 0.01,
            max: MAX_TRANSFORM_MULTIPLIER
          })
    );
  }
  return createTransformation(canonical, normalized.join(":"));
}

function parseColorProfile(value: unknown, canonical: CanonicalTransformName) {
  const profile = stringifyValue(value, canonical).trim().toLowerCase();
  if (!IMAGE_URL_COLOR_PROFILES.includes(profile as ColorProfile)) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, profile);
}

function parseContrast(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      multiplier: parseNumber(objectValue.multiplier, canonical, {
        min: 0.01,
        max: MAX_TRANSFORM_MULTIPLIER
      }),
      pivot: optionalNumber(objectValue.pivot, canonical, { min: 0, max: 255 })
    });
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length !== 1 && parts.length !== 2) {
    throw invalidValue(canonical);
  }

  const multiplier = parseNumber(parts[0], canonical, {
    min: 0.01,
    max: MAX_TRANSFORM_MULTIPLIER
  });
  if (parts.length === 1) {
    return createTransformation(canonical, String(multiplier));
  }

  return createTransformation(
    canonical,
    `${multiplier}:${parseNumber(parts[1], canonical, { min: 0, max: 255 })}`
  );
}

function parseDuotone(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = {
      shadowColor: normalizeColorForJson(objectValue.shadowColor, canonical),
      highlightColor: normalizeColorForJson(
        objectValue.highlightColor,
        canonical
      )
    };
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length !== 2) {
    throw invalidValue(canonical);
  }
  return createTransformation(
    canonical,
    `${normalizeColorForUrl(parts[0], canonical)}:${normalizeColorForUrl(
      parts[1],
      canonical
    )}`
  );
}

function parseGradient(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const colors =
      objectValue.colors === undefined
        ? undefined
        : parseColorArray(objectValue.colors, canonical);
    const normalized = compactObject({
      colors,
      angle: optionalNumber(objectValue.angle, canonical, {
        min: -360,
        max: 360
      }),
      opacity: optionalNumber(objectValue.opacity, canonical, {
        min: 0,
        max: 1
      }),
      blend: optionalNonEmptyString(objectValue.blend, canonical)
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const [colorsValue, angle, opacity, blend, ...extra] = stringifyValue(
    value,
    canonical
  ).split(":");
  if (extra.length > 0) {
    throw invalidValue(canonical);
  }

  const colors = colorsValue
    .split(",")
    .filter(Boolean)
    .map((color) => normalizeColorForUrl(color, canonical));
  if (colors.length === 0) {
    throw invalidValue(canonical);
  }

  const parts = [colors.join(",")];
  if (angle !== undefined || opacity !== undefined || blend !== undefined) {
    parts.push(
      angle === undefined || angle === ""
        ? ""
        : String(parseNumber(angle, canonical, { min: -360, max: 360 }))
    );
  }
  if (opacity !== undefined || blend !== undefined) {
    parts.push(
      opacity === undefined || opacity === ""
        ? ""
        : String(parseNumber(opacity, canonical, { min: 0, max: 1 }))
    );
  }
  if (blend !== undefined && blend !== "") {
    parts.push(blend);
  }
  return createTransformation(canonical, parts.join(":"));
}

function parseMonochrome(value: unknown, canonical: CanonicalTransformName) {
  if (isTruthy(value, canonical)) {
    return createTransformation(canonical, "true");
  }
  if (isFalsy(value, canonical)) {
    return null;
  }
  return createTransformation(
    canonical,
    normalizeColorForUrl(value, canonical)
  );
}

function parseNegate(value: unknown, canonical: CanonicalTransformName) {
  if (isTruthy(value, canonical)) {
    return createTransformation(canonical, "true");
  }
  if (isFalsy(value, canonical)) {
    return null;
  }

  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    return createTransformation(
      canonical,
      `alpha:${parseBoolean(objectValue.alpha, canonical) ? "true" : "false"}`
    );
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length !== 2 || parts[0] !== "alpha") {
    throw invalidValue(canonical);
  }
  return createTransformation(
    canonical,
    `alpha:${parseBoolean(parts[1], canonical) ? "true" : "false"}`
  );
}

function parseNormalize(value: unknown, canonical: CanonicalTransformName) {
  if (isTruthy(value, canonical) || isFalsy(value, canonical)) {
    return parseBooleanTransformation(value, canonical);
  }

  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const lower = parseNumber(objectValue.lower, canonical, {
      min: 0,
      max: 100
    });
    const upper = parseNumber(objectValue.upper, canonical, {
      min: 0,
      max: 100
    });
    if (lower >= upper) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, `${lower}:${upper}`);
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length !== 2) {
    throw invalidValue(canonical);
  }
  const lower = parseNumber(parts[0], canonical, { min: 0, max: 100 });
  const upper = parseNumber(parts[1], canonical, { min: 0, max: 100 });
  if (lower >= upper) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, `${lower}:${upper}`);
}

function parseWatermark(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const imageId = parseWatermarkImageId(
      objectValue.image_id ?? objectValue.imageId,
      canonical
    );
    const normalized = compactObject({
      image_id: imageId,
      gravity:
        objectValue.gravity === undefined
          ? undefined
          : normalizeGravity(objectValue.gravity, canonical),
      x: optionalInteger(objectValue.x, canonical),
      y: optionalInteger(objectValue.y, canonical),
      opacity: optionalNumber(objectValue.opacity, canonical, {
        min: 0,
        max: 1
      }),
      blend: optionalNonEmptyString(objectValue.blend, canonical)
    });
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 4) {
    throw invalidValue(canonical);
  }

  const [imageId, gravity, x, y] = parts;
  const normalized = [parseWatermarkImageId(imageId, canonical)];
  if (gravity !== undefined || x !== undefined || y !== undefined) {
    normalized.push(
      gravity === undefined || gravity === ""
        ? ""
        : normalizeGravity(gravity, canonical)
    );
  }
  if (x !== undefined || y !== undefined) {
    normalized.push(
      x === undefined || x === "" ? "" : String(parseInteger(x, canonical))
    );
  }
  if (y !== undefined && y !== "") {
    normalized.push(String(parseInteger(y, canonical)));
  }
  return createTransformation(canonical, normalized.join(":"));
}

function parseWatermarkPosition(
  value: unknown,
  canonical: CanonicalTransformName
) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      gravity:
        objectValue.gravity === undefined
          ? undefined
          : normalizeGravity(objectValue.gravity, canonical),
      x: optionalInteger(objectValue.x, canonical),
      y: optionalInteger(objectValue.y, canonical),
      left: optionalInteger(objectValue.left, canonical),
      top: optionalInteger(objectValue.top, canonical),
      opacity: optionalNumber(objectValue.opacity, canonical, {
        min: 0,
        max: 1
      }),
      blend: optionalNonEmptyString(objectValue.blend, canonical)
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 5) {
    throw invalidValue(canonical);
  }

  const [gravity, x, y, opacity, blend] = parts;
  const normalized = [normalizeGravity(gravity, canonical)];
  if (
    x !== undefined ||
    y !== undefined ||
    opacity !== undefined ||
    blend !== undefined
  ) {
    normalized.push(
      x === undefined || x === "" ? "" : String(parseInteger(x, canonical))
    );
  }
  if (y !== undefined || opacity !== undefined || blend !== undefined) {
    normalized.push(
      y === undefined || y === "" ? "" : String(parseInteger(y, canonical))
    );
  }
  if (opacity !== undefined || blend !== undefined) {
    normalized.push(
      opacity === undefined || opacity === ""
        ? ""
        : String(parseNumber(opacity, canonical, { min: 0, max: 1 }))
    );
  }
  if (blend !== undefined && blend !== "") {
    normalized.push(blend);
  }
  return createTransformation(canonical, normalized.join(":"));
}

function parseWatermarkShadow(
  value: unknown,
  canonical: CanonicalTransformName
) {
  if (isTruthy(value, canonical)) {
    return createTransformation(canonical, "true");
  }
  if (isFalsy(value, canonical)) {
    return null;
  }

  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      color:
        objectValue.color === undefined
          ? undefined
          : normalizeColorForJson(objectValue.color, canonical),
      blur: optionalNumber(objectValue.blur, canonical, { min: 0.3, max: 100 }),
      x: optionalInteger(objectValue.x, canonical),
      y: optionalInteger(objectValue.y, canonical)
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 4) {
    throw invalidValue(canonical);
  }

  const [color, blur, x, y] = parts;
  const normalized = [normalizeColorForUrl(color, canonical)];
  if (blur !== undefined || x !== undefined || y !== undefined) {
    normalized.push(
      blur === undefined || blur === ""
        ? ""
        : String(parseNumber(blur, canonical, { min: 0.3, max: 100 }))
    );
  }
  if (x !== undefined || y !== undefined) {
    normalized.push(
      x === undefined || x === "" ? "" : String(parseInteger(x, canonical))
    );
  }
  if (y !== undefined && y !== "") {
    normalized.push(String(parseInteger(y, canonical)));
  }
  return createTransformation(canonical, normalized.join(":"));
}

function parseWatermarkSize(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const normalized = compactObject({
      width: optionalInteger(objectValue.width, canonical, {
        min: 1,
        max: MAX_IMAGE_DIMENSION
      }),
      height: optionalInteger(objectValue.height, canonical, {
        min: 1,
        max: MAX_IMAGE_DIMENSION
      }),
      scale: optionalNumber(objectValue.scale, canonical, {
        min: 0.01,
        max: MAX_TRANSFORM_MULTIPLIER
      })
    });
    if (Object.keys(normalized).length === 0) {
      throw invalidValue(canonical);
    }
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  const parts = stringifyValue(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 3) {
    throw invalidValue(canonical);
  }

  const [width, height, scale] = parts;
  const normalized: string[] = [];
  if (width !== "") {
    normalized.push(String(parseDimension(width, canonical)));
  } else {
    normalized.push("");
  }
  if (height !== undefined || scale !== undefined) {
    normalized.push(
      height === undefined || height === ""
        ? ""
        : String(parseDimension(height, canonical))
    );
  }
  if (scale !== undefined) {
    normalized.push(
      scale === ""
        ? ""
        : String(
            parseNumber(scale, canonical, {
              min: 0.01,
              max: MAX_TRANSFORM_MULTIPLIER
            })
          )
    );
  }
  if (normalized.every((part) => part === "")) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, normalized.join(":"));
}

function parseWatermarkText(value: unknown, canonical: CanonicalTransformName) {
  const objectValue = objectValueOrNull(value, canonical);
  if (objectValue) {
    const text = parseWatermarkTextString(objectValue.text, canonical);
    const normalized = compactObject({
      text,
      font: optionalNonEmptyString(objectValue.font, canonical),
      size: optionalInteger(objectValue.size, canonical, { min: 1, max: 512 }),
      color:
        objectValue.color === undefined
          ? undefined
          : normalizeColorForJson(objectValue.color, canonical),
      width: optionalInteger(objectValue.width, canonical, {
        min: 1,
        max: MAX_IMAGE_DIMENSION
      }),
      height: optionalInteger(objectValue.height, canonical, {
        min: 1,
        max: MAX_IMAGE_DIMENSION
      }),
      align: optionalNonEmptyString(objectValue.align, canonical),
      gravity:
        objectValue.gravity === undefined
          ? undefined
          : normalizeGravity(objectValue.gravity, canonical),
      x: optionalInteger(objectValue.x, canonical),
      y: optionalInteger(objectValue.y, canonical),
      left: optionalInteger(objectValue.left, canonical),
      top: optionalInteger(objectValue.top, canonical),
      opacity: optionalNumber(objectValue.opacity, canonical, {
        min: 0,
        max: 1
      }),
      blend: optionalNonEmptyString(objectValue.blend, canonical)
    });
    return createTransformation(canonical, JSON.stringify(normalized));
  }

  return createTransformation(
    canonical,
    parseWatermarkTextString(value, canonical)
  );
}

function parseWatermarkUrl(value: unknown, canonical: CanonicalTransformName) {
  const raw =
    value instanceof URL ? value.toString() : stringifyValue(value, canonical);
  if (raw.trim() === "") {
    throw invalidValue(canonical);
  }

  if (isHttpsUrl(raw)) {
    return createTransformation(
      canonical,
      Buffer.from(raw, "utf8").toString("base64")
    );
  }

  const decoded = Buffer.from(raw, "base64").toString("utf8");
  if (!isHttpsUrl(decoded)) {
    throw invalidValue(canonical);
  }
  return createTransformation(canonical, raw);
}

function parseInteger(
  value: unknown,
  label: string,
  { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}
) {
  const raw = stringifyValue(value, label);
  if (!/^-?\d+$/.test(raw)) {
    throw invalidValue(label);
  }
  const parsedValue = Number.parseInt(raw, 10);
  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < min ||
    parsedValue > max
  ) {
    throw invalidValue(label);
  }
  return parsedValue;
}

function parseNumber(
  value: unknown,
  label: string,
  {
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    minExclusive = false
  } = {}
) {
  const raw = stringifyValue(value, label);
  if (raw.trim() === "") {
    throw invalidValue(label);
  }
  const parsedValue = Number(raw);
  if (
    !Number.isFinite(parsedValue) ||
    (minExclusive ? parsedValue <= min : parsedValue < min) ||
    parsedValue > max
  ) {
    throw invalidValue(label);
  }
  return parsedValue;
}

function parseDimension(value: unknown, label: string) {
  return parseInteger(value, label, { min: 1, max: MAX_IMAGE_DIMENSION });
}

function optionalInteger(
  value: unknown,
  label: string,
  options?: { max?: number; min?: number }
) {
  return value === undefined ? undefined : parseInteger(value, label, options);
}

function optionalNumber(
  value: unknown,
  label: string,
  options?: { max?: number; min?: number; minExclusive?: boolean }
) {
  return value === undefined ? undefined : parseNumber(value, label, options);
}

function parseBoolean(value: unknown, label: string) {
  if (typeof value === "boolean") {
    return value;
  }
  const raw = stringifyValue(value, label).trim().toLowerCase();
  if (["true", "t", "1", "yes", "on"].includes(raw)) {
    return true;
  }
  if (["false", "f", "0", "no", "off"].includes(raw)) {
    return false;
  }
  throw invalidValue(label);
}

function isTruthy(value: unknown, label: string) {
  try {
    return parseBoolean(value, label) === true;
  } catch {
    return false;
  }
}

function isFalsy(value: unknown, label: string) {
  try {
    return parseBoolean(value, label) === false;
  } catch {
    return false;
  }
}

function stringifyValue(value: unknown, label: string) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  throw invalidValue(label);
}

function objectValueOrNull(
  value: unknown,
  label: string
): UnknownRecord | null {
  if (isRecord(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!isRecord(parsed)) {
      throw invalidValue(label);
    }
    return parsed;
  } catch {
    throw invalidValue(label);
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeGravity(value: unknown, label: string) {
  const raw = stringifyValue(value, label).trim().toLowerCase();
  const normalized = GRAVITY_ALIASES.get(raw) ?? raw;
  if (!CANONICAL_GRAVITIES.has(normalized)) {
    throw invalidValue(label);
  }
  return normalized;
}

function parseGravityParts(parts: string[], label: string) {
  if (parts.length !== 1 && parts.length !== 2) {
    throw invalidValue(label);
  }

  if (parts.length === 2 && parts[1] === "sm") {
    return "attention";
  }

  if (parts.length === 2) {
    throw invalidValue(label);
  }

  return normalizeGravity(parts[0], label);
}

function normalizeColorForUrl(value: unknown, label: string) {
  if (isRecord(value)) {
    const color = normalizeColorObject(value, label);
    return color.alpha === undefined
      ? `${color.r}:${color.g}:${color.b}`
      : `${color.r}:${color.g}:${color.b}:${color.alpha}`;
  }

  const raw = stringifyValue(value, label);
  const parts = raw.split(":");
  if (parts.length === 3 || parts.length === 4) {
    const [r, g, b] = parts
      .slice(0, 3)
      .map((part) => parseInteger(part, label, { min: 0, max: 255 }));
    if (parts.length === 4) {
      const alpha = parseNumber(parts[3], label, { min: 0, max: 1 });
      return `${r}:${g}:${b}:${alpha}`;
    }
    return `${r}:${g}:${b}`;
  }

  return normalizeHexColor(raw, label);
}

function normalizeColorForJson(value: unknown, label: string): JsonValue {
  if (isRecord(value)) {
    return normalizeColorObject(value, label);
  }

  const raw = stringifyValue(value, label);
  const parts = raw.split(":");
  if (parts.length === 3 || parts.length === 4) {
    const color: { alpha?: number; b: number; g: number; r: number } = {
      r: parseInteger(parts[0], label, { min: 0, max: 255 }),
      g: parseInteger(parts[1], label, { min: 0, max: 255 }),
      b: parseInteger(parts[2], label, { min: 0, max: 255 })
    };
    if (parts.length === 4) {
      color.alpha = parseNumber(parts[3], label, { min: 0, max: 1 });
    }
    return color;
  }

  return `#${normalizeHexColor(raw, label)}`;
}

function normalizeColorObject(value: UnknownRecord, label: string) {
  return compactObject({
    r: parseInteger(value.r, label, { min: 0, max: 255 }),
    g: parseInteger(value.g, label, { min: 0, max: 255 }),
    b: parseInteger(value.b, label, { min: 0, max: 255 }),
    alpha: optionalNumber(value.alpha, label, { min: 0, max: 1 })
  }) as { alpha?: number; b: number; g: number; r: number };
}

function normalizeHexColor(value: string, label: string) {
  const hexColor = value.startsWith("#") ? value.slice(1) : value;
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hexColor)) {
    throw invalidValue(label);
  }
  return hexColor.toLowerCase();
}

function parseColorArray(value: unknown, label: string) {
  if (!Array.isArray(value) || value.length === 0) {
    throw invalidValue(label);
  }
  return value.map((color) => normalizeColorForJson(color, label));
}

function parseWatermarkImageId(value: unknown, label: string) {
  const imageId = stringifyValue(value, label);
  if (!imageId || imageId.includes(":") || imageId.includes("/")) {
    throw invalidValue(label);
  }
  return imageId;
}

function parseWatermarkTextString(value: unknown, label: string) {
  const text = stringifyValue(value, label);
  if (text.length === 0 || text.length > MAX_WATERMARK_TEXT_CHARACTERS) {
    throw invalidValue(label);
  }
  return text;
}

function optionalNonEmptyString(value: unknown, label: string) {
  if (value === undefined) {
    return undefined;
  }
  const raw = stringifyValue(value, label);
  if (raw === "") {
    throw invalidValue(label);
  }
  return raw;
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  ) as {
    [K in keyof T as undefined extends T[K] ? K : K]: Exclude<T[K], undefined>;
  };
}

function invalidValue(label: string) {
  return new Error(`Invalid transformation rule value for ${label}`);
}

const RULES: Rule[] = [
  { canonical: "adjust", aliases: ["a", "adjust"], parse: parseAdjust },
  {
    canonical: "background",
    aliases: ["bg", "background"],
    parse: parseBackground
  },
  {
    canonical: "background_alpha",
    aliases: ["bga", "background_alpha"],
    parse: parseBackgroundAlpha
  },
  { canonical: "blur", aliases: ["bl", "blur"], parse: parseBlur },
  {
    canonical: "brightness",
    aliases: ["br", "brightness"],
    parse: (value, canonical) => parseSimpleNumber(value, canonical)
  },
  {
    canonical: "color_profile",
    aliases: ["cp", "icc", "color_profile"],
    parse: parseColorProfile
  },
  {
    canonical: "chroma_subsampling",
    aliases: ["chroma_subsampling"],
    parse: parseChromaSubsampling
  },
  {
    canonical: "colorize",
    aliases: ["col", "colorize"],
    parse: parseBackground
  },
  { canonical: "contrast", aliases: ["co", "contrast"], parse: parseContrast },
  { canonical: "crop", aliases: ["c", "crop"], parse: parseCrop },
  { canonical: "dpi", aliases: ["dpi"], parse: parseDpi },
  { canonical: "dpr", aliases: ["dpr"], parse: parseDpr },
  { canonical: "duotone", aliases: ["dt", "duotone"], parse: parseDuotone },
  { canonical: "enlarge", aliases: ["el", "enlarge"], parse: parseEnlarge },
  { canonical: "extend", aliases: ["ex", "extend"], parse: parseExtend },
  {
    canonical: "extend_aspect_ratio",
    aliases: ["exar", "extend_ar", "extend_aspect_ratio"],
    parse: parseExtendAspectRatio
  },
  { canonical: "flip", aliases: ["fl", "flip"], parse: parseFlip },
  {
    canonical: "format",
    aliases: ["f", "format", "ext", "extension"],
    parse: parseFormat
  },
  { canonical: "gradient", aliases: ["gr", "gradient"], parse: parseGradient },
  { canonical: "gravity", aliases: ["g", "gravity"], parse: parseGravity },
  { canonical: "height", aliases: ["h", "height"], parse: parseHeight },
  { canonical: "hue", aliases: ["hu", "hue"], parse: parseHue },
  {
    canonical: "keep_copyright",
    aliases: ["kcr", "keep_copyright"],
    parse: parseBooleanTransformation
  },
  {
    canonical: "lightness",
    aliases: ["l", "lightness"],
    parse: (value, canonical) => parseSimpleNumber(value, canonical)
  },
  {
    canonical: "min-height",
    aliases: ["mh", "min_height", "min-height"],
    parse: parseMinHeight
  },
  {
    canonical: "min-width",
    aliases: ["mw", "min_width", "min-width"],
    parse: parseMinWidth
  },
  {
    canonical: "monochrome",
    aliases: ["mc", "monochrome"],
    parse: parseMonochrome
  },
  { canonical: "negate", aliases: ["neg", "negate"], parse: parseNegate },
  {
    canonical: "normalize",
    aliases: ["norm", "normalise", "normalize"],
    parse: parseNormalize
  },
  { canonical: "padding", aliases: ["pd", "padding"], parse: parsePadding },
  { canonical: "pixelate", aliases: ["pix", "pixelate"], parse: parsePixelate },
  {
    canonical: "progressive",
    aliases: ["progressive"],
    parse: parseProgressive
  },
  { canonical: "quality", aliases: ["q", "quality"], parse: parseQuality },
  {
    canonical: "resizing_algorithm",
    aliases: ["ra", "resizing_algorithm"],
    parse: parseResizingAlgorithm
  },
  {
    canonical: "resizing_type",
    aliases: ["resizing_type"],
    parse: parseResizingType
  },
  { canonical: "rotate", aliases: ["rot", "rotate"], parse: parseRotate },
  {
    canonical: "saturation",
    aliases: ["sa", "saturation"],
    parse: (value, canonical) => parseSimpleNumber(value, canonical)
  },
  { canonical: "sharpen", aliases: ["sh", "sharpen"], parse: parseSharpen },
  {
    canonical: "strip_color_profile",
    aliases: ["scp", "strip_color_profile"],
    parse: parseBooleanTransformation
  },
  {
    canonical: "strip_metadata",
    aliases: ["sm", "strip_metadata"],
    parse: parseBooleanTransformation
  },
  {
    canonical: "watermark",
    aliases: ["wm", "watermark"],
    parse: parseWatermark
  },
  {
    canonical: "watermark_position",
    aliases: ["wmp", "watermark_offset", "watermark_position"],
    parse: parseWatermarkPosition
  },
  {
    canonical: "watermark_rotate",
    aliases: ["wmr", "wm_rot", "watermark_rotate"],
    parse: parseRotate
  },
  {
    canonical: "watermark_shadow",
    aliases: ["wmsh", "watermark_shadow"],
    parse: parseWatermarkShadow
  },
  {
    canonical: "watermark_size",
    aliases: ["wms", "watermark_size"],
    parse: parseWatermarkSize
  },
  {
    canonical: "watermark_text",
    aliases: ["wmt", "watermark_text"],
    parse: parseWatermarkText
  },
  {
    canonical: "watermark_url",
    aliases: ["wmu", "watermark_url"],
    parse: parseWatermarkUrl
  },
  { canonical: "width", aliases: ["w", "width"], parse: parseWidth },
  { canonical: "zoom", aliases: ["z", "zoom"], parse: parseZoom }
];

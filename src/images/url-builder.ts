import type { ImageSchema } from "../../generated/model/imageSchema.ts";

export const IMAGE_URL_PRESETS = [
  "thumbnail",
  "small",
  "medium",
  "large"
] as const;

export const IMAGE_URL_GRAVITY_TYPES = [
  "no",
  "so",
  "ea",
  "we",
  "noea",
  "nowe",
  "soea",
  "sowe",
  "ce"
] as const;

export const IMAGE_URL_RESIZING_TYPES = [
  "fit",
  "fill",
  "fill-down",
  "force",
  "auto"
] as const;

export const IMAGE_URL_OUTPUT_FORMATS = [
  "auto",
  "jpg",
  "png",
  "avif",
  "gif",
  "webp"
] as const;

export const IMAGE_URL_ROTATE_ANGLES = [0, 90, 180, 270, 360] as const;

export type ImageUrlPreset = (typeof IMAGE_URL_PRESETS)[number];
export type GravityType = (typeof IMAGE_URL_GRAVITY_TYPES)[number];
export type ResizingType = (typeof IMAGE_URL_RESIZING_TYPES)[number];
export type OutputFormat = (typeof IMAGE_URL_OUTPUT_FORMATS)[number];
export type RotateAngle = (typeof IMAGE_URL_ROTATE_ANGLES)[number];
export type BooleanString = "true" | "false" | "t" | "f" | "1" | "0";
export type BooleanLike = boolean | BooleanString;

export type GravityValue =
  | GravityType
  | `${GravityType}:sm`
  | `${GravityType}:${number}:${number}`;

export type CropValue =
  | `${number}:${number}`
  | `${number}:${number}:${GravityValue}`;
export type ExtendValue =
  | "true"
  | "false"
  | `true:${Exclude<GravityValue, `${string}:sm`>}`;
export type FlipValue = `${BooleanString}:${BooleanString}`;
export type PaddingValue =
  | `${number}`
  | `${number}:${number}`
  | `${number}:${number}:${number}`
  | `${number}:${number}:${number}:${number}`;

export type ImageUrlOptions = {
  preset?: ImageUrlPreset;
  background?: string;
  bg?: string;
  blur?: number;
  bl?: number;
  crop?: CropValue;
  c?: CropValue;
  dpr?: number;
  enlarge?: BooleanLike;
  el?: BooleanLike;
  extend?: ExtendValue;
  ex?: ExtendValue;
  extend_aspect_ratio?: ExtendValue;
  extend_ar?: ExtendValue;
  exar?: ExtendValue;
  flip?: FlipValue;
  fl?: FlipValue;
  format?: OutputFormat;
  f?: OutputFormat;
  extension?: OutputFormat;
  ext?: OutputFormat;
  gravity?: GravityValue;
  g?: GravityValue;
  height?: number;
  h?: number;
  keep_copyright?: BooleanLike;
  kcr?: BooleanLike;
  "min-height"?: number;
  mh?: number;
  "min-width"?: number;
  mw?: number;
  padding?: PaddingValue;
  pd?: PaddingValue;
  pixelate?: number;
  pix?: number;
  quality?: number;
  q?: number;
  resizing_type?: ResizingType;
  rotate?: RotateAngle;
  rot?: RotateAngle;
  sharpen?: number;
  sh?: number;
  strip_color_profile?: BooleanLike;
  scp?: BooleanLike;
  strip_metadata?: BooleanLike;
  sm?: BooleanLike;
  width?: number;
  w?: number;
  zoom?: number;
  z?: number;
};

export type ImgwireImage = ImageSchema & {
  url(options?: ImageUrlOptions): string;
};

type TransformationEntry = {
  canonical: string;
  cacheValue: string;
};

type Rule = {
  aliases: readonly string[];
  canonical: string;
  parse: (value: unknown, canonical: string) => TransformationEntry | null;
};

export class ImageUrlBuilder {
  constructor(private readonly image: ImageSchema) {}

  build(options: ImageUrlOptions = {}): string {
    const url = new URL(this.image.cdn_url);
    const entries = parseTransformationEntries(options);

    if (options.preset) {
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
  const seenCanonicals = new Set<string>();

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

    if (seenCanonicals.has(rule.canonical)) {
      throw new Error(`Duplicate transformation rule: ${rule.canonical}`);
    }
    seenCanonicals.add(rule.canonical);

    const entry = rule.parse(
      (options as Record<string, unknown>)[presentAliases[0]],
      rule.canonical
    );
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
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

function createTransformation(
  canonical: string,
  cacheValue: string
): TransformationEntry {
  return { canonical, cacheValue };
}

function parseWidth(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveInteger(value, canonical))
  );
}

function parseHeight(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveInteger(value, canonical))
  );
}

function parseResizingType(value: unknown, canonical: string) {
  const resizingType = parseString(value, canonical);
  if (!IMAGE_URL_RESIZING_TYPES.includes(resizingType as ResizingType)) {
    throw new Error(`Invalid transformation rule value for ${canonical}`);
  }
  return createTransformation(canonical, resizingType);
}

function parseMinWidth(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveInteger(value, canonical))
  );
}

function parseMinHeight(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveInteger(value, canonical))
  );
}

function parseZoom(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveNumber(value, canonical))
  );
}

function parseDpr(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveNumber(value, canonical))
  );
}

function parseEnlarge(value: unknown, canonical: string) {
  return parseBoolean(value, canonical)
    ? createTransformation(canonical, "true")
    : null;
}

function parseExtend(value: unknown, canonical: string) {
  return parseExtendLike(value, canonical);
}

function parseExtendAspectRatio(value: unknown, canonical: string) {
  return parseExtendLike(value, canonical);
}

function parseExtendLike(value: unknown, canonical: string) {
  const raw = parseString(value, canonical);
  const [rawExtend, ...rawGravityParts] = raw.split(":");
  const extend = parseBoolean(rawExtend, canonical);
  if (rawGravityParts.length > 0) {
    parseGravityParts(rawGravityParts, canonical, { allowSmart: false });
  }
  if (!extend) {
    return null;
  }
  const gravity =
    rawGravityParts.length > 0
      ? parseGravityParts(rawGravityParts, canonical, { allowSmart: false })
      : "";
  return createTransformation(canonical, gravity ? `true:${gravity}` : "true");
}

function parseGravity(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    parseGravityParts(parseString(value, canonical).split(":"), canonical)
  );
}

function parseCrop(value: unknown, canonical: string) {
  const raw = parseString(value, canonical);
  const [rawWidth, rawHeight, ...rawGravityParts] = raw.split(":");
  const width = parsePositiveNumber(rawWidth ?? "", canonical);
  const height = parsePositiveNumber(rawHeight ?? "", canonical);
  const gravity =
    rawGravityParts.length > 0
      ? parseGravityParts(rawGravityParts, canonical)
      : "ce:0:0";
  return createTransformation(canonical, `${width}:${height}:${gravity}`);
}

function parsePadding(value: unknown, canonical: string) {
  const parts = parseString(value, canonical).split(":");
  if (parts.length < 1 || parts.length > 4) {
    throw new Error(`Invalid transformation rule value for ${canonical}`);
  }
  return createTransformation(
    canonical,
    parts.map((part) => parseNonNegativeNumber(part, canonical)).join(":")
  );
}

function parseRotate(value: unknown, canonical: string) {
  const rotate = parseInteger(value, canonical, { min: 0, max: 360 });
  if (!IMAGE_URL_ROTATE_ANGLES.includes(rotate as RotateAngle)) {
    throw new Error(`Invalid transformation rule value for ${canonical}`);
  }
  return createTransformation(canonical, String(rotate));
}

function parseFlip(value: unknown, canonical: string) {
  const parts = parseString(value, canonical).split(":");
  if (parts.length !== 2) {
    throw new Error(`Invalid transformation rule value for ${canonical}`);
  }
  return createTransformation(
    canonical,
    parts
      .map((part) => serializeBoolean(parseBoolean(part, canonical)))
      .join(":")
  );
}

function parseBackground(value: unknown, canonical: string) {
  const raw = parseString(value, canonical);
  const parts = raw.split(":");
  if (parts.length === 3) {
    return createTransformation(
      canonical,
      parts
        .map((part) => parseInteger(part, canonical, { min: 0, max: 255 }))
        .join(":")
    );
  }
  const hexColor = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hexColor)) {
    throw new Error(`Invalid transformation rule value for ${canonical}`);
  }
  return createTransformation(canonical, hexColor.toLowerCase());
}

function parseBlur(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parseNonNegativeNumber(value, canonical))
  );
}

function parseSharpen(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parseNonNegativeNumber(value, canonical))
  );
}

function parsePixelate(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parsePositiveNumber(value, canonical))
  );
}

function parseBooleanTransformation(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    parseBoolean(value, canonical) ? "true" : "false"
  );
}

function parseQuality(value: unknown, canonical: string) {
  return createTransformation(
    canonical,
    String(parseInteger(value, canonical, { min: 0, max: 100 }))
  );
}

function parseFormat(value: unknown, canonical: string) {
  const format = parseString(value, canonical).toLowerCase();
  if (!IMAGE_URL_OUTPUT_FORMATS.includes(format as OutputFormat)) {
    throw new Error(`Invalid transformation rule value for ${canonical}`);
  }
  return createTransformation(canonical, format);
}

function parseInteger(
  value: unknown,
  label: string,
  { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}
) {
  const raw = stringifyValue(value, label);
  if (!/^-?\d+$/.test(raw)) {
    throw new Error(`Invalid transformation rule value for ${label}`);
  }
  const parsedValue = Number.parseInt(raw, 10);
  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < min ||
    parsedValue > max
  ) {
    throw new Error(`Invalid transformation rule value for ${label}`);
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
    throw new Error(`Invalid transformation rule value for ${label}`);
  }
  const parsedValue = Number(raw);
  if (
    !Number.isFinite(parsedValue) ||
    (minExclusive ? parsedValue <= min : parsedValue < min) ||
    parsedValue > max
  ) {
    throw new Error(`Invalid transformation rule value for ${label}`);
  }
  return parsedValue;
}

function parsePositiveInteger(value: unknown, label: string) {
  return parseInteger(value, label, { min: 1 });
}

function parseNonNegativeNumber(value: unknown, label: string) {
  return parseNumber(value, label, { min: 0 });
}

function parsePositiveNumber(value: unknown, label: string) {
  return parseNumber(value, label, { min: 0, minExclusive: true });
}

function parseBoolean(value: unknown, label: string) {
  if (typeof value === "boolean") {
    return value;
  }
  const raw = stringifyValue(value, label).toLowerCase();
  if (["true", "t", "1"].includes(raw)) {
    return true;
  }
  if (["false", "f", "0"].includes(raw)) {
    return false;
  }
  throw new Error(`Invalid transformation rule value for ${label}`);
}

function serializeBoolean(value: boolean) {
  return value ? "t" : "f";
}

function parseString(value: unknown, label: string) {
  return stringifyValue(value, label);
}

function stringifyValue(value: unknown, label: string) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  throw new Error(`Invalid transformation rule value for ${label}`);
}

function parseGravityParts(
  parts: string[],
  label: string,
  { allowSmart = true } = {}
) {
  if (parts.length !== 1 && parts.length !== 2 && parts.length !== 3) {
    throw new Error(`Invalid transformation rule value for ${label}`);
  }
  const [gravityType, firstOffset, secondOffset] = parts;
  if (!IMAGE_URL_GRAVITY_TYPES.includes(gravityType as GravityType)) {
    throw new Error(`Invalid transformation rule value for ${label}`);
  }
  if (parts.length === 1) {
    return gravityType;
  }
  if (parts.length === 2) {
    if (!allowSmart || firstOffset !== "sm") {
      throw new Error(`Invalid transformation rule value for ${label}`);
    }
    return `${gravityType}:sm`;
  }
  parseInteger(firstOffset, label);
  parseInteger(secondOffset, label);
  return `${gravityType}:${firstOffset}:${secondOffset}`;
}

const RULES: Rule[] = [
  {
    canonical: "background",
    aliases: ["bg", "background"],
    parse: parseBackground
  },
  { canonical: "blur", aliases: ["bl", "blur"], parse: parseBlur },
  { canonical: "crop", aliases: ["c", "crop"], parse: parseCrop },
  { canonical: "dpr", aliases: ["dpr"], parse: parseDpr },
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
  { canonical: "gravity", aliases: ["g", "gravity"], parse: parseGravity },
  { canonical: "height", aliases: ["h", "height"], parse: parseHeight },
  {
    canonical: "keep_copyright",
    aliases: ["kcr", "keep_copyright"],
    parse: parseBooleanTransformation
  },
  {
    canonical: "min-height",
    aliases: ["mh", "min-height"],
    parse: parseMinHeight
  },
  {
    canonical: "min-width",
    aliases: ["mw", "min-width"],
    parse: parseMinWidth
  },
  { canonical: "padding", aliases: ["pd", "padding"], parse: parsePadding },
  { canonical: "pixelate", aliases: ["pix", "pixelate"], parse: parsePixelate },
  { canonical: "quality", aliases: ["q", "quality"], parse: parseQuality },
  {
    canonical: "resizing_type",
    aliases: ["resizing_type"],
    parse: parseResizingType
  },
  { canonical: "rotate", aliases: ["rot", "rotate"], parse: parseRotate },
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
  { canonical: "width", aliases: ["w", "width"], parse: parseWidth },
  { canonical: "zoom", aliases: ["z", "zoom"], parse: parseZoom }
];

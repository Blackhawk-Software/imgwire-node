import type { ReadStream } from "node:fs";
import type { Readable } from "node:stream";

import type { StandardUploadCreateSchema } from "../../generated/model/standardUploadCreateSchema.ts";
import type { UploadViaUrlCreateSchema } from "../../generated/model/uploadViaUrlCreateSchema.ts";

export type UploadBody = Buffer | Readable | ReadStream;
export type UploadMimeType =
  | StandardUploadCreateSchema["mime_type"]
  | (string & {});
export type UploadViaUrlMimeType =
  | UploadViaUrlCreateSchema["mime_type"]
  | (string & {});

export type UploadInput = {
  contentLength?: number;
  customMetadata?: StandardUploadCreateSchema["custom_metadata"];
  file: UploadBody;
  fileName?: string;
  hashSha256?: string | null;
  idempotencyKey?: string | null;
  mimeType?: UploadMimeType;
  purpose?: string | null;
};

export type ResolvedUploadInput = {
  body: UploadBody;
  contentLength: number;
  fileName: string;
  mimeType?: StandardUploadCreateSchema["mime_type"];
  metadata: Omit<StandardUploadCreateSchema, "file_name" | "mime_type">;
};

export type UploadViaUrlInput = {
  customMetadata?: UploadViaUrlCreateSchema["custom_metadata"];
  fileName?: string | null;
  idempotencyKey?: string | null;
  mimeType?: UploadViaUrlMimeType;
  purpose?: string | null;
  url: string | URL;
};

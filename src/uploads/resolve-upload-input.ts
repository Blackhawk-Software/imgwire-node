import { basename } from "node:path";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";

import type { ResolvedUploadInput, UploadInput } from "./types.ts";

export async function resolveUploadInput(
  input: UploadInput
): Promise<ResolvedUploadInput> {
  if (Buffer.isBuffer(input.file)) {
    return {
      body: input.file,
      contentLength: input.contentLength ?? input.file.byteLength,
      fileName: input.fileName ?? "upload.bin",
      mimeType: normalizeMimeType(input.mimeType),
      metadata: buildMetadata(
        input,
        input.contentLength ?? input.file.byteLength
      )
    };
  }

  if (isFsReadStream(input.file)) {
    const filePath =
      typeof input.file.path === "string" ? input.file.path : null;
    const stats = filePath ? await stat(filePath) : null;

    return {
      body: input.file,
      contentLength:
        input.contentLength ?? stats?.size ?? requiredContentLength(),
      fileName:
        input.fileName ?? (filePath ? basename(filePath) : "upload.bin"),
      mimeType: normalizeMimeType(input.mimeType),
      metadata: buildMetadata(
        input,
        input.contentLength ?? stats?.size ?? requiredContentLength()
      )
    };
  }

  if (input.file instanceof Readable) {
    const contentLength = input.contentLength ?? requiredContentLength();
    return {
      body: input.file,
      contentLength,
      fileName: input.fileName ?? "upload.bin",
      mimeType: normalizeMimeType(input.mimeType),
      metadata: buildMetadata(input, contentLength)
    };
  }

  throw new Error("Unsupported upload input.");
}

function buildMetadata(input: UploadInput, contentLength: number) {
  return {
    content_length: contentLength,
    custom_metadata: input.customMetadata,
    hash_sha256: input.hashSha256,
    idempotency_key: input.idempotencyKey,
    purpose: input.purpose
  };
}

function isFsReadStream(
  value: UploadInput["file"]
): value is import("node:fs").ReadStream {
  return (
    value instanceof Readable &&
    "path" in value &&
    (typeof value.path === "string" || Buffer.isBuffer(value.path))
  );
}

function normalizeMimeType(
  mimeType: UploadInput["mimeType"]
): import("../../generated/model/standardUploadCreateSchema.ts").StandardUploadCreateSchema["mime_type"] {
  return mimeType as import("../../generated/model/standardUploadCreateSchema.ts").StandardUploadCreateSchema["mime_type"];
}

function requiredContentLength(): never {
  throw new Error(
    "Upload streams must provide contentLength when the stream size cannot be inferred."
  );
}

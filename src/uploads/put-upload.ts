import { Readable } from "node:stream";

import { resolveFetch } from "../http/fetch.ts";
import type { ImgwireClientOptions } from "../client/types.ts";
import type { UploadBody } from "./types.ts";

export async function putUpload(
  url: string,
  body: UploadBody,
  options: {
    contentLength: number;
    contentType?: string | null;
    fetch?: ImgwireClientOptions["fetch"];
    timeoutMs?: number;
  }
): Promise<void> {
  const fetchApi = resolveFetch(options.fetch);
  const controller = new AbortController();
  const timeout = createTimeout(controller, options.timeoutMs);

  try {
    const response = await fetchApi(url, {
      method: "PUT",
      body: body as BodyInit,
      headers: {
        "Content-Length": String(options.contentLength),
        ...(options.contentType ? { "Content-Type": options.contentType } : {})
      },
      signal: controller.signal,
      ...(body instanceof Readable ? ({ duplex: "half" } as const) : {})
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}.`);
    }
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

function createTimeout(
  controller: AbortController,
  timeoutMs?: number
): NodeJS.Timeout | undefined {
  if (!timeoutMs) {
    return undefined;
  }

  return setTimeout(() => {
    controller.abort(new Error(`Upload timed out after ${timeoutMs}ms.`));
  }, timeoutMs);
}

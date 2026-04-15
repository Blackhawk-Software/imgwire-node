import http from "node:http";
import { once } from "node:events";

export type CapturedRequest = {
  body: string;
  headers: http.IncomingHttpHeaders;
  method: string;
  url: string;
};

export async function withServer(
  handler: (
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) => Promise<void> | void
): Promise<{
  close: () => Promise<void>;
  origin: string;
}> {
  const server = http.createServer((request, response) => {
    void Promise.resolve(handler(request, response)).catch((error: unknown) => {
      response.statusCode = 500;
      response.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error)
        })
      );
    });
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to start test server.");
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: async () => {
      server.close();
      await once(server, "close");
    }
  };
}

export async function readRequestBody(
  request: http.IncomingMessage
): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

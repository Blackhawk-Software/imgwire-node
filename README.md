![imgwire.dev Logo](https://cdn.imgwire.dev/6b024480-a5ac-426d-b539-2e4fccc4c6ac/26f80c13-48bd-4bb9-866e-5e9392b11a6a/4ba5fe50-433b-40db-a847-938d2081c21a?w=280&quality=80)

# `@imgwire/node`

[![npm version](https://img.shields.io/npm/v/%40imgwire%2Fnode)](https://www.npmjs.com/package/@imgwire/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/Blackhawk-Software/imgwire-node/actions/workflows/ci.yml/badge.svg)](https://github.com/Blackhawk-Software/imgwire-node/actions/workflows/ci.yml)
[![Release](https://github.com/Blackhawk-Software/imgwire-node/actions/workflows/release.yml/badge.svg)](https://github.com/Blackhawk-Software/imgwire-node/actions/workflows/release.yml)

`@imgwire/node` is the server-first TypeScript SDK for the imgwire API.

Use it in backend services, jobs, and server runtimes to authenticate with a Server API Key, upload files from Node streams or buffers, manage server-side resources, and call the imgwire API without hand-writing request plumbing.

> [!TIP]
> Obtain an API key by signing up at [imgwire.dev](https://imgwire.dev). Read the full API & SDK documentation [here](https://docs.imgwire.dev/guides/backend-quickstart).

## Installation

```bash
yarn add @imgwire/node
```

## Quick Start

```ts
import fs from "node:fs";
import { ImgwireClient } from "@imgwire/node";

const client = new ImgwireClient({
  apiKey: process.env.IMGWIRE_API_KEY!
});

const image = await client.images.upload({
  file: fs.createReadStream("hero.jpg"),
  mimeType: "image/jpeg"
});

console.log(image.id);
console.log(image.url({ preset: "thumbnail" }));
```

## Client Setup

Create a client with your server key:

```ts
import { ImgwireClient } from "@imgwire/node";

const client = new ImgwireClient({
  apiKey: "sk_..."
});
```

Optional configuration:

```ts
const client = new ImgwireClient({
  apiKey: "sk_...",
  baseUrl: "https://api.imgwire.dev",
  timeoutMs: 10_000,
  maxRetries: 2,
  retryDelayMs: 250,
  logger: {
    debug(message, context) {
      console.debug(message, context);
    },
    warn(message, context) {
      console.warn(message, context);
    }
  }
});
```

## Resources

The current handwritten SDK surface exposes these grouped resources:

- `client.images`
- `client.customDomain`
- `client.corsOrigins`
- `client.metrics`

### `client.images`

Image operations and upload workflows.

Returned image records expose `image.url(...)` so your backend can generate imgwire transformation URLs without reimplementing CDN path and query rules.

Supported methods:

- `list({ limit, page })`
- `listPages({ limit, page })`
- `listAll({ limit, page })`
- `retrieve(imageId)`
- `create(body, { uploadToken? })`
- `upload({ file, fileName?, mimeType?, contentLength?, ... })`
- `createUploadToken()`
- `createBulkDownloadJob({ image_ids })`
- `retrieveBulkDownloadJob(imageDownloadJobId)`
- `bulkDelete({ image_ids })`
- `delete(imageId)`

List images:

```ts
const result = await client.images.list({
  limit: 25,
  page: 1
});

console.log(result.data);
console.log(result.pagination.totalCount);
```

Iterate page-by-page:

```ts
for await (const page of client.images.listPages({ limit: 100 })) {
  console.log(page.pagination.page, page.data.length);
}
```

Iterate every image record:

```ts
for await (const image of client.images.listAll({ limit: 100 })) {
  console.log(image.id);
  console.log(image.url({ preset: "small" }));
}
```

Retrieve an image by id:

```ts
const image = await client.images.retrieve("img_123");

const transformedUrl = image.url({
  width: 300,
  height: 300
});
```

Create a standard upload intent directly:

```ts
const upload = await client.images.create({
  file_name: "hero.png",
  mime_type: "image/png",
  content_length: 1024
});

console.log(upload.upload_url);
```

Upload from a `Buffer`:

```ts
const image = await client.images.upload({
  file: imageBuffer,
  fileName: "hero.png",
  mimeType: "image/png"
});
```

Upload from an `fs.ReadStream`:

```ts
import fs from "node:fs";

const image = await client.images.upload({
  file: fs.createReadStream("hero.jpg"),
  mimeType: "image/jpeg"
});

const transformedUrl = image.url({
  width: 1200,
  height: 800,
  format: "webp",
  quality: 80
});
```

Upload from a generic `Readable` stream:

```ts
import { Readable } from "node:stream";

const image = await client.images.upload({
  file: Readable.from(imageBuffer),
  fileName: "hero.png",
  mimeType: "image/png",
  contentLength: imageBuffer.length
});
```

Create an upload token:

```ts
const uploadToken = await client.images.createUploadToken();

console.log(uploadToken.token);
```

Create and inspect a bulk download job:

```ts
const job = await client.images.createBulkDownloadJob({
  image_ids: ["img_123", "img_456"]
});

const refreshed = await client.images.retrieveBulkDownloadJob(job.id);
```

Delete multiple images:

```ts
await client.images.bulkDelete({
  image_ids: ["img_123", "img_456"]
});
```

### `client.customDomain`

Custom domain management for your imgwire environment.

Supported methods:

- `create({ hostname })`
- `retrieve()`
- `testConnection()`
- `delete()`

Example:

```ts
await client.customDomain.create({
  hostname: "images.example.com"
});

const customDomain = await client.customDomain.retrieve();
const verification = await client.customDomain.testConnection();
```

### `client.corsOrigins`

CORS origin management for server-controlled environments.

Supported methods:

- `list({ limit, page })`
- `listPages({ limit, page })`
- `listAll({ limit, page })`
- `create({ pattern })`
- `retrieve(corsOriginId)`
- `update(corsOriginId, { pattern })`
- `delete(corsOriginId)`

Example:

```ts
const created = await client.corsOrigins.create({
  pattern: "app.example.com"
});

const origins = await client.corsOrigins.list({
  limit: 50,
  page: 1
});

await client.corsOrigins.update(created.id, {
  pattern: "dashboard.example.com"
});

for await (const origin of client.corsOrigins.listAll({ limit: 50 })) {
  console.log(origin.pattern);
}
```

### `client.metrics`

Server-side metrics endpoints for dashboards, reporting, and internal tooling.

Supported methods:

- `getDatasets({ dateStart?, dateEnd?, interval?, tz? })`
- `getStats({ dateStart?, dateEnd?, interval?, tz? })`

Example:

```ts
import { MetricsDatasetInterval } from "@imgwire/node";

const datasets = await client.metrics.getDatasets({
  dateStart: new Date("2026-04-01T00:00:00.000Z"),
  dateEnd: new Date("2026-04-15T00:00:00.000Z"),
  interval: MetricsDatasetInterval.DAILY,
  tz: "America/Chicago"
});

const stats = await client.metrics.getStats({
  dateStart: new Date("2026-04-01T00:00:00.000Z"),
  dateEnd: new Date("2026-04-15T00:00:00.000Z"),
  interval: MetricsDatasetInterval.DAILY,
  tz: "America/Chicago"
});
```

## Response Shape Notes

- List endpoints exposed through handwritten wrappers return `{ data, pagination }`.
- `listPages()` yields paginated result objects across pages.
- `listAll()` yields individual items across every page.
- Image-returning methods return image records extended with `url(...)` for transformation URL generation.
- Upload helpers return the created image record after the presigned upload completes.

## Development

```bash
yarn install
yarn generate
yarn ci
```

## Generation

This repository is generated from the imgwire API contract and then extended with handwritten Node-first SDK code.

The pipeline is:

1. acquire the raw OpenAPI document
2. shape it with `@imgwire/codegen-core` for `target: "node"`
3. generate a disposable base client with OpenAPI Generator
4. apply deterministic post-processing
5. layer in handwritten SDK code from `src/`

Set `OPENAPI_SOURCE` to override the spec source. By default:

- local/dev uses `http://localhost:8000/openapi.json`
- release-oriented generation can use `https://api.imgwire.dev/openapi.json` by setting `OPENAPI_RELEASE=true`

```bash
yarn generate
```

This writes:

- `openapi/raw.openapi.json`
- `openapi/sdk.openapi.json`
- `generated/`
- `CODEGEN_VERSION`

Generated code lives in `generated/` and should not be edited by hand. Durable SDK code lives in `src/`.

## License

MIT. See [LICENSE](./LICENSE).

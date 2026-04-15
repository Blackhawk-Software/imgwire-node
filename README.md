# `@imgwire/node`

Node.js-first TypeScript SDK for the imgwire API.

This repository is the first server-side SDK implementation for imgwire. It consumes `@imgwire/codegen-core`, shapes a server-only OpenAPI contract, generates a disposable base client with OpenAPI Generator, and layers stable Node ergonomics on top in `src/`.

## Installation

```bash
yarn add @imgwire/node
```

## Usage

```ts
import fs from "node:fs";
import { ImgwireClient } from "@imgwire/node";

const client = new ImgwireClient({
  apiKey: "sk_..."
});

const images = await client.images.list({ limit: 25, page: 1 });
await client.customDomain.create({
  hostname: "images.example.com"
});

const image = await client.images.upload({
  file: fs.createReadStream("hero.jpg"),
  mimeType: "image/jpeg"
});
```

## Generation

```bash
yarn generate
yarn verify-generated
```

Pipeline:

```text
Raw OpenAPI
-> codegen-core (target: "node")
-> openapi/sdk.openapi.json
-> OpenAPI Generator (typescript-node)
-> generated/
-> post-processing
-> CODEGEN_VERSION update
```

## Boundaries

- `generated/` is disposable and must never be edited by hand.
- `src/` contains the stable handwritten SDK layer.
- `openapi/raw.openapi.json` and `openapi/sdk.openapi.json` are checked in for deterministic regeneration.
- Use Yarn Classic commands for install, generate, test, and build.

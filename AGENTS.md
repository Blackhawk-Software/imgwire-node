# AGENTS

This repository is the server-first `@imgwire/node` SDK pipeline.

## Generation Rules

- `@imgwire/codegen-core` is the authoritative SDK shaping layer.
- Fully generated output lives in `generated/` and is disposable.
- Do not manually edit files in `generated/`.
- Durable handwritten SDK code lives in `src/`.
- Pipeline scripts live in `scripts/`.
- Contributors must run the generation scripts instead of patching generated artifacts directly.
- CI runs `yarn verify-generated` and fails when generated outputs, transformed specs, or `CODEGEN_VERSION` are stale.

## Repo Boundaries

- `openapi/raw.openapi.json` is the checked-in raw backend contract snapshot.
- `openapi/sdk.openapi.json` is the checked-in SDK-shaped contract emitted by `@imgwire/codegen-core`.
- `src/` is where public wrappers, HTTP behavior, upload helpers, pagination helpers, and future Node ergonomics belong.
- `generated/` may be deleted and regenerated at any time.
- Use Yarn Classic for all install, test, build, and generation commands.

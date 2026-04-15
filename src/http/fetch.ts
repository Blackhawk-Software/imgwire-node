export function resolveFetch(fetchImpl?: typeof fetch): typeof fetch {
  const resolved = fetchImpl ?? globalThis.fetch;
  if (!resolved) {
    throw new Error(
      "ImgwireClient requires a fetch implementation for uploads. Pass options.fetch when running on a runtime without global fetch."
    );
  }

  return resolved;
}

import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { GENERATED_DIR } from "./_lib/paths.ts";

const GENERATED_ROOT_FILES_TO_REMOVE = new Set([
  ".gitignore",
  ".openapi-generator-ignore",
  "git_push.sh",
  "package.json",
  "tsconfig.json"
]);

export async function runPostprocess(options?: {
  generatedDir?: string;
}): Promise<void> {
  const generatedDir = options?.generatedDir ?? GENERATED_DIR;

  for (const name of GENERATED_ROOT_FILES_TO_REMOVE) {
    await rm(resolve(generatedDir, name), { force: true, recursive: true });
  }

  await rm(resolve(generatedDir, ".openapi-generator"), {
    force: true,
    recursive: true
  });

  const apisPath = resolve(generatedDir, "api", "apis.ts");
  const apisSource = await readFile(apisPath, "utf8");
  await writeFile(
    apisPath,
    apisSource.replace(
      "export { RequestFile } from '../model/models';",
      "export type { RequestFile } from '../model/models';"
    ),
    "utf8"
  );

  await writeFile(
    resolve(generatedDir, "index.ts"),
    [
      "export * from \"./api\";",
      "export * from \"./api/apis\";",
      "export * from \"./model/models\";"
    ].join("\n") + "\n",
    "utf8"
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runPostprocess();
}

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

  const modelsPath = resolve(generatedDir, "model", "models.ts");
  const modelsSource = await readFile(modelsPath, "utf8");
  await writeFile(
    modelsPath,
    preserveCustomMetadataValues(modelsSource),
    "utf8"
  );

  await writeFile(
    resolve(generatedDir, "index.ts"),
    [
      'export * from "./api";',
      'export * from "./api/apis";',
      'export * from "./model/models";'
    ].join("\n") + "\n",
    "utf8"
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runPostprocess();
}

function preserveCustomMetadataValues(source: string): string {
  if (source.includes('type === "CustomMetadataValue"')) {
    return source;
  }

  // The generator emits the primitive metadata union as an empty model.
  // Preserve those values before generic model serialization turns them into {}.
  const serializeNeedle = [
    "            return transformedData;",
    "        } else if (startsWith(type, mapPrefix)) {",
    "            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type",
    "            let transformedData: { [key: string]: any } = {};",
    "            for (let key in data) {",
    "                transformedData[key] = ObjectSerializer.serialize("
  ].join("\n");
  const deserializeNeedle = serializeNeedle.replace(
    "ObjectSerializer.serialize(",
    "ObjectSerializer.deserialize("
  );
  const replacementPrefix = [
    "            return transformedData;",
    '        } else if (type === "CustomMetadataValue") {',
    "            return data;"
  ].join("\n");

  return replaceRequired(
    replaceRequired(
      source,
      serializeNeedle,
      serializeNeedle.replace(
        "            return transformedData;",
        replacementPrefix
      )
    ),
    deserializeNeedle,
    deserializeNeedle.replace(
      "            return transformedData;",
      replacementPrefix
    )
  );
}

function replaceRequired(
  source: string,
  searchValue: string,
  replaceValue: string
): string {
  if (!source.includes(searchValue)) {
    throw new Error("Expected generated serializer structure was not found.");
  }

  return source.replace(searchValue, replaceValue);
}

import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../data/bibles/manifest.json", import.meta.url), "utf8"));
const outDir = new URL("../app/data/", import.meta.url);
const outFile = new URL("bibleRegistry.js", outDir);

await mkdir(outDir, { recursive: true });

const lines = [
  "export const bibleManifest = ",
  JSON.stringify(manifest, null, 2),
  ";\n\n",
  "export const bookLoaders = {\n"
];

for (const [slug, version] of Object.entries(manifest.versions)) {
  const key = slug.toUpperCase();
  lines.push(`  ${key}: {\n`);

  for (const book of version.books) {
    lines.push(`    ${JSON.stringify(book.book)}: () => require("../../data/bibles/books/${slug}/${book.book}.json"),\n`);
  }

  lines.push("  },\n");
}

lines.push("};\n");

await writeFile(outFile, lines.join(""));

console.log("Generated app/data/bibleRegistry.js");

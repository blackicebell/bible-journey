import { mkdir, writeFile } from "node:fs/promises";

const versions = [
  { slug: "kjv", label: "King James Version" },
  { slug: "asv", label: "American Standard Version" },
  { slug: "web", label: "World English Bible" }
];

const baseUrl = "https://raw.githubusercontent.com/midvash/bible-data/main/versions/en";
const outDir = new URL("../data/bibles/", import.meta.url);

async function download(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

await mkdir(outDir, { recursive: true });

for (const version of versions) {
  const bibleUrl = `${baseUrl}/${version.slug}/${version.slug}.json`;
  const metadataUrl = `${baseUrl}/${version.slug}/metadata.json`;

  console.log(`Downloading ${version.label}...`);

  const [bible, metadata] = await Promise.all([
    download(bibleUrl),
    download(metadataUrl)
  ]);

  await writeFile(new URL(`${version.slug}.json`, outDir), bible);
  await writeFile(new URL(`${version.slug}.metadata.json`, outDir), metadata);
}

await writeFile(
  new URL("README.md", outDir),
  `# Bible Data

Local Bible text assets for Bible Journey.

Source: https://github.com/midvash/bible-data

Pulled versions:

- KJV: King James Version
- ASV: American Standard Version
- WEB: World English Bible

The source project declares these English versions as public-domain texts and ships per-version metadata with provenance and license details.
`
);

console.log("Bible data downloaded to data/bibles");

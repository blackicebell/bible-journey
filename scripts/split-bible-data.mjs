import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const versions = ["kjv", "asv", "web"];
const dataDir = new URL("../data/bibles/", import.meta.url);
const booksDir = new URL("books/", dataDir);

const manifest = {
  source: "https://github.com/midvash/bible-data",
  generatedAt: new Date().toISOString(),
  versions: {}
};

await mkdir(booksDir, { recursive: true });

for (const slug of versions) {
  const bible = JSON.parse(await readFile(new URL(`${slug}.json`, dataDir), "utf8"));
  const metadata = JSON.parse(await readFile(new URL(`${slug}.metadata.json`, dataDir), "utf8"));
  const versionBooksDir = new URL(`${slug}/`, booksDir);

  await mkdir(versionBooksDir, { recursive: true });

  manifest.versions[slug] = {
    slug,
    name: bible.name,
    language: bible.language,
    license: bible.license,
    year: metadata.year,
    source: metadata.source,
    books: bible.books.map((book) => ({
      book: book.book,
      bookId: book.bookId,
      englishName: book.englishName,
      testament: book.testament,
      chapters: book.chapters.map((chapter) => ({
        chapter: chapter.chapter,
        verseCount: chapter.verses.length
      })),
      path: `data/bibles/books/${slug}/${book.book}.json`
    }))
  };

  for (const book of bible.books) {
    await writeFile(new URL(`${book.book}.json`, versionBooksDir), JSON.stringify(book));
  }

  await rm(new URL(`${slug}.json`, dataDir));
}

await writeFile(new URL("manifest.json", dataDir), JSON.stringify(manifest, null, 2));

console.log("Bible data split into per-book assets.");

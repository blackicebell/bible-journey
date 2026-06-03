const translationKeys = ["KJV", "ASV", "WEB"];
const manifestUrl = "data/bibles/manifest.json";

const sacredStyles = {
  traditional: {
    label: "Traditional",
    map: { LORD: "LORD", God: "God", Lord: "Lord", Jesus: "Jesus" }
  },
  hebrew: {
    label: "Hebrew Roots",
    map: { LORD: "Yahweh", God: "Elohim", Lord: "Adonai", Jesus: "Yahshua" }
  }
};

const journey = [
  { era: "Creation", book: "Gen", chapter: 1, range: "Genesis 1-11", description: "The world opens with beauty, order, and breath.", time: "34 min read", progress: 32 },
  { era: "Patriarchs", book: "Gen", chapter: 12, range: "Genesis 12-50", description: "A family is called into a promise that will widen to nations.", time: "2 hr read", progress: 18 },
  { era: "Exodus", book: "Exod", chapter: 1, range: "Exodus 1-15", description: "Deliverance begins in bondage and moves toward worship.", time: "58 min read", progress: 0 },
  { era: "Judges", book: "Judg", chapter: 1, range: "Judges", description: "A people learn what happens when memory grows thin.", time: "1 hr read", progress: 0 },
  { era: "Kingdom", book: "1Sam", chapter: 1, range: "1 Samuel - 2 Samuel", description: "Israel asks for a king and learns the weight of power.", time: "3 hr read", progress: 0 },
  { era: "Exile", book: "Dan", chapter: 1, range: "Daniel", description: "Faithfulness takes shape away from home.", time: "44 min read", progress: 0 },
  { era: "Messiah", book: "Matt", chapter: 1, range: "Matthew - John", description: "The story bends toward the life, death, and resurrection of Jesus.", time: "4 hr read", progress: 0 },
  { era: "Early Church", book: "Acts", chapter: 1, range: "Acts - Romans", description: "The witness moves outward with courage and tension.", time: "3 hr read", progress: 0 }
];

const discoveries = [
  { name: "Moses", meta: "Exodus - Numbers - Deuteronomy", book: "Exod", chapter: 3 },
  { name: "Abraham", meta: "Genesis 12-25", book: "Gen", chapter: 12 },
  { name: "David", meta: "1 Samuel - 2 Samuel - Psalms", book: "1Sam", chapter: 16 },
  { name: "Jerusalem", meta: "2 Samuel - Psalms - Matthew", book: "Ps", chapter: 122 },
  { name: "Kingdom", meta: "Genesis - Samuel - Matthew", book: "Matt", chapter: 5 },
  { name: "Faith", meta: "Habakkuk - Matthew - Romans", book: "Rom", chapter: 4 }
];

const state = {
  view: "home",
  translation: "KJV",
  sacredStyle: "traditional",
  book: "Gen",
  chapter: 12,
  search: "",
  saved: new Set(["John 3:16", "Psalm 23:1"]),
  selectedVerse: "John 3:16",
  loading: true,
  contentLoading: false,
  searchLoading: false,
  error: ""
};

const app = document.querySelector("#app");
const bookCache = {};
let manifest = null;

function slugOf(translation = state.translation) {
  return translation.toLowerCase();
}

function versionMeta(translation = state.translation) {
  return manifest?.versions[slugOf(translation)];
}

function translationLabel(translation = state.translation) {
  return versionMeta(translation)?.name || translation;
}

function books(translation = state.translation) {
  return versionMeta(translation)?.books || [];
}

function bookMeta(bookCode = state.book, translation = state.translation) {
  return books(translation).find((book) => book.book === bookCode);
}

function cachedBook(bookCode = state.book, translation = state.translation) {
  return bookCache[translation]?.[bookCode];
}

async function loadManifest() {
  try {
    const response = await fetch(manifestUrl);

    if (!response.ok) {
      throw new Error(`Manifest failed to load: ${response.status}`);
    }

    manifest = await response.json();
    await preloadOpeningBooks();
    state.loading = false;
  } catch (error) {
    state.loading = false;
    state.error = "Bible data could not load. Run the local server with npm run dev, then open http://localhost:4173.";
    console.error(error);
  }

  render();
}

async function loadBook(translation = state.translation, bookCode = state.book) {
  if (!bookCache[translation]) {
    bookCache[translation] = {};
  }

  if (bookCache[translation][bookCode]) {
    return bookCache[translation][bookCode];
  }

  const meta = bookMeta(bookCode, translation);
  if (!meta) {
    throw new Error(`${translation} ${bookCode} is missing from the manifest`);
  }

  const response = await fetch(meta.path);
  if (!response.ok) {
    throw new Error(`${translation} ${bookCode} failed to load`);
  }

  const book = await response.json();
  bookCache[translation][bookCode] = book;
  return book;
}

async function preloadOpeningBooks() {
  await Promise.all([
    loadBook("KJV", "Gen"),
    loadBook("KJV", "John"),
    loadBook("KJV", "Ps"),
    loadBook("WEB", "Gen")
  ]);
}

async function prepareForView(view = state.view) {
  if (!manifest) return;

  state.contentLoading = true;
  render();

  try {
    if (view === "parallel") {
      await Promise.all([loadBook("KJV", state.book), loadBook("WEB", state.book)]);
    } else if (view === "reader") {
      await loadBook(state.translation, state.book);
    } else if (view === "home") {
      await Promise.all([
        loadBook(state.translation, state.book),
        loadReferenceBook("John 3:16")
      ]);
    } else if (view === "saved" || view === "share") {
      await Promise.all([...state.saved, state.selectedVerse].map((ref) => loadReferenceBook(ref)));
    } else if (view === "search") {
      await preloadFeaturedSearchBooks();
      if (state.search.trim()) {
        await loadSearchBooks();
      }
    }
  } catch (error) {
    state.error = "A scripture file could not load. Refresh the app and try again.";
    console.error(error);
  }

  state.contentLoading = false;
  render();
}

async function preloadFeaturedSearchBooks() {
  await Promise.all(["John 3:16", "Psalm 23:1", "Matthew 5:9", "Romans 8:28"].map((ref) => loadReferenceBook(ref)));
}

async function loadReferenceBook(ref, translation = state.translation) {
  const parsed = parseReference(ref);
  if (!parsed) return;

  const book = findBookByName(parsed.bookName, translation);
  if (book) {
    await loadBook(translation, book.book);
  }
}

async function loadSearchBooks() {
  state.searchLoading = true;
  render();

  const translation = state.translation;
  await Promise.all(books(translation).map((book) => loadBook(translation, book.book)));

  state.searchLoading = false;
}

function currentBookName() {
  return bookMeta()?.englishName || "Genesis";
}

function currentChapter(translation = state.translation) {
  return cachedBook(state.book, translation)?.chapters.find((chapter) => chapter.chapter === Number(state.chapter));
}

function chapterTitle() {
  return `${currentBookName()} ${state.chapter}`;
}

function parseReference(ref) {
  const match = ref.match(/^(.+)\s+(\d+):(\d+)$/);
  if (!match) return null;
  return { bookName: match[1], chapter: Number(match[2]), verse: Number(match[3]) };
}

function findBookByName(name, translation = state.translation) {
  const normalized = name.toLowerCase();
  return books(translation).find((book) => {
    return book.englishName.toLowerCase() === normalized || book.book.toLowerCase() === normalized;
  });
}

function verseFromReference(ref, translation = state.translation) {
  const parsed = parseReference(ref);
  if (!parsed) return "";

  const book = findBookByName(parsed.bookName, translation);
  const loadedBook = book ? cachedBook(book.book, translation) : null;
  const chapter = loadedBook?.chapters.find((item) => item.chapter === parsed.chapter);
  const verse = chapter?.verses.find((item) => item.number === parsed.verse);

  return applySacredNames(verse?.text || "");
}

function verseReference(book, chapter, verse) {
  return `${book.englishName} ${chapter.chapter}:${verse.number}`;
}

function applySacredNames(text) {
  const map = sacredStyles[state.sacredStyle].map;
  return text
    .replace(/\bLORD\b/g, map.LORD)
    .replace(/\bGod\b/g, map.God)
    .replace(/\bLord\b/g, map.Lord)
    .replace(/\bJesus\b/g, map.Jesus);
}

function render() {
  if (state.loading) {
    app.innerHTML = `
      <div class="shell">
        <main class="loading-state">
          <p class="kicker">Bible Journey</p>
          <h1>Preparing the reading room.</h1>
        </main>
      </div>
    `;
    return;
  }

  if (state.error) {
    app.innerHTML = `
      <div class="shell">
        <main class="loading-state">
          <p class="kicker">Data Error</p>
          <h1>Scripture data needs the local server.</h1>
          <p>${state.error}</p>
        </main>
      </div>
    `;
    return;
  }

  const routes = {
    home: renderHome,
    reader: renderReader,
    journey: renderJourney,
    parallel: renderParallel,
    search: renderSearch,
    saved: renderSaved,
    share: renderShare,
    names: renderNames
  };

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <button class="brand" data-view="home" aria-label="Go home">
          <span>Bible</span>
          <strong>Journey</strong>
        </button>
        <nav class="tabs" aria-label="Primary">
          ${navButton("home", "Home")}
          ${navButton("reader", "Read")}
          ${navButton("journey", "Journey")}
          ${navButton("parallel", "Parallel")}
          ${navButton("search", "Search")}
          ${navButton("saved", "Saved")}
        </nav>
      </header>
      <main>${routes[state.view]()}</main>
    </div>
  `;

  bindEvents();
}

function navButton(view, label) {
  return `<button class="${state.view === view ? "active" : ""}" data-view="${view}">${label}</button>`;
}

function renderHome() {
  return `
    <section class="home-grid">
      <article class="continue-panel">
        <p class="kicker">Continue Reading</p>
        <h1>${chapterTitle()}</h1>
        <p class="subtitle">Abraham's Call</p>
        <p class="quiet">4 min read - ${state.translation} - ${sacredStyles[state.sacredStyle].label}</p>
        <button class="primary" data-view="reader">Resume Reading</button>
      </article>

      <article class="verse-panel">
        <p class="kicker">Verse of the Day</p>
        <blockquote>${verseFromReference("John 3:16")}</blockquote>
        <p class="reference">John 3:16</p>
      </article>

      <section class="explore-panel" aria-labelledby="explore-title">
        <div>
          <p class="kicker">Explore</p>
          <h2 id="explore-title">Move through scripture without clutter.</h2>
        </div>
        <div class="explore-list">
          <button data-view="journey">Chronological Journey</button>
          <button data-view="parallel">Parallel Reader</button>
          <button data-view="search">People, Places & Events</button>
          <button data-view="names">Sacred Names</button>
        </div>
      </section>
    </section>
  `;
}

function renderReader() {
  const chapter = currentChapter();
  const book = cachedBook() || bookMeta();

  if (!chapter || state.contentLoading) {
    return renderInlineLoading("Opening scripture.");
  }

  return `
    <section class="reader-page">
      <div class="reader-controls">
        <label>
          Translation
          <select data-control="translation">
            ${translationKeys.map((key) => `<option value="${key}" ${state.translation === key ? "selected" : ""}>${key}</option>`).join("")}
          </select>
        </label>
        <label>
          Book
          <select data-control="book">
            ${books().map((item) => `<option value="${item.book}" ${state.book === item.book ? "selected" : ""}>${item.englishName}</option>`).join("")}
          </select>
        </label>
        <label>
          Chapter
          <select data-control="chapter">
            ${bookMeta().chapters.map((item) => `<option value="${item.chapter}" ${Number(state.chapter) === item.chapter ? "selected" : ""}>${item.chapter}</option>`).join("")}
          </select>
        </label>
        <button class="text-button" data-view="names">Sacred Names</button>
      </div>
      <article class="scripture">
        <p class="chapter-label">${translationLabel()} - ${chapterTitle()}</p>
        <h1>${chapterTitle()}</h1>
        ${chapter.verses.map((verse, index) => {
          const ref = verseReference(book, chapter, verse);
          return `
            <p class="${index === 0 ? "first-verse" : ""}">
              <button class="verse-save ${state.saved.has(ref) ? "saved" : ""}" data-save="${ref}" aria-label="Save ${ref}">${state.saved.has(ref) ? "Saved" : "Save"}</button>
              <span class="verse-number">${verse.number}</span>
              ${applySacredNames(verse.text)}
            </p>
          `;
        }).join("")}
      </article>
    </section>
  `;
}

function renderJourney() {
  return `
    <section class="journey-page">
      <header class="section-heading">
        <p class="kicker">Chronological Journey</p>
        <h1>Read the story as it unfolds.</h1>
      </header>
      <div class="timeline">
        ${journey.map((item) => `
          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <p class="kicker">${item.range} - ${item.time}</p>
              <h2>${item.era}</h2>
              <p>${item.description}</p>
              <div class="progress" aria-label="${item.progress}% complete"><span style="width:${item.progress}%"></span></div>
              <button class="inline-link" data-open-book="${item.book}" data-open-chapter="${item.chapter}">Begin ${item.era}</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderParallel() {
  const baseChapter = currentChapter("KJV");
  const webChapter = currentChapter("WEB");
  const baseBook = cachedBook(state.book, "KJV");
  const webBook = cachedBook(state.book, "WEB");

  if (!baseChapter || !webChapter || state.contentLoading) {
    return renderInlineLoading("Opening the parallel reader.");
  }

  return `
    <section class="parallel-page">
      <div class="reader-controls">
        <label>
          Book
          <select data-control="book">
            ${books().map((item) => `<option value="${item.book}" ${state.book === item.book ? "selected" : ""}>${item.englishName}</option>`).join("")}
          </select>
        </label>
        <label>
          Chapter
          <select data-control="chapter">
            ${bookMeta().chapters.map((item) => `<option value="${item.chapter}" ${Number(state.chapter) === item.chapter ? "selected" : ""}>${item.chapter}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="page-spread">
        ${[
          { translation: "KJV", book: baseBook, chapter: baseChapter },
          { translation: "WEB", book: webBook, chapter: webChapter }
        ].map(({ translation, book, chapter }) => `
          <article class="parallel-column">
            <p class="chapter-label">${translationLabel(translation)}</p>
            <h1>${book.englishName} ${chapter.chapter}</h1>
            ${baseChapter.verses.map((verse) => {
              const parallelVerse = chapter.verses.find((item) => item.number === verse.number);
              return `<p><span class="verse-number">${verse.number}</span>${applySacredNames(parallelVerse?.text || "")}</p>`;
            }).join("")}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSearch() {
  const results = searchResults();

  return `
    <section class="search-page">
      <header class="section-heading">
        <p class="kicker">Universal Search</p>
        <h1>Find scripture by reference, word, person, place, or event.</h1>
      </header>
      <input class="search-input" data-control="search" value="${state.search}" placeholder="John 3:16, faith, Genesis, Abraham..." autofocus />
      ${state.searchLoading ? `<p class="quiet">Searching the ${state.translation} text...</p>` : ""}
      <div class="results">
        ${results.map((result) => result.type === "verse" ? `
          <button class="result-row" data-open-book="${result.book}" data-open-chapter="${result.chapter}">
            <span>${result.ref}</span>
            <strong>${result.text}</strong>
          </button>
        ` : `
          <button class="result-row" data-open-book="${result.book}" data-open-chapter="${result.chapter}">
            <span>${result.meta}</span>
            <strong>${result.name}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSaved() {
  const savedRefs = [...state.saved];

  if (state.contentLoading) {
    return renderInlineLoading("Opening saved scripture.");
  }

  return `
    <section class="saved-page">
      <header class="section-heading">
        <p class="kicker">Saved Scripture</p>
        <h1>Quiet places to return to.</h1>
      </header>
      <div class="collection-tabs" aria-label="Collections">
        <button class="active">Favorites</button>
        <button>Faith</button>
        <button>Wisdom</button>
        <button>Family</button>
      </div>
      <div class="saved-list">
        ${savedRefs.map((ref) => `
          <article class="saved-item">
            <p>${verseFromReference(ref)}</p>
            <div>
              <span>${ref}</span>
              <button data-share="${ref}">Share Card</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderShare() {
  if (state.contentLoading) {
    return renderInlineLoading("Preparing the share card.");
  }

  return `
    <section class="share-page">
      <header class="section-heading">
        <p class="kicker">Share Card</p>
        <h1>Scripture as the visual hero.</h1>
      </header>
      <div class="share-layout">
        <article class="share-card-preview">
          <blockquote>${verseFromReference(state.selectedVerse)}</blockquote>
          <p>${state.selectedVerse}</p>
        </article>
        <div class="share-actions">
          <button class="primary">Share Text</button>
          <button>Square</button>
          <button>Vertical Story</button>
        </div>
      </div>
    </section>
  `;
}

function renderNames() {
  const sample = applySacredNames("The LORD is my shepherd, and God is near.");

  return `
    <section class="names-page">
      <header class="section-heading">
        <p class="kicker">Sacred Names</p>
        <h1>Choose the reading style after seeing it in context.</h1>
      </header>
      <div class="names-layout">
        <article class="name-preview">
          <p class="kicker">Live Preview</p>
          <blockquote>${sample}</blockquote>
          <p class="reference">Psalm 23 inspired preview</p>
        </article>
        <div class="name-options">
          ${Object.entries(sacredStyles).map(([key, style]) => `
            <button class="${state.sacredStyle === key ? "selected" : ""}" data-style="${key}">
              <strong>${style.label}</strong>
              <span>LORD -> ${style.map.LORD} - God -> ${style.map.God} - Jesus -> ${style.map.Jesus}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderInlineLoading(message) {
  return `
    <section class="loading-state">
      <p class="kicker">Bible Journey</p>
      <h1>${message}</h1>
    </section>
  `;
}

function searchResults() {
  const query = state.search.trim().toLowerCase();
  const results = [];

  const reference = parseReference(state.search.trim());
  if (reference) {
    const exact = referenceResult(state.search.trim());
    if (exact) results.push(exact);
  }

  const discoveryResults = discoveries
    .filter((item) => !query || item.name.toLowerCase().includes(query) || item.meta.toLowerCase().includes(query))
    .slice(0, 4)
    .map((item) => ({ type: "discovery", ...item }));

  results.push(...discoveryResults);

  if (!query) {
    const featured = ["John 3:16", "Psalm 23:1", "Matthew 5:9", "Romans 8:28"];
    results.push(...featured.map((ref) => referenceResult(ref)).filter(Boolean));
    return results;
  }

  for (const meta of books()) {
    const loadedBook = cachedBook(meta.book);

    if (meta.englishName.toLowerCase().includes(query)) {
      results.push({
        type: "verse",
        book: meta.book,
        chapter: 1,
        ref: `${meta.englishName} 1:1`,
        text: loadedBook ? applySacredNames(loadedBook.chapters[0].verses[0].text) : "Open this book"
      });
    }

    if (!loadedBook) continue;

    for (const chapter of loadedBook.chapters) {
      for (const verse of chapter.verses) {
        if (results.length >= 10) return results;
        if (verse.text.toLowerCase().includes(query)) {
          results.push({
            type: "verse",
            book: loadedBook.book,
            chapter: chapter.chapter,
            ref: verseReference(loadedBook, chapter, verse),
            text: applySacredNames(verse.text)
          });
        }
      }
    }
  }

  return results;
}

function referenceResult(ref) {
  const parsed = parseReference(ref);
  if (!parsed) return null;

  const book = findBookByName(parsed.bookName);
  const loadedBook = book ? cachedBook(book.book) : null;
  const chapter = loadedBook?.chapters.find((item) => item.chapter === parsed.chapter);
  const verse = chapter?.verses.find((item) => item.number === parsed.verse);

  if (!book || !chapter || !verse) return null;

  return {
    type: "verse",
    book: book.book,
    chapter: chapter.chapter,
    ref: verseReference(loadedBook, chapter, verse),
    text: applySacredNames(verse.text)
  };
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.view = button.dataset.view;
      await prepareForView();
    });
  });

  document.querySelectorAll("[data-control]").forEach((control) => {
    control.addEventListener("input", async () => {
      if (control.dataset.control === "book") {
        state.book = control.value;
        state.chapter = 1;
      } else if (control.dataset.control === "chapter") {
        state.chapter = Number(control.value);
      } else {
        state[control.dataset.control] = control.value;
      }

      await prepareForView();
    });
  });

  document.querySelectorAll("[data-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const ref = button.dataset.save;
      state.saved.has(ref) ? state.saved.delete(ref) : state.saved.add(ref);
      render();
    });
  });

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.selectedVerse = button.dataset.share;
      state.view = "share";
      await prepareForView();
    });
  });

  document.querySelectorAll("[data-style]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sacredStyle = button.dataset.style;
      render();
    });
  });

  document.querySelectorAll("[data-open-book]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.book = button.dataset.openBook;
      state.chapter = Number(button.dataset.openChapter);
      state.view = "reader";
      await prepareForView();
    });
  });
}

render();
loadManifest();

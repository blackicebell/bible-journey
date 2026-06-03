const translations = {
  KJV: {
    label: "KJV",
    verses: {
      "Genesis 1:1": "In the beginning God created the heaven and the earth.",
      "Genesis 1:2": "And the earth was without form, and void; and darkness was upon the face of the deep.",
      "Genesis 12:1": "Now the LORD had said unto Abram, Get thee out of thy country, and from thy kindred, and from thy father's house, unto a land that I will shew thee.",
      "Genesis 12:2": "And I will make of thee a great nation, and I will bless thee, and make thy name great; and thou shalt be a blessing.",
      "Genesis 12:3": "And I will bless them that bless thee, and curse him that curseth thee: and in thee shall all families of the earth be blessed.",
      "John 3:16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      "Psalm 23:1": "The LORD is my shepherd; I shall not want.",
      "Psalm 23:2": "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      "Matthew 5:9": "Blessed are the peacemakers: for they shall be called the children of God.",
      "Romans 8:28": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."
    }
  },
  ASV: {
    label: "ASV",
    verses: {
      "Genesis 1:1": "In the beginning God created the heavens and the earth.",
      "Genesis 1:2": "And the earth was waste and void; and darkness was upon the face of the deep.",
      "Genesis 12:1": "Now Jehovah said unto Abram, Get thee out of thy country, and from thy kindred, and from thy father's house, unto the land that I will show thee.",
      "Genesis 12:2": "And I will make of thee a great nation, and I will bless thee, and make thy name great; and be thou a blessing.",
      "Genesis 12:3": "And I will bless them that bless thee, and him that curseth thee will I curse: and in thee shall all the families of the earth be blessed.",
      "John 3:16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.",
      "Psalm 23:1": "Jehovah is my shepherd; I shall not want.",
      "Psalm 23:2": "He maketh me to lie down in green pastures; He leadeth me beside still waters.",
      "Matthew 5:9": "Blessed are the peacemakers: for they shall be called sons of God.",
      "Romans 8:28": "And we know that to them that love God all things work together for good, even to them that are called according to his purpose."
    }
  },
  WEB: {
    label: "WEB",
    verses: {
      "Genesis 1:1": "In the beginning, God created the heavens and the earth.",
      "Genesis 1:2": "The earth was formless and empty. Darkness was on the surface of the deep.",
      "Genesis 12:1": "Now Yahweh said to Abram, Leave your country, and your relatives, and your father's house, and go to the land that I will show you.",
      "Genesis 12:2": "I will make of you a great nation. I will bless you and make your name great. You will be a blessing.",
      "Genesis 12:3": "I will bless those who bless you, and I will curse him who treats you with contempt. All the families of the earth will be blessed through you.",
      "John 3:16": "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
      "Psalm 23:1": "Yahweh is my shepherd: I shall lack nothing.",
      "Psalm 23:2": "He makes me lie down in green pastures. He leads me beside still waters.",
      "Matthew 5:9": "Blessed are the peacemakers, for they shall be called children of God.",
      "Romans 8:28": "We know that all things work together for good for those who love God, to those who are called according to his purpose."
    }
  }
};

const chapters = {
  "Genesis 1": ["Genesis 1:1", "Genesis 1:2"],
  "Genesis 12": ["Genesis 12:1", "Genesis 12:2", "Genesis 12:3"],
  "John 3": ["John 3:16"],
  "Psalm 23": ["Psalm 23:1", "Psalm 23:2"],
  "Matthew 5": ["Matthew 5:9"],
  "Romans 8": ["Romans 8:28"]
};

const journey = [
  { era: "Creation", range: "Genesis 1", description: "The world opens with beauty, order, and breath.", time: "6 min read", progress: 32 },
  { era: "Patriarchs", range: "Genesis 12", description: "A family is called into a promise that will widen to nations.", time: "14 min read", progress: 18 },
  { era: "Exodus", range: "Exodus 1-15", description: "Deliverance begins in bondage and moves toward worship.", time: "42 min read", progress: 0 },
  { era: "Kingdom", range: "1 Samuel - 2 Samuel", description: "Israel asks for a king and learns the weight of power.", time: "2 hr read", progress: 0 },
  { era: "Messiah", range: "Matthew - John", description: "The story bends toward the life, death, and resurrection of Jesus.", time: "3 hr read", progress: 0 },
  { era: "Early Church", range: "Acts - Romans", description: "The witness moves outward with courage and tension.", time: "2 hr read", progress: 0 }
];

const discoveries = [
  { name: "Moses", meta: "Exodus • Numbers • Deuteronomy", target: "Exodus 1-15" },
  { name: "Abraham", meta: "Genesis 12-25", target: "Genesis 12" },
  { name: "David", meta: "1 Samuel • 2 Samuel • Psalms", target: "Psalm 23" },
  { name: "Jerusalem", meta: "2 Samuel • Psalms • Matthew", target: "Matthew 5" },
  { name: "Kingdom", meta: "Genesis • Samuel • Matthew", target: "Matthew 5" }
];

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

const state = {
  view: "home",
  translation: "KJV",
  sacredStyle: "traditional",
  chapter: "Genesis 12",
  search: "",
  saved: new Set(["John 3:16", "Psalm 23:1"]),
  selectedVerse: "John 3:16"
};

const app = document.querySelector("#app");

function applySacredNames(text) {
  const map = sacredStyles[state.sacredStyle].map;
  return text
    .replace(/\bLORD\b/g, map.LORD)
    .replace(/\bGod\b/g, map.God)
    .replace(/\bLord\b/g, map.Lord)
    .replace(/\bJesus\b/g, map.Jesus);
}

function verseText(ref, translation = state.translation) {
  return applySacredNames(translations[translation].verses[ref] || "");
}

function render() {
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
        <h1>${state.chapter}</h1>
        <p class="subtitle">Abraham's Call</p>
        <p class="quiet">4 min read • ${translations[state.translation].label} • ${sacredStyles[state.sacredStyle].label}</p>
        <button class="primary" data-view="reader">Resume Reading</button>
      </article>

      <article class="verse-panel">
        <p class="kicker">Verse of the Day</p>
        <blockquote>${verseText("John 3:16")}</blockquote>
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
  const verses = chapters[state.chapter] || chapters["Genesis 12"];
  return `
    <section class="reader-page">
      <div class="reader-controls">
        <label>
          Translation
          <select data-control="translation">
            ${Object.keys(translations).map((key) => `<option ${state.translation === key ? "selected" : ""}>${key}</option>`).join("")}
          </select>
        </label>
        <label>
          Chapter
          <select data-control="chapter">
            ${Object.keys(chapters).map((key) => `<option ${state.chapter === key ? "selected" : ""}>${key}</option>`).join("")}
          </select>
        </label>
        <button class="text-button" data-view="names">Sacred Names</button>
      </div>
      <article class="scripture">
        <p class="chapter-label">${state.translation} • ${state.chapter}</p>
        <h1>${state.chapter}</h1>
        ${verses.map((ref, index) => `
          <p class="${index === 0 ? "first-verse" : ""}">
            <button class="verse-save ${state.saved.has(ref) ? "saved" : ""}" data-save="${ref}" aria-label="Save ${ref}">${state.saved.has(ref) ? "Saved" : "Save"}</button>
            <span class="verse-number">${ref.split(":")[1]}</span>
            ${verseText(ref)}
          </p>
        `).join("")}
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
              <p class="kicker">${item.range} • ${item.time}</p>
              <h2>${item.era}</h2>
              <p>${item.description}</p>
              <div class="progress" aria-label="${item.progress}% complete"><span style="width:${item.progress}%"></span></div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderParallel() {
  const refs = chapters[state.chapter] || chapters["Genesis 12"];
  return `
    <section class="parallel-page">
      <div class="reader-controls">
        <label>
          Chapter
          <select data-control="chapter">
            ${Object.keys(chapters).map((key) => `<option ${state.chapter === key ? "selected" : ""}>${key}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="page-spread">
        ${["KJV", "WEB"].map((translation) => `
          <article class="parallel-column">
            <p class="chapter-label">${translation}</p>
            <h1>${state.chapter}</h1>
            ${refs.map((ref) => `<p><span class="verse-number">${ref.split(":")[1]}</span>${verseText(ref, translation)}</p>`).join("")}
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
      <div class="results">
        ${results.map((result) => result.type === "verse" ? `
          <button class="result-row" data-open-ref="${result.ref}">
            <span>${result.ref}</span>
            <strong>${result.text}</strong>
          </button>
        ` : `
          <button class="result-row" data-open-target="${result.target}">
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
            <p>${verseText(ref)}</p>
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
  const text = verseText(state.selectedVerse);
  return `
    <section class="share-page">
      <header class="section-heading">
        <p class="kicker">Share Card</p>
        <h1>Scripture as the visual hero.</h1>
      </header>
      <div class="share-layout">
        <article class="share-card-preview">
          <blockquote>${text}</blockquote>
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
              <span>LORD → ${style.map.LORD} • God → ${style.map.God} • Jesus → ${style.map.Jesus}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function searchResults() {
  const query = state.search.trim().toLowerCase();
  const verseEntries = Object.entries(translations[state.translation].verses);
  const verseResults = verseEntries
    .filter(([ref, text]) => !query || ref.toLowerCase().includes(query) || text.toLowerCase().includes(query))
    .slice(0, 6)
    .map(([ref, text]) => ({ type: "verse", ref, text: applySacredNames(text) }));

  const discoveryResults = discoveries
    .filter((item) => !query || item.name.toLowerCase().includes(query) || item.meta.toLowerCase().includes(query) || item.target.toLowerCase().includes(query))
    .slice(0, 4)
    .map((item) => ({ type: "discovery", ...item }));

  return [...verseResults, ...discoveryResults];
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("[data-control]").forEach((control) => {
    control.addEventListener("input", () => {
      state[control.dataset.control] = control.value;
      render();
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
    button.addEventListener("click", () => {
      state.selectedVerse = button.dataset.share;
      state.view = "share";
      render();
    });
  });

  document.querySelectorAll("[data-style]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sacredStyle = button.dataset.style;
      render();
    });
  });

  document.querySelectorAll("[data-open-ref]").forEach((button) => {
    button.addEventListener("click", () => {
      state.chapter = button.dataset.openRef.split(":")[0];
      state.view = "reader";
      render();
    });
  });

  document.querySelectorAll("[data-open-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.openTarget;
      state.chapter = chapters[target] ? target : state.chapter;
      state.view = chapters[target] ? "reader" : "journey";
      render();
    });
  });
}

render();

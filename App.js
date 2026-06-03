import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { bookLoaders, bibleManifest } from "./app/data/bibleRegistry";

const translations = ["KJV", "ASV", "WEB"];

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
  { era: "Creation", book: "Gen", chapter: 1, range: "Genesis 1-11", description: "The world opens with beauty, order, and breath.", progress: 32 },
  { era: "Patriarchs", book: "Gen", chapter: 12, range: "Genesis 12-50", description: "A family is called into a promise that widens to nations.", progress: 18 },
  { era: "Exodus", book: "Exod", chapter: 1, range: "Exodus 1-15", description: "Deliverance begins in bondage and moves toward worship.", progress: 0 },
  { era: "Kingdom", book: "1Sam", chapter: 1, range: "1 Samuel - 2 Samuel", description: "Israel asks for a king and learns the weight of power.", progress: 0 },
  { era: "Messiah", book: "Matt", chapter: 1, range: "Matthew - John", description: "The story bends toward the life, death, and resurrection of Jesus.", progress: 0 },
  { era: "Early Church", book: "Acts", chapter: 1, range: "Acts - Romans", description: "The witness moves outward with courage and tension.", progress: 0 }
];

const discoveries = [
  { name: "Moses", meta: "Exodus - Numbers - Deuteronomy", book: "Exod", chapter: 3 },
  { name: "Abraham", meta: "Genesis 12-25", book: "Gen", chapter: 12 },
  { name: "David", meta: "1 Samuel - 2 Samuel - Psalms", book: "1Sam", chapter: 16 },
  { name: "Jerusalem", meta: "2 Samuel - Psalms - Matthew", book: "Ps", chapter: 122 },
  { name: "Kingdom", meta: "Genesis - Samuel - Matthew", book: "Matt", chapter: 5 }
];

const initialSaved = ["John 3:16", "Psalm 23:1"];

export default function App() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [screen, setScreen] = useState("home");
  const [translation, setTranslation] = useState("KJV");
  const [sacredStyle, setSacredStyle] = useState("traditional");
  const [bookCode, setBookCode] = useState("Gen");
  const [chapterNumber, setChapterNumber] = useState(12);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(initialSaved);
  const [themeName, setThemeName] = useState("light");

  colors = themes[themeName];
  styles = makeStyles(colors);

  const context = useMemo(() => {
    return {
      width,
      isTablet,
      screen,
      setScreen,
      translation,
      setTranslation,
      sacredStyle,
      setSacredStyle,
      bookCode,
      setBookCode,
      chapterNumber,
      setChapterNumber,
      search,
      setSearch,
      saved,
      setSaved,
      themeName,
      setThemeName
    };
  }, [width, isTablet, screen, translation, sacredStyle, bookCode, chapterNumber, search, saved, themeName]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={themeName === "light" ? "dark-content" : "light-content"} backgroundColor={colors.paper} />
      <View style={[styles.appShell, isTablet && styles.tabletShell]}>
        <Header context={context} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {screen === "home" && <Home context={context} />}
          {screen === "reader" && <Reader context={context} />}
          {screen === "journey" && <Journey context={context} />}
          {screen === "parallel" && <ParallelReader context={context} />}
          {screen === "search" && <Search context={context} />}
          {screen === "saved" && <Saved context={context} />}
          {screen === "names" && <SacredNames context={context} />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Header({ context }) {
  const tabs = [
    ["home", "Home", "home-outline"],
    ["reader", "Read", "book-outline"],
    ["journey", "Journey", "trail-sign-outline"],
    ["parallel", "Parallel", "albums-outline"],
    ["search", "Search", "search-outline"],
    ["saved", "Saved", "bookmark-outline"]
  ];

  return (
    <View style={styles.header}>
      <Pressable onPress={() => context.setScreen("home")} style={styles.brand}>
        <Text style={styles.brandLight}>Bible</Text>
        <Text style={styles.brandStrong}>Journey</Text>
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nav}>
        {tabs.map(([key, label, icon]) => (
          <Pressable key={key} onPress={() => context.setScreen(key)} style={[styles.navItem, context.screen === key && styles.navItemActive]}>
            <Ionicons name={icon} size={16} color={context.screen === key ? colors.ink : colors.muted} />
            <Text style={[styles.navText, context.screen === key && styles.navTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        onPress={() => context.setThemeName(context.themeName === "light" ? "dark" : "light")}
        style={styles.themeToggle}
        accessibilityRole="button"
        accessibilityLabel="Toggle light and dark mode"
      >
        <Ionicons name={context.themeName === "light" ? "moon-outline" : "sunny-outline"} size={17} color={colors.ink} />
        <Text style={styles.themeToggleText}>{context.themeName === "light" ? "Dark" : "Light"}</Text>
      </Pressable>
    </View>
  );
}

function Home({ context }) {
  const verse = getVerseText("John 3:16", context.translation, context.sacredStyle);
  const title = `${bookName(context.bookCode)} ${context.chapterNumber}`;

  return (
    <View style={[styles.homeGrid, context.isTablet && styles.homeGridTablet]}>
      <View style={styles.continuePanel}>
        <Kicker>Continue Reading</Kicker>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.subtitle}>Abraham's Call</Text>
        <Text style={styles.muted}>4 min read - {context.translation} - {sacredStyles[context.sacredStyle].label}</Text>
        <PrimaryButton label="Resume Reading" icon="arrow-forward" onPress={() => context.setScreen("reader")} />
      </View>

      <View style={styles.versePanel}>
        <Kicker>Verse of the Day</Kicker>
        <Text style={styles.displayVerse}>{verse}</Text>
        <Text style={styles.reference}>John 3:16</Text>
      </View>

      <View style={styles.explorePanel}>
        <Kicker>Explore</Kicker>
        {[
          ["journey", "Chronological Journey"],
          ["parallel", "Parallel Reader"],
          ["search", "People, Places & Events"],
          ["names", "Sacred Names"]
        ].map(([target, label]) => (
          <Pressable key={target} onPress={() => context.setScreen(target)} style={styles.editorialRow}>
            <Text style={styles.editorialText}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.gold} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Reader({ context }) {
  const book = getBook(context.translation, context.bookCode);
  const chapter = getChapter(context.translation, context.bookCode, context.chapterNumber);
  const chapters = bookMeta(context.bookCode).chapters;

  return (
    <View>
      <ControlRail context={context} chapters={chapters} showTranslation />
      <View style={styles.scripturePage}>
        <Kicker>{translationName(context.translation)} - {book.englishName} {chapter.chapter}</Kicker>
        <Text style={styles.readerTitle}>{book.englishName} {chapter.chapter}</Text>
        {chapter.verses.map((verse, index) => {
          const ref = `${book.englishName} ${chapter.chapter}:${verse.number}`;
          const isSaved = context.saved.includes(ref);
          return (
            <View key={verse.number} style={styles.verseLine}>
              <Pressable
                onPress={() => toggleSaved(ref, context)}
                style={[styles.savePill, isSaved && styles.savePillActive]}
              >
                <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={13} color={isSaved ? colors.navy : colors.muted} />
              </Pressable>
              <Text style={[styles.scriptureText, index === 0 && styles.firstVerse]}>
                <Text style={styles.verseNumber}>{verse.number} </Text>
                {applySacredNames(verse.text, context.sacredStyle)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function Journey({ context }) {
  return (
    <View>
      <SectionHeading kicker="Chronological Journey" title="Read the story as it unfolds." />
      <View style={styles.timeline}>
        {journey.map((item) => (
          <Pressable
            key={item.era}
            style={styles.timelineItem}
            onPress={() => {
              context.setBookCode(item.book);
              context.setChapterNumber(item.chapter);
              context.setScreen("reader");
            }}
          >
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Kicker>{item.range}</Kicker>
              <Text style={styles.timelineTitle}>{item.era}</Text>
              <Text style={styles.timelineCopy}>{item.description}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ParallelReader({ context }) {
  const chapters = bookMeta(context.bookCode).chapters;
  const left = getChapter("KJV", context.bookCode, context.chapterNumber);
  const right = getChapter("WEB", context.bookCode, context.chapterNumber);
  const leftBook = getBook("KJV", context.bookCode);
  const rightBook = getBook("WEB", context.bookCode);

  return (
    <View>
      <ControlRail context={context} chapters={chapters} />
      <View style={[styles.parallelSpread, !context.isTablet && styles.parallelStack]}>
        <ParallelColumn translation="KJV" book={leftBook} chapter={left} />
        <ParallelColumn translation="WEB" book={rightBook} chapter={right} />
      </View>
    </View>
  );
}

function ParallelColumn({ translation, book, chapter }) {
  return (
    <View style={styles.parallelPage}>
      <Kicker>{translationName(translation)}</Kicker>
      <Text style={styles.parallelTitle}>{book.englishName} {chapter.chapter}</Text>
      {chapter.verses.map((verse) => (
        <Text key={verse.number} style={styles.parallelText}>
          <Text style={styles.verseNumber}>{verse.number} </Text>
          {verse.text}
        </Text>
      ))}
    </View>
  );
}

function Search({ context }) {
  const results = getSearchResults(context.search, context.translation, context.sacredStyle);

  return (
    <View>
      <SectionHeading kicker="Universal Search" title="Find scripture without choosing a search type." />
      <TextInput
        value={context.search}
        onChangeText={context.setSearch}
        placeholder="John 3:16, faith, Genesis, Abraham..."
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
      />
      <View style={styles.results}>
        {results.map((result) => (
          <Pressable
            key={`${result.type}-${result.ref || result.name}`}
            style={styles.resultRow}
            onPress={() => {
              context.setBookCode(result.book);
              context.setChapterNumber(result.chapter);
              context.setScreen("reader");
            }}
          >
            <Text style={styles.resultMeta}>{result.type === "verse" ? result.ref : result.meta}</Text>
            <Text style={styles.resultText}>{result.type === "verse" ? result.text : result.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Saved({ context }) {
  return (
    <View>
      <SectionHeading kicker="Saved Scripture" title="Quiet places to return to." />
      <View style={styles.collectionTabs}>
        {["Favorites", "Faith", "Wisdom", "Family"].map((collection, index) => (
          <View key={collection} style={[styles.collectionPill, index === 0 && styles.collectionPillActive]}>
            <Text style={[styles.collectionText, index === 0 && styles.collectionTextActive]}>{collection}</Text>
          </View>
        ))}
      </View>
      {context.saved.map((ref) => (
        <View key={ref} style={styles.savedItem}>
          <Text style={styles.savedVerse}>{getVerseText(ref, context.translation, context.sacredStyle)}</Text>
          <Text style={styles.reference}>{ref}</Text>
        </View>
      ))}
    </View>
  );
}

function SacredNames({ context }) {
  const sample = applySacredNames("The LORD is my shepherd, and God is near.", context.sacredStyle);

  return (
    <View>
      <SectionHeading kicker="Sacred Names" title="Choose after seeing the text in context." />
      <View style={[styles.namesLayout, context.isTablet && styles.namesLayoutTablet]}>
        <View style={styles.namePreview}>
          <Kicker>Live Preview</Kicker>
          <Text style={styles.displayVerse}>{sample}</Text>
          <Text style={styles.reference}>Psalm 23 inspired preview</Text>
        </View>
        <View style={styles.nameOptions}>
          {Object.entries(sacredStyles).map(([key, style]) => (
            <Pressable
              key={key}
              onPress={() => context.setSacredStyle(key)}
              style={[styles.nameOption, context.sacredStyle === key && styles.nameOptionActive]}
            >
              <Text style={styles.nameOptionTitle}>{style.label}</Text>
              <Text style={styles.muted}>LORD to {style.map.LORD} - God to {style.map.God} - Jesus to {style.map.Jesus}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function ControlRail({ context, chapters, showTranslation = false }) {
  return (
    <View style={styles.controls}>
      {showTranslation && <SegmentedControl values={translations} active={context.translation} onChange={context.setTranslation} />}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookRail}>
        {books().map((book) => (
          <Pressable
            key={book.book}
            onPress={() => {
              context.setBookCode(book.book);
              context.setChapterNumber(1);
            }}
            style={[styles.bookChip, context.bookCode === book.book && styles.bookChipActive]}
          >
            <Text style={[styles.bookChipText, context.bookCode === book.book && styles.bookChipTextActive]}>{book.englishName}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chapterRail}>
        {chapters.map((chapter) => (
          <Pressable
            key={chapter.chapter}
            onPress={() => context.setChapterNumber(chapter.chapter)}
            style={[styles.chapterChip, context.chapterNumber === chapter.chapter && styles.chapterChipActive]}
          >
            <Text style={[styles.chapterChipText, context.chapterNumber === chapter.chapter && styles.chapterChipTextActive]}>{chapter.chapter}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function SegmentedControl({ values, active, onChange }) {
  return (
    <View style={styles.segmented}>
      {values.map((value) => (
        <Pressable key={value} onPress={() => onChange(value)} style={[styles.segment, active === value && styles.segmentActive]}>
          <Text style={[styles.segmentText, active === value && styles.segmentTextActive]}>{value}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SectionHeading({ kicker, title }) {
  return (
    <View style={styles.sectionHeading}>
      <Kicker>{kicker}</Kicker>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Kicker({ children }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

function PrimaryButton({ label, icon, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <Ionicons name={icon} size={17} color={colors.paper} />
    </Pressable>
  );
}

function translationName(translation) {
  return bibleManifest.versions[translation.toLowerCase()].name;
}

function books(translation = "KJV") {
  return bibleManifest.versions[translation.toLowerCase()].books;
}

function bookMeta(bookCode, translation = "KJV") {
  return books(translation).find((book) => book.book === bookCode);
}

function bookName(bookCode) {
  return bookMeta(bookCode)?.englishName || "Genesis";
}

function getBook(translation, bookCode) {
  return bookLoaders[translation][bookCode]();
}

function getChapter(translation, bookCode, chapterNumber) {
  return getBook(translation, bookCode).chapters.find((chapter) => chapter.chapter === chapterNumber);
}

function parseReference(ref) {
  const match = ref.match(/^(.+)\s+(\d+):(\d+)$/);
  if (!match) return null;
  return { bookName: match[1], chapter: Number(match[2]), verse: Number(match[3]) };
}

function findBookByName(name, translation = "KJV") {
  const normalized = name.toLowerCase();
  return books(translation).find((book) => book.englishName.toLowerCase() === normalized || book.book.toLowerCase() === normalized);
}

function getVerseText(ref, translation, sacredStyle) {
  const parsed = parseReference(ref);
  if (!parsed) return "";
  const book = findBookByName(parsed.bookName, translation);
  if (!book) return "";
  const chapter = getChapter(translation, book.book, parsed.chapter);
  const verse = chapter?.verses.find((item) => item.number === parsed.verse);
  return applySacredNames(verse?.text || "", sacredStyle);
}

function applySacredNames(text, sacredStyle) {
  const map = sacredStyles[sacredStyle].map;
  return text
    .replace(/\bLORD\b/g, map.LORD)
    .replace(/\bGod\b/g, map.God)
    .replace(/\bLord\b/g, map.Lord)
    .replace(/\bJesus\b/g, map.Jesus);
}

function toggleSaved(ref, context) {
  context.setSaved(context.saved.includes(ref) ? context.saved.filter((item) => item !== ref) : [...context.saved, ref]);
}

function getSearchResults(search, translation, sacredStyle) {
  const query = search.trim().toLowerCase();
  const results = [];

  if (!query) {
    return [
      ...discoveries,
      ...["John 3:16", "Psalm 23:1", "Matthew 5:9", "Romans 8:28"].map((ref) => referenceResult(ref, translation, sacredStyle)).filter(Boolean)
    ];
  }

  const parsed = parseReference(search.trim());
  if (parsed) {
    const result = referenceResult(search.trim(), translation, sacredStyle);
    if (result) results.push(result);
  }

  results.push(...discoveries.filter((item) => item.name.toLowerCase().includes(query) || item.meta.toLowerCase().includes(query)));

  for (const meta of books(translation)) {
    if (results.length >= 12) break;
    const book = getBook(translation, meta.book);

    if (meta.englishName.toLowerCase().includes(query)) {
      const firstVerse = book.chapters[0].verses[0];
      results.push({
        type: "verse",
        book: meta.book,
        chapter: 1,
        ref: `${meta.englishName} 1:1`,
        text: applySacredNames(firstVerse.text, sacredStyle)
      });
    }

    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        if (results.length >= 12) return results;
        if (verse.text.toLowerCase().includes(query)) {
          results.push({
            type: "verse",
            book: book.book,
            chapter: chapter.chapter,
            ref: `${book.englishName} ${chapter.chapter}:${verse.number}`,
            text: applySacredNames(verse.text, sacredStyle)
          });
        }
      }
    }
  }

  return results;
}

function referenceResult(ref, translation, sacredStyle) {
  const parsed = parseReference(ref);
  if (!parsed) return null;
  const book = findBookByName(parsed.bookName, translation);
  if (!book) return null;
  const chapter = getChapter(translation, book.book, parsed.chapter);
  const verse = chapter?.verses.find((item) => item.number === parsed.verse);
  if (!verse) return null;
  return {
    type: "verse",
    book: book.book,
    chapter: chapter.chapter,
    ref: `${book.englishName} ${chapter.chapter}:${verse.number}`,
    text: applySacredNames(verse.text, sacredStyle)
  };
}

const themes = {
  light: {
    paper: "#FAFAFA",
    page: "#FFFFFF",
    raised: "#F3F3F1",
    ink: "#333333",
    muted: "#73706B",
    gold: "#B58C5A",
    navy: "#333333",
    line: "rgba(51, 51, 51, 0.12)",
    whiteWash: "rgba(255, 255, 255, 0.78)",
    chipActive: "rgba(181, 140, 90, 0.12)",
    progressTrack: "rgba(51, 51, 51, 0.1)",
    shadow: "#333333"
  },
  dark: {
    paper: "#111111",
    page: "#181716",
    raised: "#1F1E1C",
    ink: "#EFEDEA",
    muted: "#A8A39C",
    gold: "#C7A16D",
    navy: "#F4F1EC",
    line: "rgba(244, 241, 236, 0.14)",
    whiteWash: "rgba(255, 255, 255, 0.06)",
    chipActive: "rgba(199, 161, 109, 0.16)",
    progressTrack: "rgba(244, 241, 236, 0.12)",
    shadow: "#000000"
  }
};

let colors = themes.light;
let styles = makeStyles(colors);

function makeStyles(colors) {
  return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper
  },
  appShell: {
    flex: 1,
    paddingHorizontal: 16
  },
  tabletShell: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1180,
    paddingHorizontal: 28
  },
  scrollContent: {
    paddingBottom: 64
  },
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 12
  },
  brand: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5
  },
  brandLight: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 27
  },
  brandStrong: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 27,
    fontWeight: "700"
  },
  nav: {
    gap: 6,
    paddingRight: 8
  },
  navItem: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent"
  },
  navItemActive: {
    backgroundColor: colors.whiteWash,
    borderColor: colors.line
  },
  navText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600"
  },
  navTextActive: {
    color: colors.ink
  },
  themeToggle: {
    alignSelf: "flex-start",
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.whiteWash,
    paddingHorizontal: 13
  },
  themeToggleText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700"
  },
  homeGrid: {
    gap: 36,
    paddingTop: 28
  },
  homeGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  continuePanel: {
    flex: 1,
    minWidth: 320,
    paddingVertical: 34,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  versePanel: {
    flex: 1,
    minWidth: 320,
    paddingVertical: 20
  },
  explorePanel: {
    width: "100%",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 10
  },
  heroTitle: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 68,
    lineHeight: 68
  },
  subtitle: {
    marginTop: 18,
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 32
  },
  muted: {
    color: colors.muted,
    lineHeight: 22
  },
  displayVerse: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 48,
    lineHeight: 52
  },
  reference: {
    marginTop: 12,
    color: colors.muted
  },
  primaryButton: {
    alignSelf: "flex-start",
    marginTop: 28,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.navy,
    paddingHorizontal: 20
  },
  primaryButtonText: {
    color: colors.paper,
    fontWeight: "800"
  },
  editorialRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  editorialText: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 30
  },
  controls: {
    gap: 12,
    paddingTop: 20,
    paddingBottom: 20
  },
  segmented: {
    alignSelf: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    padding: 3,
    backgroundColor: colors.whiteWash
  },
  segment: {
    minHeight: 36,
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 18
  },
  segmentActive: {
    backgroundColor: colors.navy
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.paper
  },
  bookRail: {
    gap: 8
  },
  bookChip: {
    minHeight: 38,
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13
  },
  bookChipActive: {
    borderColor: colors.gold,
    backgroundColor: colors.chipActive
  },
  bookChipText: {
    color: colors.muted,
    fontWeight: "700"
  },
  bookChipTextActive: {
    color: colors.navy
  },
  chapterRail: {
    gap: 8
  },
  chapterChip: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line
  },
  chapterChipActive: {
    backgroundColor: colors.navy
  },
  chapterChipText: {
    color: colors.muted,
    fontWeight: "800"
  },
  chapterChipTextActive: {
    color: colors.paper
  },
  scripturePage: {
    backgroundColor: colors.page,
    padding: 28,
    shadowColor: colors.shadow,
    shadowOpacity: 0.09,
    shadowRadius: 34,
    elevation: 2
  },
  readerTitle: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 54,
    lineHeight: 58,
    marginBottom: 24
  },
  verseLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  savePill: {
    marginTop: 11,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line
  },
  savePillActive: {
    borderColor: colors.gold,
    backgroundColor: colors.chipActive
  },
  scriptureText: {
    flex: 1,
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 29,
    lineHeight: 45,
    marginBottom: 8
  },
  firstVerse: {
    fontSize: 31
  },
  verseNumber: {
    color: colors.gold,
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "900"
  },
  sectionHeading: {
    alignItems: "center",
    paddingVertical: 34
  },
  sectionTitle: {
    maxWidth: 720,
    textAlign: "center",
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 48,
    lineHeight: 52
  },
  timeline: {
    borderLeftWidth: 1,
    borderLeftColor: colors.line,
    marginLeft: 10
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 34
  },
  timelineDot: {
    width: 13,
    height: 13,
    borderRadius: 999,
    backgroundColor: colors.gold,
    marginLeft: -7,
    marginTop: 4
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 28
  },
  timelineTitle: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 34
  },
  timelineCopy: {
    color: colors.muted,
    lineHeight: 24,
    marginVertical: 10
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.progressTrack,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.gold
  },
  parallelSpread: {
    flexDirection: "row",
    gap: 1,
    backgroundColor: colors.line
  },
  parallelStack: {
    flexDirection: "column"
  },
  parallelPage: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 22
  },
  parallelTitle: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 40,
    marginBottom: 18
  },
  parallelText: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 24,
    lineHeight: 36,
    marginBottom: 8
  },
  searchInput: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 30,
    marginBottom: 18
  },
  results: {
    gap: 4
  },
  resultRow: {
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  resultMeta: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8
  },
  resultText: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 27,
    lineHeight: 34
  },
  collectionTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20
  },
  collectionPill: {
    minHeight: 38,
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14
  },
  collectionPillActive: {
    backgroundColor: colors.navy
  },
  collectionText: {
    color: colors.muted,
    fontWeight: "800"
  },
  collectionTextActive: {
    color: colors.paper
  },
  savedItem: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  savedVerse: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 30,
    lineHeight: 38
  },
  namesLayout: {
    gap: 20
  },
  namesLayoutTablet: {
    flexDirection: "row"
  },
  namePreview: {
    flex: 1.2,
    minHeight: 360,
    justifyContent: "center",
    backgroundColor: colors.raised,
    padding: 28
  },
  nameOptions: {
    flex: 1,
    gap: 12
  },
  nameOption: {
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  nameOptionActive: {
    borderTopColor: colors.gold
  },
  nameOptionTitle: {
    color: colors.navy,
    fontFamily: "Georgia",
    fontSize: 28,
    marginBottom: 8
  }
  });
}

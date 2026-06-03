# Bible Journey

Bible Journey is a premium Bible reading experience focused on calm typography, generous whitespace, and simple scripture-first flows.

This first version is an Expo mobile app foundation for iOS, Android, phone, and tablet. It uses full local KJV, ASV, and WEB Bible data split into per-book JSON assets so the reading experience can be shaped without relying on an external Bible API.

## Run locally

```bash
npm run dev
```

Then scan the Expo QR code with Expo Go, or run:

```bash
npm run ios
npm run android
```

## Current screens

- Home with Continue Reading, Verse of the Day, and Explore
- Reading screen with sacred-name presentation styles
- Chronological Journey timeline
- Parallel Reader for KJV and WEB
- Universal Search for references, words, people, places, and events
- Saved Scripture collections
- Share Card preview
- Full local KJV, ASV, and WEB Bible data
- Per-book lazy loading for a mobile-friendly data foundation
- Premium phone and tablet layout direction
- Light and dark reading themes

## Bible data

The Bible data lives in `data/bibles`.

- `manifest.json` is the lightweight startup index.
- `books/<translation>/<book>.json` contains individual book files.
- `<translation>.metadata.json` keeps source and license metadata.

To refresh it:

```bash
npm run data:fetch
```

To re-split already downloaded whole-Bible JSON files:

```bash
npm run data:split
```

Source: https://github.com/midvash/bible-data

## Verification

```bash
npm run check
npx expo install --check
npx expo export --platform android --output-dir .expo-export-test
```

## Product guardrails

- Reading is the primary experience.
- Typography carries the design.
- Features should help users read, discover, revisit, or share scripture.
- Avoid dashboard patterns, heavy decoration, and religious clipart.

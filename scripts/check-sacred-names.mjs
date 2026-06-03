const sacredStyles = {
  traditional: {
    map: { LORD: "LORD", God: "God", Lord: "Lord", Jesus: "Jesus" }
  },
  hebrew: {
    map: { LORD: "Yahweh", God: "Elohim", Lord: "Adonai", Jesus: "Yahshua" }
  }
};

function applySacredNames(text, sacredStyle) {
  const map = sacredStyles[sacredStyle].map;
  const normalizedText = map.LORD === "LORD" ? text : text.replace(/\b[Tt]he LORD\b/g, map.LORD);

  return normalizedText
    .replace(/\bLORD\b/g, map.LORD)
    .replace(/\bGod\b/g, map.God)
    .replace(/\bLord\b/g, map.Lord)
    .replace(/\bJesus\b/g, map.Jesus);
}

const cases = [
  ["traditional", "The LORD is my shepherd.", "The LORD is my shepherd."],
  ["hebrew", "The LORD is my shepherd.", "Yahweh is my shepherd."],
  ["hebrew", "I waited for the LORD.", "I waited for Yahweh."],
  ["hebrew", "LORD, God, Lord, Jesus", "Yahweh, Elohim, Adonai, Yahshua"]
];

for (const [style, input, expected] of cases) {
  const actual = applySacredNames(input, style);
  if (actual !== expected) {
    throw new Error(`Expected "${expected}" but got "${actual}"`);
  }
}

console.log("Sacred name checks passed");

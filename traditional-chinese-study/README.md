# 學中文 — Traditional Chinese Study

An open-source website for learning Traditional Chinese (繁體字). No frameworks, no build tools — just HTML, CSS, and vanilla JavaScript. Content lives in plain JavaScript data files so anyone can contribute new material via a pull request.

![Screenshot placeholder](screenshot.png)

---

## Features

| Page | What it does |
|---|---|
| **首頁 Home** | Dashboard with progress stats (streak, words learned, passages read) |
| **詞彙 Vocabulary** | Flashcard-style word list with pinyin, meanings, and examples — filter by category, search, mark as learned |
| **閱讀 Reading** | Three graded passages (初級 / 中級 / 高級) — tap any word for an instant pinyin + definition popup, toggle pinyin above text with ruby annotations |
| **文法 Grammar** | Collapsible grammar notes with pattern, explanation, and example sentences |
| **筆順 Stroke Order** | Animated SVG stroke-by-stroke diagrams — step through manually or auto-animate |
| **對話 Conversation** | AI conversation partner powered by Claude — five real-life scenarios, corrections, quick-reply chips, pinyin / translation toggles |

---

## Run locally

Because the site loads data from local `.js` files, the simplest approach is any static file server:

```bash
# Python (built-in, no install needed)
cd traditional-chinese-study
python -m http.server 8080
# then open http://localhost:8080

# Node (if you have npx)
npx serve .

# VS Code: install the "Live Server" extension and click "Go Live"
```

> **You can also just double-click `index.html`** to open it in your browser.
> All features except the Conversation page work without a server.
> The Conversation page requires a server (or the `--allow-file-access-from-files` flag in Chrome) because it makes API calls.

---

## Conversation feature — adding your API key

1. Get a free API key at <https://console.anthropic.com/>
2. Open `config.js` and paste your key:

```js
const CONFIG = {
  apiKey: 'sk-ant-api03-...',   // ← your key here
  model:  'claude-haiku-4-5-20251001'
};
```

3. Save the file and refresh the Conversation page.

Your key is used directly from your local browser — it is never sent anywhere except to the Anthropic API.

---

## Contributing content

All study content lives in `data/` as plain JavaScript files. The format mirrors JSON exactly, so editing them requires no coding knowledge.

### Add vocabulary words — `data/vocabulary.js`

Append a new object to the `vocabData` array:

```js
{
  "id": "v023",                     // unique id, increment from last
  "chinese": "朋友",
  "pinyin": "Péngyǒu",              // tone diacritics required
  "meaning": "Friend",
  "category": "daily",              // greetings | food | numbers | daily
  "example": {
    "chinese": "他是我最好的朋友。",
    "pinyin": "Tā shì wǒ zuì hǎo de péngyǒu.",
    "english": "He is my best friend."
  }
}
```

### Add reading passages — `data/reading.js`

```js
{
  "id": "r004",
  "title": "台灣的茶文化",
  "titleEn": "Tea Culture in Taiwan",
  "difficulty": "中級",             // 初級 | 中級 | 高級
  "text": "台灣以茶聞名於世...",
  "annotations": {
    "台灣": { "pinyin": "Táiwān", "meaning": "Taiwan" }
    // add key/value pairs for any word you want to annotate
  }
}
```

### Add grammar notes — `data/grammar.js`

```js
{
  "id": "g007",
  "title": "还是 vs 或者 (or)",
  "pattern": "A 還是 B? / A 或者 B",
  "explanation": "還是 is used in questions; 或者 in statements.",
  "examples": [
    { "chinese": "你要茶還是咖啡？", "pinyin": "...", "english": "Tea or coffee?" }
  ]
}
```

### Add stroke characters — `data/strokes.js`

```js
{
  "id": "s011",
  "chinese": "女",
  "pinyin": "nǚ",
  "meaning": "woman / female",
  "strokeCount": 3,
  "radical": "女",
  "strokes": ["撇折", "撇", "橫"],
  "svgPaths": [
    "M 80,55 L 55,100 L 145,100",
    "M 100,35 L 45,160",
    "M 28,125 L 172,125"
  ]
}
```

SVG paths use a `200 × 200` viewBox. Each string is a standard SVG `d` attribute value.

---

## Pull request checklist

- [ ] New IDs are unique and follow the existing pattern (`v###`, `r###`, etc.)
- [ ] Pinyin includes tone diacritics (ā á ǎ à — not numbers)
- [ ] Traditional Chinese characters used throughout (not Simplified)
- [ ] Example sentences are natural and verified

---

## Project structure

```
traditional-chinese-study/
├── index.html          ← Dashboard
├── vocabulary.html
├── reading.html
├── grammar.html
├── strokes.html
├── conversation.html
├── config.js           ← API key goes here (never commit your key)
├── css/
│   └── style.css
├── js/
│   ├── main.js         ← Shared utilities + all page logic
│   └── conversation.js ← AI conversation partner
└── data/
    ├── vocabulary.js
    ├── reading.js
    ├── grammar.js
    └── strokes.js
```

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE).

Built with ❤️ and Claude.

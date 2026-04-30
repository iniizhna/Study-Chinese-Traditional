const grammarData = [
  {
    "id": "g001",
    "title": "Verb + 了 (completed action)",
    "pattern": "Subject + Verb + 了 (+ Object)",
    "explanation": "了 (le) placed immediately after a verb indicates that the action has been completed. It marks a specific completed event, not necessarily past tense — it can refer to future completion too.",
    "examples": [
      {
        "chinese": "我吃了。",
        "pinyin": "Wǒ chī le.",
        "english": "I ate. / I have eaten."
      },
      {
        "chinese": "她買了一件新衣服。",
        "pinyin": "Tā mǎi le yī jiàn xīn yīfú.",
        "english": "She bought a new piece of clothing."
      },
      {
        "chinese": "明天你做完了，就可以回家。",
        "pinyin": "Míngtiān nǐ zuòwán le, jiù kěyǐ huíjiā.",
        "english": "Tomorrow when you finish, you can go home."
      }
    ]
  },
  {
    "id": "g002",
    "title": "是...的 (emphasising circumstances)",
    "pattern": "Subject + 是 + [circumstance] + Verb + 的",
    "explanation": "The 是...的 structure is used to emphasise the time, place, manner, or agent of an action that is already known to have happened. The action itself is not in question — the emphasis is on the details.",
    "examples": [
      {
        "chinese": "他是昨天來的。",
        "pinyin": "Tā shì zuótiān lái de.",
        "english": "He came yesterday. (emphasis on when)"
      },
      {
        "chinese": "這件衣服是在網路上買的。",
        "pinyin": "Zhè jiàn yīfú shì zài wǎnglù shàng mǎi de.",
        "english": "This clothing was bought online. (emphasis on where)"
      },
      {
        "chinese": "她是坐飛機去的。",
        "pinyin": "Tā shì zuò fēijī qù de.",
        "english": "She went by plane. (emphasis on how)"
      }
    ]
  },
  {
    "id": "g003",
    "title": "把 construction (disposal of an object)",
    "pattern": "Subject + 把 + Object + Verb + Complement",
    "explanation": "The 把 (bǎ) construction moves the object before the verb to highlight the action done to it — often implying disposal, relocation, or transformation. The verb must be followed by a result or direction complement; it cannot stand alone.",
    "examples": [
      {
        "chinese": "我把書放在桌上。",
        "pinyin": "Wǒ bǎ shū fàng zài zhuō shàng.",
        "english": "I put the book on the table."
      },
      {
        "chinese": "請把門關上。",
        "pinyin": "Qǐng bǎ mén guān shàng.",
        "english": "Please close the door."
      },
      {
        "chinese": "他把作業做完了。",
        "pinyin": "Tā bǎ zuòyè zuò wán le.",
        "english": "He finished his homework."
      }
    ]
  },
  {
    "id": "g004",
    "title": "被 (passive voice)",
    "pattern": "Subject (receiver) + 被 + Agent + Verb + Complement",
    "explanation": "被 (bèi) marks a passive construction where the subject receives the action. In Mandarin, 被 sentences often carry a negative or undesirable connotation. The agent (who did the action) follows 被 but can be omitted.",
    "examples": [
      {
        "chinese": "我的錢包被偷了。",
        "pinyin": "Wǒ de qiánbāo bèi tōu le.",
        "english": "My wallet was stolen."
      },
      {
        "chinese": "這個問題被老師解決了。",
        "pinyin": "Zhège wèntí bèi lǎoshī jiějué le.",
        "english": "This problem was solved by the teacher."
      },
      {
        "chinese": "她被雨淋濕了。",
        "pinyin": "Tā bèi yǔ lín shī le.",
        "english": "She got soaked by the rain."
      }
    ]
  },
  {
    "id": "g005",
    "title": "比 (making comparisons)",
    "pattern": "A + 比 + B + Adjective (+ amount)",
    "explanation": "比 (bǐ) is used to compare two things directly. The adjective or predicate follows after B. You can add a specific degree (e.g. 多、大一點、高很多) after the adjective to quantify the difference. To say 'not as...as', use 沒有...那麼.",
    "examples": [
      {
        "chinese": "今天比昨天熱。",
        "pinyin": "Jīntiān bǐ zuótiān rè.",
        "english": "Today is hotter than yesterday."
      },
      {
        "chinese": "他比我高很多。",
        "pinyin": "Tā bǐ wǒ gāo hěnduō.",
        "english": "He is much taller than me."
      },
      {
        "chinese": "台灣的夏天沒有越南那麼熱。",
        "pinyin": "Táiwān de xiàtiān méiyǒu Yuènán nàme rè.",
        "english": "Taiwan's summer is not as hot as Vietnam's."
      }
    ]
  },
  {
    "id": "g006",
    "title": "再 vs 又 (two ways to say 'again')",
    "pattern": "再 (future / requests) · 又 (past repeated action)",
    "explanation": "Both 再 (zài) and 又 (yòu) mean 'again', but they are not interchangeable. 再 refers to a future or requested repetition ('do it again'), while 又 refers to something that has already happened again ('it happened again').",
    "examples": [
      {
        "chinese": "請再說一遍。",
        "pinyin": "Qǐng zài shuō yī biàn.",
        "english": "Please say it once more. (future request → 再)"
      },
      {
        "chinese": "他又遲到了！",
        "pinyin": "Tā yòu chídào le!",
        "english": "He's late again! (it already happened → 又)"
      },
      {
        "chinese": "這部電影太好看了，我想再看一次。",
        "pinyin": "Zhè bù diànyǐng tài hǎokàn le, wǒ xiǎng zài kàn yī cì.",
        "english": "This movie is so good, I want to watch it once more. (future → 再)"
      }
    ]
  }
];

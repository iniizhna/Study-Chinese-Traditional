const vocabData = [
  {
    "id": "v001",
    "chinese": "你好",
    "pinyin": "Nǐ hǎo",
    "meaning": "Hello",
    "category": "greetings",
    "example": {
      "chinese": "你好，很高興認識你。",
      "pinyin": "Nǐ hǎo, hěn gāoxìng rènshì nǐ.",
      "english": "Hello, nice to meet you."
    }
  },
  {
    "id": "v002",
    "chinese": "再見",
    "pinyin": "Zàijiàn",
    "meaning": "Goodbye",
    "category": "greetings",
    "example": {
      "chinese": "明天見！再見！",
      "pinyin": "Míngtiān jiàn! Zàijiàn!",
      "english": "See you tomorrow! Goodbye!"
    }
  },
  {
    "id": "v003",
    "chinese": "謝謝",
    "pinyin": "Xièxiè",
    "meaning": "Thank you",
    "category": "greetings",
    "example": {
      "chinese": "謝謝你的幫忙。",
      "pinyin": "Xièxiè nǐ de bāngmáng.",
      "english": "Thank you for your help."
    }
  },
  {
    "id": "v004",
    "chinese": "對不起",
    "pinyin": "Duìbuqǐ",
    "meaning": "Sorry / Excuse me",
    "category": "greetings",
    "example": {
      "chinese": "對不起，我遲到了。",
      "pinyin": "Duìbuqǐ, wǒ chídào le.",
      "english": "Sorry, I'm late."
    }
  },
  {
    "id": "v005",
    "chinese": "沒關係",
    "pinyin": "Méiguānxi",
    "meaning": "It's okay / No problem",
    "category": "greetings",
    "example": {
      "chinese": "沒關係，我不介意。",
      "pinyin": "Méiguānxi, wǒ bù jièyì.",
      "english": "It's okay, I don't mind."
    }
  },
  {
    "id": "v006",
    "chinese": "飯",
    "pinyin": "Fàn",
    "meaning": "Cooked rice / meal",
    "category": "food",
    "example": {
      "chinese": "我想吃飯。",
      "pinyin": "Wǒ xiǎng chī fàn.",
      "english": "I want to eat rice."
    }
  },
  {
    "id": "v007",
    "chinese": "麵",
    "pinyin": "Miàn",
    "meaning": "Noodles",
    "category": "food",
    "example": {
      "chinese": "這碗麵很好吃。",
      "pinyin": "Zhè wǎn miàn hěn hǎochī.",
      "english": "This bowl of noodles is delicious."
    }
  },
  {
    "id": "v008",
    "chinese": "茶",
    "pinyin": "Chá",
    "meaning": "Tea",
    "category": "food",
    "example": {
      "chinese": "你要喝茶還是咖啡？",
      "pinyin": "Nǐ yào hē chá háishì kāfēi?",
      "english": "Do you want tea or coffee?"
    }
  },
  {
    "id": "v009",
    "chinese": "水",
    "pinyin": "Shuǐ",
    "meaning": "Water",
    "category": "food",
    "example": {
      "chinese": "請給我一杯水。",
      "pinyin": "Qǐng gěi wǒ yī bēi shuǐ.",
      "english": "Please give me a glass of water."
    }
  },
  {
    "id": "v010",
    "chinese": "雞肉",
    "pinyin": "Jīròu",
    "meaning": "Chicken (meat)",
    "category": "food",
    "example": {
      "chinese": "我不吃雞肉。",
      "pinyin": "Wǒ bù chī jīròu.",
      "english": "I don't eat chicken."
    }
  },
  {
    "id": "v011",
    "chinese": "一",
    "pinyin": "Yī",
    "meaning": "One (1)",
    "category": "numbers",
    "example": {
      "chinese": "我有一個蘋果。",
      "pinyin": "Wǒ yǒu yī gè píngguǒ.",
      "english": "I have one apple."
    }
  },
  {
    "id": "v012",
    "chinese": "二",
    "pinyin": "Èr",
    "meaning": "Two (2)",
    "category": "numbers",
    "example": {
      "chinese": "我買了二本書。",
      "pinyin": "Wǒ mǎi le èr běn shū.",
      "english": "I bought two books."
    }
  },
  {
    "id": "v013",
    "chinese": "三",
    "pinyin": "Sān",
    "meaning": "Three (3)",
    "category": "numbers",
    "example": {
      "chinese": "她有三個孩子。",
      "pinyin": "Tā yǒu sān gè háizi.",
      "english": "She has three children."
    }
  },
  {
    "id": "v014",
    "chinese": "十",
    "pinyin": "Shí",
    "meaning": "Ten (10)",
    "category": "numbers",
    "example": {
      "chinese": "商店十點開門。",
      "pinyin": "Shāngdiàn shí diǎn kāimén.",
      "english": "The store opens at ten o'clock."
    }
  },
  {
    "id": "v015",
    "chinese": "百",
    "pinyin": "Bǎi",
    "meaning": "Hundred (100)",
    "category": "numbers",
    "example": {
      "chinese": "這件衣服一百塊。",
      "pinyin": "Zhè jiàn yīfú yī bǎi kuài.",
      "english": "This piece of clothing costs one hundred dollars."
    }
  },
  {
    "id": "v016",
    "chinese": "我",
    "pinyin": "Wǒ",
    "meaning": "I / me",
    "category": "daily",
    "example": {
      "chinese": "我是學生。",
      "pinyin": "Wǒ shì xuéshēng.",
      "english": "I am a student."
    }
  },
  {
    "id": "v017",
    "chinese": "你",
    "pinyin": "Nǐ",
    "meaning": "You",
    "category": "daily",
    "example": {
      "chinese": "你叫什麼名字？",
      "pinyin": "Nǐ jiào shénme míngzì?",
      "english": "What is your name?"
    }
  },
  {
    "id": "v018",
    "chinese": "是",
    "pinyin": "Shì",
    "meaning": "To be (am / is / are)",
    "category": "daily",
    "example": {
      "chinese": "這是我的書包。",
      "pinyin": "Zhè shì wǒ de shūbāo.",
      "english": "This is my backpack."
    }
  },
  {
    "id": "v019",
    "chinese": "不",
    "pinyin": "Bù",
    "meaning": "No / not",
    "category": "daily",
    "example": {
      "chinese": "我不喜歡下雨天。",
      "pinyin": "Wǒ bù xǐhuān xià yǔ tiān.",
      "english": "I don't like rainy days."
    }
  },
  {
    "id": "v020",
    "chinese": "去",
    "pinyin": "Qù",
    "meaning": "To go",
    "category": "daily",
    "example": {
      "chinese": "我想去日本旅行。",
      "pinyin": "Wǒ xiǎng qù Rìběn lǚxíng.",
      "english": "I want to travel to Japan."
    }
  },
  {
    "id": "v021",
    "chinese": "好",
    "pinyin": "Hǎo",
    "meaning": "Good / well",
    "category": "daily",
    "example": {
      "chinese": "今天天氣很好。",
      "pinyin": "Jīntiān tiānqì hěn hǎo.",
      "english": "The weather is very good today."
    }
  },
  {
    "id": "v022",
    "chinese": "很",
    "pinyin": "Hěn",
    "meaning": "Very / quite",
    "category": "daily",
    "example": {
      "chinese": "這道菜很辣。",
      "pinyin": "Zhè dào cài hěn là.",
      "english": "This dish is very spicy."
    }
  }
];

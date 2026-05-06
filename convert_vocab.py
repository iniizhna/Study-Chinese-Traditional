import sys, io, json, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import openpyxl

LEVEL_MAP = {
    '準備級一級(Novice 1)': {
        'level': 'novice1', 'prefix': 'n1_',
        'levelLabel': '準備級一級', 'levelEn': 'Novice 1'
    },
    '準備級二級(Novice 2)': {
        'level': 'novice2', 'prefix': 'n2_',
        'levelLabel': '準備級二級', 'levelEn': 'Novice 2'
    },
    '入門級(Level 1)': {
        'level': 'a1', 'prefix': 'a1_',
        'levelLabel': '入門級', 'levelEn': 'A1'
    },
    '基礎級(Level 2)': {
        'level': 'a2', 'prefix': 'a2_',
        'levelLabel': '基礎級', 'levelEn': 'A2'
    },
}

CATEGORY_EN = {
    '個人資料':         'Personal Information',
    '日常生活':         'Daily Life',
    '飲食':            'Food & Drink',
    '購物':            'Shopping',
    '旅行':            'Travel',
    '教育':            'Education',
    '工作':            'Work',
    '房屋與家庭、環境': 'Home & Family',
    '閒暇時間、娛樂':  'Leisure & Entertainment',
    '與他人的關係':    'Relationships',
    '其他':            'Other',
    '健康及身體照護':  'Health & Body Care',
}

wb = openpyxl.load_workbook('8000words.xlsx')
words = []
counters = {k: 0 for k in LEVEL_MAP}

for sheet_name, info in LEVEL_MAP.items():
    ws = wb[sheet_name]
    for row in ws.iter_rows(min_row=2, values_only=True):
        cat, chinese, pinyin, pos = (row[0], row[1], row[2], row[3])
        if not chinese:
            continue
        cat = (cat or '').strip()
        chinese = str(chinese).strip()
        pinyin = str(pinyin or '').strip()
        pos = str(pos or '').strip()
        counters[sheet_name] += 1
        idx = counters[sheet_name]
        word_id = f"{info['prefix']}{idx:03d}"
        words.append({
            'id': word_id,
            'chinese': chinese,
            'pinyin': pinyin,
            'meaning': '',
            'partOfSpeech': pos,
            'category': cat,
            'categoryEn': CATEGORY_EN.get(cat, cat),
            'level': info['level'],
            'levelLabel': info['levelLabel'],
            'levelEn': info['levelEn'],
        })

out = 'd:/learningapp/data/vocabulary.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print(f"Done — {len(words)} words written to {out}")
for sn, cnt in counters.items():
    print(f"  {sn}: {cnt} words")

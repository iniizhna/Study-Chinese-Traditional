/* ═══════════════════════════════════════════════════════════
   conversation.js — AI Conversation Partner
   ═══════════════════════════════════════════════════════════ */

const SCENARIOS = {
  '日常對話': 'We are having a casual everyday conversation in Traditional Chinese. Topics may include weather, hobbies, daily life, family, or weekend plans.',
  '餐廳點餐': 'We are in a Taiwanese restaurant. You play the waiter/waitress and help the customer order food and drinks. Suggest popular Taiwanese dishes.',
  '市場購物': 'We are at a traditional Taiwanese market. You play a friendly vendor selling fruits, vegetables, or local goods. Include price negotiation.',
  '問路':     'The user is lost and asking for directions in Taipei. You are a helpful local giving clear directions using landmarks and public transport.',
  '自我介紹': 'We are meeting for the first time. Help the user practice introducing themselves — name, hometown, occupation, hobbies, and language learning goals.'
};

const SYSTEM_BASE = `You are a Traditional Chinese (繁體字) conversation partner helping an English speaker learn Mandarin Chinese as spoken in Taiwan.

IMPORTANT: You must ALWAYS reply with valid JSON only — no prose outside the JSON object. Use this exact schema:
{
  "chinese":     "Your reply in Traditional Chinese characters",
  "pinyin":      "Full pinyin with tone diacritics (ā á ǎ à / ē é ě è / etc.)",
  "translation": "Natural English translation of your reply",
  "correction":  null,
  "quickReplies": ["reply option 1 in Traditional Chinese", "reply option 2", "reply option 3"],
  "vocabWord":   { "word": "一個 new word from your reply", "pinyin": "yī gè", "meaning": "English meaning" }
}

Rules:
- Use Traditional Chinese characters exclusively (繁體字), never Simplified.
- Pinyin must always include tone diacritics.
- "correction" should be null if the user's Chinese was fine. If there was a grammar or vocabulary error, set it to a short English explanation with the correct form.
- "quickReplies" should be 2–3 short, natural follow-up phrases the user could say next (in Traditional Chinese).
- "vocabWord" should highlight one useful word or phrase from YOUR reply.
- Keep your replies conversational, encouraging, and appropriately short (1–3 sentences).
- Scenario context: `;

let currentScenario = '日常對話';
let messages = [];         // conversation history for API (role + content)
let showPinyin       = true;
let showTranslation  = true;
let showCorrections  = true;
let isLoading        = false;

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const apiKey = (typeof CONFIG !== 'undefined') ? CONFIG.apiKey.trim() : '';

  if (!apiKey) {
    document.getElementById('apiNotice').style.display = 'block';
  }

  // Scenario chips
  const scenarioContainer = document.getElementById('scenarioChips');
  Object.keys(SCENARIOS).forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (name === currentScenario ? ' active' : '');
    btn.textContent = name;
    btn.addEventListener('click', () => switchScenario(name));
    scenarioContainer.appendChild(btn);
  });

  // Toggle buttons
  document.getElementById('togglePinyin').addEventListener('click', function() {
    showPinyin = !showPinyin;
    this.classList.toggle('on', showPinyin);
    document.body.classList.toggle('hide-pinyin', !showPinyin);
  });
  document.getElementById('toggleTranslation').addEventListener('click', function() {
    showTranslation = !showTranslation;
    this.classList.toggle('on', showTranslation);
    document.body.classList.toggle('hide-translation', !showTranslation);
  });
  document.getElementById('toggleCorrections').addEventListener('click', function() {
    showCorrections = !showCorrections;
    this.classList.toggle('on', showCorrections);
    document.body.classList.toggle('hide-corrections', !showCorrections);
  });

  // Send button + Enter key
  const input  = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  // Clear button
  document.getElementById('clearBtn').addEventListener('click', clearConversation);

  // Load saved conversation for this scenario
  loadConversation();
});

/* ── Scenario switch ──────────────────────────────────────── */
function switchScenario(name) {
  if (name === currentScenario) return;
  currentScenario = name;

  document.querySelectorAll('#scenarioChips .chip').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === name);
  });

  loadConversation();
}

/* ── Conversation persistence ──────────────────────────────── */
function loadConversation() {
  const key  = 'conv_' + currentScenario;
  messages   = Storage.get(key, []);
  const win  = document.getElementById('chatWindow');
  win.innerHTML = '';

  if (messages.length === 0) {
    showWelcome();
  } else {
    // Re-render saved messages
    messages.forEach(m => {
      if (m.role === 'user') {
        appendBubble('user', m.content, null);
      } else {
        try {
          const parsed = JSON.parse(m.content);
          appendBubble('ai', null, parsed);
        } catch {
          appendBubble('ai', null, { chinese: m.content, pinyin: '', translation: '', correction: null, quickReplies: [], vocabWord: null });
        }
      }
    });
  }
  scrollChat();
}

function saveConversation() {
  Storage.set('conv_' + currentScenario, messages);
}

function clearConversation() {
  messages = [];
  Storage.set('conv_' + currentScenario, []);
  document.getElementById('chatWindow').innerHTML = '';
  showWelcome();
}

function showWelcome() {
  const win = document.getElementById('chatWindow');
  const labels = {
    '日常對話': 'Start a casual everyday conversation.',
    '餐廳點餐': 'You\'re at a Taiwanese restaurant. Try ordering food!',
    '市場購物': 'You\'re at a traditional market. Ask about prices!',
    '問路':     'You\'re lost in Taipei. Ask for directions!',
    '自我介紹': 'Introduce yourself to your new language partner!'
  };
  win.innerHTML = `
    <div style="text-align:center;padding:2rem 1rem;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">💬</div>
      <div style="font-family:var(--font-chinese);font-size:1rem;margin-bottom:.25rem">${currentScenario}</div>
      <div style="font-size:.85rem">${labels[currentScenario] || ''}</div>
    </div>`;
}

/* ── Send message ─────────────────────────────────────────── */
function handleSend() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text || isLoading) return;

  const apiKey = (typeof CONFIG !== 'undefined') ? CONFIG.apiKey.trim() : '';
  if (!apiKey) {
    showToast('Add your Anthropic API key in config.js first.');
    return;
  }

  input.value = '';
  sendMessage(text, apiKey);
}

async function sendMessage(userText, apiKey) {
  isLoading = true;
  document.getElementById('sendBtn').disabled = true;

  // Add user message to history and render
  messages.push({ role: 'user', content: userText });
  appendBubble('user', userText, null);
  scrollChat();

  // Typing indicator
  const typingId = showTyping();

  const systemPrompt = SYSTEM_BASE + SCENARIOS[currentScenario];

  // Build messages for API (keep last 20 to stay within token limits)
  const apiMessages = messages.slice(-20).map(m => ({
    role:    m.role,
    content: m.role === 'user' ? m.content : m.content
  }));

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':                               apiKey,
        'anthropic-version':                       '2023-06-01',
        'content-type':                            'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model:      CONFIG.model || 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system:     systemPrompt,
        messages:   apiMessages
      })
    });

    removeTyping(typingId);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || '';

    let parsed;
    try {
      // Extract JSON even if model wraps it in markdown fences
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      parsed = {
        chinese:     rawText,
        pinyin:      '',
        translation: '',
        correction:  null,
        quickReplies: [],
        vocabWord:   null
      };
    }

    // Store assistant reply
    messages.push({ role: 'assistant', content: JSON.stringify(parsed) });
    saveConversation();

    appendBubble('ai', null, parsed);
    scrollChat();

  } catch (err) {
    removeTyping(typingId);
    showToast('Error: ' + err.message);
  } finally {
    isLoading = false;
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('chatInput').focus();
  }
}

/* ── Render bubbles ───────────────────────────────────────── */
function appendBubble(role, text, parsed) {
  const win = document.getElementById('chatWindow');
  const welcome = win.querySelector('div[style*="padding:2rem"]');
  if (welcome) welcome.remove();

  const msg = document.createElement('div');
  msg.className = 'msg ' + role;

  if (role === 'user') {
    msg.innerHTML = `
      <div class="msg-avatar">😊</div>
      <div class="msg-bubble">
        <span class="msg-chinese">${escHtml(text)}</span>
      </div>`;
  } else {
    const correction = parsed.correction
      ? `<div class="correction-box">
           <div class="correction-label">Correction</div>
           ${escHtml(parsed.correction)}
         </div>` : '';

    const vocab = parsed.vocabWord
      ? `<div class="vocab-highlight">
           <span class="vh-word">${escHtml(parsed.vocabWord.word)}</span>
           <span class="pinyin"> ${escHtml(parsed.vocabWord.pinyin)}</span>
           — ${escHtml(parsed.vocabWord.meaning)}
         </div>` : '';

    const quickReplies = (parsed.quickReplies || []).length
      ? `<div class="quick-replies">
           ${parsed.quickReplies.map(r =>
             `<button class="quick-reply-chip" onclick="useQuickReply(this)">${escHtml(r)}</button>`
           ).join('')}
         </div>` : '';

    msg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div>
        <div class="msg-bubble">
          <span class="msg-chinese">${escHtml(parsed.chinese || '')}</span>
          <span class="msg-pinyin">${escHtml(parsed.pinyin || '')}</span>
          <span class="msg-translation">${escHtml(parsed.translation || '')}</span>
          ${correction}
          ${vocab}
        </div>
        ${quickReplies}
      </div>`;
  }

  win.appendChild(msg);
}

function useQuickReply(btn) {
  const text = btn.textContent;
  document.getElementById('chatInput').value = text;
  document.getElementById('chatInput').focus();
}

/* ── Typing indicator ─────────────────────────────────────── */
function showTyping() {
  const win = document.getElementById('chatWindow');
  const id  = 'typing-' + Date.now();
  const el  = document.createElement('div');
  el.className = 'msg';
  el.id = id;
  el.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>`;
  win.appendChild(el);
  scrollChat();
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/* ── Helpers ─────────────────────────────────────────────── */
function scrollChat() {
  const win = document.getElementById('chatWindow');
  win.scrollTop = win.scrollHeight;
}

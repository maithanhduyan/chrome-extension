# Cấu trúc Dự án như sau:

```
../AUTOTRANSLATE/
├── background.js
├── content.js
└── manifest.json
```

# Danh sách chi tiết các file:

## File ../AUTOTRANSLATE/background.js:
```javascript
// Khởi tạo đối tượng ngôn ngữ
const languages = {
  AFRIKAANS: "af",
  ALBANIAN: "sq",
  AMHARIC: "am",
  ARABIC: "ar",
  ARMENIAN: "hy",
  AZERBAIJANI: "az",
  BASQUE: "eu",
  BELARUSIAN: "be",
  BENGALI: "bn",
  BIHARI: "bh",
  BRETON: "br",
  BULGARIAN: "bg",
  BURMESE: "my",
  CATALAN: "ca",
  CHEROKEE: "chr",
  CHINESE: "zh",
  CHINESE_SIMPLIFIED: "zh-CN",
  CHINESE_TRADITIONAL: "zh-TW",
  CORSICAN: "co",
  CROATIAN: "hr",
  CZECH: "cs",
  DANISH: "da",
  DHIVEHI: "dv",
  DUTCH: "nl",
  ENGLISH: "en",
  ESPERANTO: "eo",
  ESTONIAN: "et",
  FAROESE: "fo",
  FILIPINO: "tl",
  FINNISH: "fi",
  FRENCH: "fr",
  FRISIAN: "fy",
  GALICIAN: "gl",
  GEORGIAN: "ka",
  GERMAN: "de",
  GREEK: "el",
  GUJARATI: "gu",
  HAITIAN_CREOLE: "ht",
  HEBREW: "iw",
  HINDI: "hi",
  HUNGARIAN: "hu",
  ICELANDIC: "is",
  INDONESIAN: "id",
  INUKTITUT: "iu",
  IRISH: "ga",
  ITALIAN: "it",
  JAPANESE: "ja",
  JAVANESE: "jw",
  KANNADA: "kn",
  KAZAKH: "kk",
  KHMER: "km",
  KOREAN: "ko",
  KURDISH: "ku",
  KYRGYZ: "ky",
  LAO: "lo",
  LAOTHIAN: "lo",
  LATIN: "la",
  LATVIAN: "lv",
  LITHUANIAN: "lt",
  LUXEMBOURGISH: "lb",
  MACEDONIAN: "mk",
  MALAY: "ms",
  MALAYALAM: "ml",
  MALTESE: "mt",
  MAORI: "mi",
  MARATHI: "mr",
  MONGOLIAN: "mn",
  NEPALI: "ne",
  NORWEGIAN: "no",
  OCCITAN: "oc",
  ORIYA: "or",
  PASHTO: "ps",
  PERSIAN: "fa",
  POLISH: "pl",
  PORTUGUESE: "pt",
  PORTUGUESE_PORTUGAL: "pt-PT",
  PUNJABI: "pa",
  QUECHUA: "qu",
  ROMANIAN: "ro",
  RUSSIAN: "ru",
  SANSKRIT: "sa",
  SCOTS_GAELIC: "gd",
  SERBIAN: "sr",
  SINDHI: "sd",
  SINHALESE: "si",
  SLOVAK: "sk",
  SLOVENIAN: "sl",
  SPANISH: "es",
  SUNDANESE: "su",
  SWAHILI: "sw",
  SWEDISH: "sv",
  SYRIAC: "syr",
  TAGALOG: "tl",
  TAJIK: "tg",
  TAMIL: "ta",
  TATAR: "tt",
  TELUGU: "te",
  THAI: "th",
  TIBETAN: "bo",
  TONGA: "to",
  TURKISH: "tr",
  UIGHUR: "ug",
  UKRAINIAN: "uk",
  URDU: "ur",
  UZBEK: "uz",
  VIETNAMESE: "vi",
  WELSH: "cy",
  YIDDISH: "yi",
  YORUBA: "yo",
};

// Khởi tạo storage với async/await
async function initializeStorage() {
  const { languages: storedLangs, defaults: storedDefaults, options: storedOptions } =
    await chrome.storage.local.get(['languages', 'defaults', 'options']);

  if (!storedLangs) {
    await chrome.storage.local.set({ languages });
  }

  const defaults = {
    from: "auto",
    first: "vi",
    second: "en",
    ctrl: false,
    alt: false,
    meta: false,
    shift: false,
    selection: true,
    mouseover: false,
    theme: "black",
  };

  if (!storedDefaults) {
    await chrome.storage.local.set({ defaults });
  }

  if (!storedOptions) {
    await chrome.storage.local.set({ options: [defaults] });
  } else if (!Array.isArray(storedOptions)) {
    const options = [];
    for (const i in storedOptions.hotkeys) {
      const o = { ...defaults };
      o.theme = storedOptions.theme;
      o.from = storedOptions.hotkeys[i].from?.value || "auto";
      o.first = storedOptions.hotkeys[i].first?.value || defaults.first;
      o.second = storedOptions.hotkeys[i].second?.value || defaults.second;
      i.split("+").forEach(k => o[k.toLowerCase()] = true);
      options.push(o);
    }
    await chrome.storage.local.set({ options });
  }
}

const themes = {
  black: '<div class="auto-translate-black"><div class="lang auto-translate-lang"></div><div class="translation auto-translate-translation"></div><div class="additional"></div></div>',
  white: '<div class="auto-translate-white"><div class="lang auto-translate-lang"></div><div class="translation auto-translate-translation"></div><div class="additional"></div></div>',
  customize: "",
};

let holds = [];
let holdsMap = {};
const keys = ["Ctrl", "Alt", "Shift", "Meta"];

function pushHold(hold, o) {
  holds.push(hold);
  holdsMap[hold] = o;
}

async function load() {
  holds = [];
  holdsMap = {};
  const { options } = await chrome.storage.local.get("options");
  (options || []).forEach(o => {
    const h = keys.filter(k => o[k.toLowerCase()]);
    if (o.selection) pushHold(h.join("+") + "+Selection", o);
    if (o.mouseover) pushHold(h.join("+") + "+Mouseover", o);
  });
}

// Khởi tạo
initializeStorage().then(load);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === "holds") {
    sendResponse(holds);
    return true;
  }

  if (request?.message) {
    switch (request.message) {
      case "translate":
        const options = holdsMap[request.context.hotkeys];
        if (options) {
          request.context.theme = themes[options.theme];
          request.context.themeName = options.theme;
          translate(request.context.text, options, request.context);
        }
        break;
      case "options":
        load();
        break;
    }
  }
  return true;
});

let latest = "auto";

async function _translate(text, from, to) {
  const url = new URL("https://translate.googleapis.com/translate_a/single?dt=t&dt=bd");
  const params = {
    dt: "t",
    dt: "bd",
    client: "gtx",
    q: text,
    sl: from,
    tl: to,
    dj: 1,
    source: "bubble"
  };

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function translate(text, options, context) {
  try {
    const from = options.from === "latest" ? latest : options.from;
    let to = options.first;
    if (from === to) to = options.second;

    const data = await _translate(text, from, to);

    // Xử lý lỗi undefined
    const sentences = Array.isArray(data?.sentences) ? data.sentences : [];
    const translatedText = sentences.length > 0
      ? sentences.map(s => s.trans || "").join("<br/>")
      : "No translation available";

    latest = data?.src || from;  // Cập nhật latest language

    context.translation = translatedText;
    context.additional = "";
    context.lang = { from: latest, to };

    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, {
      message: "result",
      context
    });
  } catch (error) {
    console.error("Translation Error:", error);
    context.translation = `Translation failed: ${error.message}`;
    context.additional = "";
    context.lang = { from: options.from, to: options.second };

    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, {
      message: "result",
      context
    });
  }
}
```

## File ../AUTOTRANSLATE/content.js:
```javascript
let holds = [];

async function initHolds() {
    holds = await new Promise(resolve => {
        chrome.runtime.sendMessage("holds", resolve);
    });
}

$(document).ready(async () => {
    await initHolds();

    const mouseoverDelay = 300;
    let asyncCounter = 0;
    let popup;
    const popupOffset = 5;

    function createPopup() {
        popup = document.createElement("div");
        popup.className = "auto-translate-div";
        popup.style.position = "absolute";
        popup.style.zIndex = "10000";
    }

    function resetStyles(el) {
        if (el) {
            el.style.color = "inherit";
            el.style.background = "none";
            el.style.border = "none";
        }
    }

    function showPopup(context) {
        if (!popup) createPopup();

        popup.style.display = "block";
        if (!popup.parentNode) document.body.appendChild(popup);

        popup.innerHTML = context.theme;

        const langEl = popup.querySelector(".lang");
        const transEl = popup.querySelector(".translation");
        const addEl = popup.querySelector(".additional");

        resetStyles(langEl);
        resetStyles(transEl);
        resetStyles(addEl);

        langEl.innerHTML = `${context.lang.from} → ${context.lang.to}`;
        transEl.innerHTML = context.translation;
        addEl.innerHTML = context.additional;

        if (context.translation.startsWith("Translation failed")) {
            transEl.style.color = "#ff4444";
        }

        const rect = context.rect;
        const top = (popup.offsetHeight + popupOffset < rect.y)
            ? rect.y - popup.offsetHeight - popupOffset
            : rect.y + rect.h + popupOffset;

        let left = rect.x + rect.w / 2 - popup.offsetWidth / 2;
        left = Math.min(left, document.body.clientWidth - popup.offsetWidth - popupOffset);
        left = Math.max(left, popupOffset);

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }

    chrome.runtime.onMessage.addListener((m) => {
        if (m.message === "result" && m.context.async === asyncCounter) {
            showPopup(m.context);
        }
    });

    const keys = ["Ctrl", "Alt", "Shift", "Meta"];

    function invoke(e, type) {
        const hotkeys = keys.filter(k => e[`${k.toLowerCase()}Key`]).join("+");
        const selectionKey = `${hotkeys}+Selection`;
        const mouseoverKey = `${hotkeys}+Mouseover`;
        let text = "";
        let rect = { x: 0, y: 0, w: 0, h: 0 };

        if (holds.includes(selectionKey) && type === "mouseup") {
            const selection = window.getSelection();
            if (selection?.rangeCount > 0) {
                text = selection.toString();
                const bcr = selection.getRangeAt(0).getBoundingClientRect();
                rect = {
                    x: bcr.left + window.scrollX,
                    y: bcr.top + window.scrollY,
                    w: bcr.width,
                    h: bcr.height,
                };
                sendTranslateRequest(text, selectionKey, rect);
            }
        }

        if (holds.includes(mouseoverKey) && type === "mouseover") {
            const data = getWordAtPoint(e.target, e.x, e.y);
            if (data) {
                text = data.text;
                rect = data.rect;
                sendTranslateRequest(text, mouseoverKey, rect);
            }
        }
    }

    function sendTranslateRequest(text, hotkeys, rect) {
        if (!text) return;
        chrome.runtime.sendMessage({
            message: "translate",
            context: {
                text,
                hotkeys,
                rect,
                async: ++asyncCounter
            }
        });
    }

    let mouseoverTimeout;
    let holdMouseover = false;

    document.body.addEventListener("mouseup", e => {
        clearTimeout(mouseoverTimeout);
        holdMouseover = true;
        setTimeout(() => holdMouseover = false, mouseoverDelay * 2);
        invoke(e, "mouseup");
    });

    document.body.addEventListener("mousemove", e => {
        if (holdMouseover) return;
        clearTimeout(mouseoverTimeout);
        mouseoverTimeout = setTimeout(() => invoke(e, "mouseover"), mouseoverDelay);
    });

    document.body.addEventListener("mousedown", e => {
        if (!popup || !popup.parentNode) return;
        let target = e.target;
        while (target) {
            if (target === popup) return;
            target = target.parentNode;
        }
        popup.style.display = "none";
        popup.parentNode.removeChild(popup);
    });

    function getWordAtPoint(elem, x, y) {
        if (elem.nodeType === Node.TEXT_NODE) {
            const range = elem.ownerDocument.createRange();
            range.selectNodeContents(elem);
            let pos = 0;
            const end = range.endOffset;

            while (pos < end) {
                range.setStart(elem, pos);
                range.setEnd(elem, pos + 1);
                const bcr = range.getBoundingClientRect();
                if (bcr.left <= x && bcr.right >= x && bcr.top <= y && bcr.bottom >= y) {
                    range.expand("word");
                    const text = range.toString();
                    const rect = range.getBoundingClientRect();
                    range.detach();
                    return {
                        text,
                        rect: {
                            x: rect.left + window.scrollX,
                            y: rect.top + window.scrollY,
                            w: rect.width,
                            h: rect.height
                        }
                    };
                }
                pos++;
            }
            range.detach();
        } else {
            for (const child of elem.childNodes) {
                const result = getWordAtPoint(child, x, y);
                if (result) return result;
            }
        }
        return null;
    }
});
```


//

function getOS() {
  var OSName = "unknown OS";
  if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
  return OSName;
}

var languages = {
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
  //UNKNOWN: "",
  URDU: "ur",
  UZBEK: "uz",
  VIETNAMESE: "vi",
  WELSH: "cy",
  YIDDISH: "yi",
  YORUBA: "yo",
};

localStorage["languages"] ||
  (localStorage["languages"] = JSON.stringify(languages));

var defaults = {
  from: "auto",
  first: "vi", // navigator.language.split('-')[0]
  second: "en",
  //ctrl: (getOS() == "MacOS") ? false : true,
  ctr: false,
  alt: false,
  //meta: (getOS() != "MacOS") ? false : true,
  meta: false,
  shift: false,
  selection: true,
  mouseover: false,
  theme: "black",
};
localStorage["defaults"] = JSON.stringify(defaults);

if (!localStorage["options"]) {
  localStorage["options"] = JSON.stringify([defaults]);
}

var options = JSON.parse(localStorage["options"]);
if (!(options instanceof Array)) {
  old = options;
  options = [];
  for (i in old.hotkeys) {
    i.split("+");
    var o = JSON.parse(localStorage["defaults"]);
    o.theme = old.theme;
    o.from = old.hotkeys[i].from.value || "auto";
    old.hotkeys[i].first.value && (o.first = old.hotkeys[i].first.value);
    o.second = old.hotkeys[i].second.value;
    i.split("+").forEach(function (k) {
      o[k.toLowerCase()] = true;
    });
    options.push(o);
  }
  localStorage["options"] = JSON.stringify(options);
}

var themes = {
  black:
    '<div class="auto-translate-black"><div class="lang auto-translate-lang"></div><div class="translation auto-translate-translation"></div><div class="additional"></div></div>',
  white:
    '<div class="auto-translate-white"><div class="lang auto-translate-lang"></div><div class="translation auto-translate-translation"></div><div class="additional"></div></div>',
  customize: "",
};

var holds = [],
  holdsMap;
var keys = ["Ctrl", "Alt", "Shift", "Meta"];
function pushHold(hold, o) {
  holds.push(hold);
  holdsMap[hold] = o;
}
function load() {
  (holds = []), (holdsMap = {});
  options = JSON.parse(localStorage["options"]);
  hotkeys = [];
  options.forEach(function (o) {
    var h = [];
    keys.forEach(function (k) {
      o[k.toLowerCase()] && h.push(k);
    });
    o.selection && pushHold(h.join("+") + "+Selection", o);
    o.mouseover && pushHold(h.join("+") + "+Mouseover", o);
  });
}
load();

chrome.runtime.onMessage.addListener(function (m, sender, sendResponse) {
  console.log(m.message);
  switch (m.message) {
    case "translate":
      var options;
      if ((options = holdsMap[m.context.hotkeys])) {
        m.context.theme = themes[options.theme];
        m.context.themeName = options.theme;
        translate(m.context.text, options, m.context);
      }
      break;
    case "options":
      load();
      break;
  }
});

var latest = "auto";
function _translate(text, from, to, options, callback) {
  var options = {
    url: "https://translate.googleapis.com/translate_a/single?dt=t&dt=bd",
    data: {
      dt: "t",
      dt: "bd",
      client: "gtx",
      q: text,
      sl: from,
      tl: to,
      dj: 1,
      source: "bubble",
    },
    dataType: "json",
    success: function on_success(data) {
      callback(data);
    },
    error: function (xhr, status, e) {
      console.log({ e: e, xhr: xhr });
    },
  };
  $.ajax(options);
}

function getSelectedTab(callback) {
  console.log("getSelectedTab");

  chrome.tabs.query({ active: true }, function (activeTabs) {
    if (activeTabs[0]) {
      callback(activeTabs[0]);
    }
  });
}

function translate(text, options, context) {
  function translate(text, from) {
    var to = options.first;
    if (from == to) {
      to = options.second;
    }
    _translate(text, from, to, options, function (data) {
      var text = "";
      var additional = "";
      for (var i = 0; i < data.sentences.length; i++) {
        text += data.sentences[i].trans + "<br/>";
      }

      context.translation = text;
      context.additional = additional;
      context.lang = {
        from: latest,
        to: to,
      };
      getSelectedTab(function (tab) {
        chrome.tabs.sendMessage(tab.id, {
          message: "result",
          context: context,
        });
      });
    });
  }
  translate(text, options.from == "latest" ? latest : options.from);
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request == "holds") {
    sendResponse(holds);
  }
});

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onInstalled.addListener(async () => {
  //let url = chrome.runtime.getURL("logger.html");
  //let tab = await chrome.tabs.create({ url });
});

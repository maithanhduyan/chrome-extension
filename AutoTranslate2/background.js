// Chrome Extension : Auto Translate

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
//chrome.storage.sync.set("options", JSON.stringify(defaults));
var options = defaults;

var holds = [],
  holdsMap;
var keys = ["Ctrl", "Alt", "Shift", "Meta"];

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

// event on installed
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("index.html");
  //let tab = await chrome.tabs.create({ url });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("Request: " + request);
  if (request == "holds") {
    sendResponse(holds);
  }
});

// Get OS
function getOS() {
  var OSName = "unknown OS";
  if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
  return OSName;
}

//
function reddenPage() {
  document.body.style.backgroundColor = "#000";
  document.body.style.color = "#fff";
  console.log("set black theme");
}

// When clicked on Extension Icon button
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reddenPage,
  });
});

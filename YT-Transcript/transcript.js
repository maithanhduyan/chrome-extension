

async function getLangOptionsWithLink(videoId) {

  // Get a transcript URL
  const videoPageResponse = await fetch("https://www.youtube.com/watch?v=" + videoId);
  const videoPageHtml = await videoPageResponse.text();
  const splittedHtml = videoPageHtml.split('"captions":')

  if (splittedHtml.length < 2) {
    return;
  } // No Caption Available

  const captions_json = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));
  const captionTracks = captions_json.playerCaptionsTracklistRenderer.captionTracks;
  const languageOptions = Array.from(captionTracks).map(i => {
    return i.name.simpleText;
  })

  const first = "English"; // Sort by English first
  languageOptions.sort(function (x, y) {
    return x.includes(first) ? -1 : y.includes(first) ? 1 : 0;
  });
  languageOptions.sort(function (x, y) {
    return x == first ? -1 : y == first ? 1 : 0;
  });

  return Array.from(languageOptions).map((langName, index) => {
    const link = captionTracks.find(i => i.name.simpleText === langName).baseUrl;
    return {
      language: langName,
      link: link
    }
  })

}

async function getTranscript(langOption) {
  const rawTranscript = await getRawTranscript(langOption.link);
  const transcript = rawTranscript.map((item) => {
    return item.text;
  }).join(' ');
  return transcript;
}

async function getRawTranscript(link) {

  // Get Transcript
  const transcriptPageResponse = await fetch(link); // default 0
  const transcriptPageXml = await transcriptPageResponse.text();

  // Parse Transcript
  const jQueryParse = $.parseHTML(transcriptPageXml);
  const textNodes = jQueryParse[1].childNodes;

  return Array.from(textNodes).map(i => {
    return {
      start: i.getAttribute("start"),
      duration: i.getAttribute("dur"),
      text: i.textContent
    };
  });

}

async function getTranscriptHTML(link, videoId) {

  const rawTranscript = await getRawTranscript(link);

  const scriptObjArr = [], timeUpperLimit = 60, charInitLimit = 300, charUpperLimit = 500;
  let loop = 0, chars = [], charCount = 0, timeSum = 0, tempObj = {}, remaining = {};

  // Sum-up to either total 60 seconds or 300 chars.
  Array.from(rawTranscript).forEach((obj, i, arr) => {

    // Check Remaining Text from Prev Loop
    if (remaining.start && remaining.text) {
      tempObj.start = remaining.start;
      chars.push(remaining.text);
      remaining = {}; // Once used, reset to {}
    }

    // Initial Loop: Set Start Time
    if (loop == 0) {
      tempObj.start = (remaining.start) ? remaining.start : obj.start;
    }

    loop++;

    const startSeconds = Math.round(tempObj.start);
    const seconds = Math.round(obj.start);
    timeSum = (seconds - startSeconds);
    charCount += obj.text.length;
    chars.push(obj.text);

    if (i == arr.length - 1) {
      tempObj.text = chars.join(" ").replace(/\n/g, " ");
      scriptObjArr.push(tempObj);
      resetNums();
      return;
    }

    if (timeSum > timeUpperLimit) {
      tempObj.text = chars.join(" ").replace(/\n/g, " ");
      scriptObjArr.push(tempObj);
      resetNums();
      return;
    }

    if (charCount > charInitLimit) {

      if (charCount < charUpperLimit) {
        if (obj.text.includes(".")) {

          const splitStr = obj.text.split(".");

          // Case: the last letter is . => Process regulary
          if (splitStr[splitStr.length - 1].replace(/\s+/g, "") == "") {
            tempObj.text = chars.join(" ").replace(/\n/g, " ");
            scriptObjArr.push(tempObj);
            resetNums();
            return;
          }

          // Case: . is in the middle
          // 1. Get the (length - 2) str, then get indexOf + str.length + 1, then substring(0,x)
          // 2. Create remaining { text: str.substring(x), start: obj.start } => use the next loop
          const lastText = splitStr[splitStr.length - 2];
          const substrIndex = obj.text.indexOf(lastText) + lastText.length + 1;
          const textToUse = obj.text.substring(0, substrIndex);
          remaining.text = obj.text.substring(substrIndex);
          remaining.start = obj.start;

          // Replcae arr element
          chars.splice(chars.length - 1, 1, textToUse)
          tempObj.text = chars.join(" ").replace(/\n/g, " ");
          scriptObjArr.push(tempObj);
          resetNums();
          return;

        } else {
          // Move onto next loop to find .
          return;
        }
      }

      tempObj.text = chars.join(" ").replace(/\n/g, " ");
      scriptObjArr.push(tempObj);
      resetNums();
      return;

    }

  })

  return Array.from(scriptObjArr).map(obj => {
    const t = Math.round(obj.start);
    const hhmmss = convertIntToHms(t);
    return `<div class="yt_ai_summary_transcript_text_segment">
        <div><a class="yt_ai_summary_transcript_text_timestamp" style="padding-top: 16px !important;" href="/watch?v=${videoId}&t=${t}s" target="_blank" data-timestamp-href="/watch?v=${videoId}&t=${t}s" data-start-time="${t}">${hhmmss}</a></div>
        <div class="yt_ai_summary_transcript_text" id="yt_ai_summary_transcript_text" data-start-time="${t}">${obj.text}</div>
    </div>`
  }).join("");

  function resetNums() {
    loop = 0, chars = [], charCount = 0, timeSum = 0, tempObj = {};
  }

}

function convertIntToHms(num) {
  const h = (num < 3600) ? 14 : 12;
  return (new Date(num * 1000).toISOString().substring(h, 19)).toString();
}
;// CONCATENATED MODULE: ./src/contentscript/searchParam.js
function getSearchParam(str) {

  const searchParam = (str && str !== "") ? str : window.location.search;

  if (!(/\?([a-zA-Z0-9_]+)/i.exec(searchParam))) return {};
  let match,
    pl = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^?&=]+)=?([^&]*)/g,
    decode = function (s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    index = /\?([a-zA-Z0-9_]+)/i.exec(searchParam)["index"] + 1,
    query = searchParam.substring(index);

  let urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;

}
;// CONCATENATED MODULE: ./src/contentscript/prompt.js
function getSummaryPrompt(transcript) {
  return `Title: "${document.title
    .replace(/\n+/g, " ")
    .trim()}"\nVideo Transcript: "${truncateTranscript(transcript)
      .replace(/\n+/g, " ")
      .trim()}"\nSummarize this video.`;
}

// Seems like 15,000 bytes is the limit for the prompt
const limit = 14000; // 1000 is a buffer

function getChunckedTranscripts(textData, textDataOriginal) {

  // [Thought Process]
  // (1) If text is longer than limit, then split it into chunks (even numbered chunks)
  // (2) Repeat until it's under limit
  // (3) Then, try to fill the remaining space with some text
  // (eg. 15,000 => 7,500 is too much chuncked, so fill the rest with some text)

  let result = "";
  const text = textData.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
  const bytes = textToBinaryString(text).length;

  if (bytes > limit) {
    // Get only even numbered chunks from textArr
    const evenTextData = textData.filter((t, i) => i % 2 === 0);
    result = getChunckedTranscripts(evenTextData, textDataOriginal);
  } else {
    // Check if any array items can be added to result to make it under limit but really close to it
    if (textDataOriginal.length !== textData.length) {
      textDataOriginal.forEach((obj, i) => {

        if (textData.some(t => t.text === obj.text)) {
          return;
        }

        textData.push(obj);

        const newText = textData.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
        const newBytes = textToBinaryString(newText).length;

        if (newBytes < limit) {

          const nextText = textDataOriginal[i + 1];
          const nextTextBytes = textToBinaryString(nextText.text).length;

          if (newBytes + nextTextBytes > limit) {
            const overRate = ((newBytes + nextTextBytes) - limit) / nextTextBytes;
            const chunkedText = nextText.text.substring(0, Math.floor(nextText.text.length * overRate));
            textData.push({ text: chunkedText, index: nextText.index });
            result = textData.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
          } else {
            result = newText;
          }
        }

      })
    } else {
      result = text;
    }
  }

  const originalText = textDataOriginal.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
  return (result == "") ? originalText : result; // Just in case the result is empty

}

function truncateTranscript(str) {
  const bytes = textToBinaryString(str).length;
  if (bytes > limit) {
    const ratio = limit / bytes;
    const newStr = str.substring(0, str.length * ratio);
    return newStr;
  }
  return str;
}

function textToBinaryString(str) {
  let escstr = decodeURIComponent(encodeURIComponent(escape(str)));
  let binstr = escstr.replace(/%([0-9A-F]{2})/gi, function (match, hex) {
    let i = parseInt(hex, 16);
    return String.fromCharCode(i);
  });
  return binstr;
}
;// CONCATENATED MODULE: ./src/contentscript/copy.js
function copyTextToClipboard(text) {

  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  } else {
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
    });
  }

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
    }

    document.body.removeChild(textArea);
  }
}
;// CONCATENATED MODULE: ./src/contentscript/youtube.js


function insertSummaryBtn() {

  // Sanitize Transcript Div
  if (document.querySelector("#yt_ai_summary_lang_select")) {
    document.querySelector("#yt_ai_summary_lang_select").innerHTML = "";
  }
  if (document.querySelector("#yt_ai_summary_summary")) {
    document.querySelector("#yt_ai_summary_summary").innerHTML = "";
  }
  Array.from(document.getElementsByClassName("yt_ai_summary_container")).forEach(el => {
    el.remove();
  });

  if (!getSearchParam(window.location.href).v) {
    return;
  }

  waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {

    // Sanitize
    Array.from(document.getElementsByClassName("yt_ai_summary_container")).forEach(el => {
      el.remove();
    });

    // Place Script Div
    document.querySelector("#secondary.style-scope.ytd-watch-flexy").insertAdjacentHTML("afterbegin", `
<div class="yt_ai_summary_container">
  <div id="yt_ai_summary_header" class="yt_ai_summary_header">	
      <a href="#" target="_blank" class="yt-logo">
<svg width="32" viewBox="0 0 460 336" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M450.388 52.5717C445.097 31.879 429.51 15.5806 409.718 10.0487C373.846 3.96287e-06 230 0 230 0C230 0 86.1544 3.96287e-06 50.2802 10.0498C30.4891 15.5816 14.9021 31.879 9.61204 52.5727C-9.53679e-07 90.0801 0 168.339 0 168.339C0 168.339 -9.53679e-07 246.599 9.61204 284.106C14.9021 304.799 30.4891 320.418 50.2802 325.951C86.1544 336 230 336 230 336C230 336 373.846 336 409.718 325.95C429.51 320.417 445.097 304.798 450.388 284.105C460 246.598 460 168.338 460 168.338C460 168.338 460 90.0801 450.388 52.5717Z" fill="white"/>
<path d="M60.999 236.793V100L181.225 168.398L60.999 236.793Z" fill="#FF5E3B"/>
<rect x="232" y="97" width="171" height="15" rx="7.5" fill="#FF5E3B"/>
<rect x="232" y="139" width="171" height="15" rx="7.5" fill="#FF5E3B"/>
<rect x="232" y="181" width="171" height="15" rx="7.5" fill="#FF5E3B"/>
<rect x="232" y="223" width="84" height="15" rx="7.5" fill="#FF5E3B"/>
<defs>
<linearGradient id="paint0_linear_93_37" x1="230" y1="0" x2="230" y2="336" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF0000"/>
<stop offset="1" stop-color="#BB0100"/>
</linearGradient>
</defs>
</svg>
      </a>
      <p class="yt_ai_summary_header_text">YOUTUBE TRANSCRIPT</p>
       <div id="yt_ai_summary_header_toggle" class="yt_ai_summary_header_action_btn_top">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.7215 10.8642C18.041 10.5446 18.041 10.0266 17.7215 9.70707C17.402 9.38754 16.8839 9.38754 16.5644 9.70707L17.7215 10.8642ZM7.43575 9.70707C7.11624 9.38754 6.5982 9.38754 6.27867 9.70707C5.95915 10.0266 5.95915 10.5446 6.27867 10.8642L7.43575 9.70707ZM12.81 15.7756L17.7215 10.8642L16.5644 9.70707L11.653 14.6185L12.81 15.7756ZM12.3472 14.6185L7.43575 9.70707L6.27867 10.8642L11.1901 15.7756L12.3472 14.6185ZM11.653 14.6185C11.8447 14.4268 12.1555 14.4268 12.3472 14.6185L11.1901 15.7756C11.6375 16.2229 12.3627 16.2229 12.81 15.7756L11.653 14.6185Z" fill="white"/>
  </svg>
       </div>
  </div>
  <div id="menuSecondLine">
    <div class="yt_ai_summary_header_actions">
          <div id="yt_ai_summary_header_summary" class="yt_ai_summary_header_action_btn yt-summary-hover-el yt_ai_summary_icon" data-hover-label="Video Transcription">
  <div class="svg_container">
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.83333 0.666687C2.19167 0.666687 1.66667 0.876687 1.18833 1.33169C0.733333 1.78669 0.5 2.34669 0.5 3.00002V17C0.5 17.6534 0.733333 18.2134 1.18833 18.6684C1.66667 19.1234 2.19167 19.3334 2.83333 19.3334H19.1667C19.75 19.3334 20.3333 19.1117 20.7883 18.645C21.2667 18.1667 21.5 17.6184 21.5 17V3.00002C21.5 2.38169 21.2667 1.83335 20.7883 1.35502C20.3333 0.888354 19.75 0.666687 19.1667 0.666687H2.83333ZM2.25 2.41669H19.75V17.5834H2.25V2.41669ZM5.16667 6.50002C4.81667 6.50002 4.54833 6.60502 4.32667 6.82669C4.105 7.04835 4 7.31669 4 7.66669V12.3334C4 12.6834 4.105 12.9517 4.32667 13.1734C4.54833 13.395 4.81667 13.5 5.16667 13.5H8.66667C8.98167 13.5 9.25 13.395 9.495 13.1734C9.72833 12.9517 9.83333 12.6834 9.83333 12.3334V11.1667H8.08333V11.75H5.75V8.25002H8.08333V8.83335H9.83333V7.66669C9.83333 7.31669 9.72833 7.04835 9.495 6.82669C9.25 6.60502 8.98167 6.50002 8.66667 6.50002H5.16667ZM13.3333 6.50002C13.0183 6.50002 12.75 6.60502 12.505 6.82669C12.2717 7.04835 12.1667 7.31669 12.1667 7.66669V12.3334C12.1667 12.6834 12.2717 12.9517 12.505 13.1734C12.75 13.395 13.0183 13.5 13.3333 13.5H16.8333C17.1833 13.5 17.4517 13.395 17.6733 13.1734C17.895 12.9517 18 12.6834 18 12.3334V11.1667H16.25V11.75H13.9167V8.25002H16.25V8.83335H18V7.66669C18 7.31669 17.895 7.04835 17.6733 6.82669C17.4517 6.60502 17.1833 6.50002 16.8333 6.50002H13.3333Z" fill="#6C6E73"/>
</svg></div>
          </div>
          <div id="yt_ai_summary_header_ai_summary" class="yt_ai_summary_header_action_btn yt-summary-hover-el" data-hover-label="Summarize in ChatGPT">
<div class="svg_container"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.1348 0.0175806C9.87174 0.00498689 9.60677 0.00883059 9.3379 0.0332056C7.11354 0.2339 5.33623 1.79408 4.60938 3.82031C2.89706 4.17684 1.43728 5.30485 0.671882 6.95703C-0.266005 8.98406 0.197291 11.3008 1.5879 12.9434C1.04027 14.6052 1.28563 16.4345 2.33204 17.9219C3.61822 19.7478 5.85658 20.5047 7.97462 20.1211C9.13967 21.4276 10.8476 22.1305 12.6621 21.9668C14.8865 21.7661 16.6638 20.206 17.3906 18.1797C19.103 17.8231 20.5638 16.696 21.3301 15.043C22.2682 13.0163 21.8054 10.6971 20.4141 9.05469C20.9607 7.39344 20.7139 5.56484 19.668 4.07813C18.3818 2.25224 16.1434 1.49531 14.0254 1.87891C13.033 0.766004 11.6469 0.089978 10.1348 0.0175806ZM10.0254 1.51367C10.9219 1.54885 11.755 1.87459 12.4316 2.42188C12.3186 2.47792 12.2001 2.51641 12.0899 2.58008L8.07618 4.89649C7.77018 5.07249 7.58018 5.39896 7.57618 5.75196L7.51758 11.2383L5.75001 10.1895V5.78516C5.75001 3.64916 7.3076 1.74225 9.4336 1.53125C9.63298 1.5115 9.83049 1.50603 10.0254 1.51367ZM15.125 3.25586C16.3986 3.26342 17.6399 3.82516 18.418 4.91016C19.0709 5.81959 19.3102 6.90199 19.1465 7.94727C19.0414 7.87735 18.9482 7.79415 18.8379 7.73047L14.8262 5.41406C14.5202 5.23806 14.1439 5.23521 13.8359 5.40821L9.05274 8.10352L9.07618 6.04883L12.8906 3.84766C13.5844 3.44716 14.3609 3.25133 15.125 3.25586ZM4.28321 5.47266C4.27521 5.59853 4.25001 5.7204 4.25001 5.84766V10.4805C4.25001 10.8335 4.43624 11.1598 4.74024 11.3398L9.46485 14.1367L7.67383 15.1426L3.85938 12.9395C2.00938 11.8715 1.13659 9.5671 2.01759 7.6211C2.47957 6.60069 3.29638 5.85358 4.28321 5.47266ZM14.3262 6.85742L18.1406 9.06055C19.9906 10.1285 20.8654 12.4329 19.9844 14.3789C19.5223 15.3996 18.7039 16.1465 17.7168 16.5273C17.7248 16.4017 17.75 16.2794 17.75 16.1523V11.5215C17.75 11.1675 17.5638 10.8402 17.2598 10.6602L12.5352 7.86328L14.3262 6.85742ZM11.0254 8.71094L12.9941 9.87891L12.9668 12.168L10.9746 13.2871L9.00587 12.1211L9.03126 9.83203L11.0254 8.71094ZM14.4824 10.7617L16.25 11.8105V16.2148C16.25 18.3508 14.6924 20.2578 12.5664 20.4688C11.45 20.5793 10.3921 20.2444 9.56837 19.5781C9.68143 19.5221 9.7999 19.4836 9.91016 19.4199L13.9238 17.1035C14.2298 16.9275 14.4198 16.601 14.4238 16.248L14.4824 10.7617ZM12.9473 13.8965L12.9238 15.9512L9.10938 18.1523C7.25938 19.2203 4.82704 18.8258 3.58204 17.0898C2.92915 16.1804 2.68976 15.098 2.85352 14.0527C2.95874 14.1228 3.05168 14.2057 3.16212 14.2695L7.17383 16.5859C7.47984 16.7619 7.85607 16.7648 8.16407 16.5918L12.9473 13.8965Z" fill="#6C6E73"/>
</svg></div>
          </div>
          <div style="display: none" id="yt_ai_summary_header_summorize_by_time" class="yt_ai_summary_header_action_btn yt-summary-hover-el" data-hover-label="Summorize by time">
  <div class="svg_container"><svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 1H19V3H5V1ZM5 9V7H19V9H5ZM2 0.5C2.39782 0.5 2.77936 0.658035 3.06066 0.93934C3.34196 1.22064 3.5 1.60218 3.5 2C3.5 2.39782 3.34196 2.77936 3.06066 3.06066C2.77936 3.34196 2.39782 3.5 2 3.5C1.60218 3.5 1.22064 3.34196 0.93934 3.06066C0.658035 2.77936 0.5 2.39782 0.5 2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5ZM2 6.5C2.39782 6.5 2.77936 6.65804 3.06066 6.93934C3.34196 7.22064 3.5 7.60218 3.5 8C3.5 8.39782 3.34196 8.77936 3.06066 9.06066C2.77936 9.34196 2.39782 9.5 2 9.5C1.60218 9.5 1.22064 9.34196 0.93934 9.06066C0.658035 8.77936 0.5 8.39782 0.5 8C0.5 7.60218 0.658035 7.22064 0.93934 6.93934C1.22064 6.65804 1.60218 6.5 2 6.5ZM5 15V13H19V15H5ZM2 12.5C2.39782 12.5 2.77936 12.658 3.06066 12.9393C3.34196 13.2206 3.5 13.6022 3.5 14C3.5 14.3978 3.34196 14.7794 3.06066 15.0607C2.77936 15.342 2.39782 15.5 2 15.5C1.60218 15.5 1.22064 15.342 0.93934 15.0607C0.658035 14.7794 0.5 14.3978 0.5 14C0.5 13.6022 0.658035 13.2206 0.93934 12.9393C1.22064 12.658 1.60218 12.5 2 12.5Z" fill="#6C6E73"/>
</svg></div>
          </div>
      </div>
  </div>
  <div id="yt_ai_summary_body" class="yt_ai_summary_body">
      <div id="yt_ai_summary_lang_select" class="yt_ai_summary_lang_select"></div>
      <div id="yt_ai_summary_text" class="yt_ai_summary_text"></div>
  </div>
  <div id="menuBottomLine">
    <div class="yt_ai_summary_header_actions">
          <div id="yt_ai_summary_header_copy" class="yt_ai_summary_header_action_btn yt-summary-hover-el yt_ai_summary_icon" data-hover-label="Copy">
  <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 20H6V6H17M17 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6C19 5.46957 18.7893 4.96086 18.4142 4.58579C18.0391 4.21071 17.5304 4 17 4ZM14 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16H2V2H14V0Z" fill="#6C6E73"/>
</svg>
          </div>
          <div id="yt_ai_summary_share" class="yt_ai_summary_header_action_btn yt-summary-hover-el" data-hover-label="Share">
<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C15.7956 6 16.5587 5.68393 17.1213 5.12132C17.6839 4.55871 18 3.79565 18 3C18 2.20435 17.6839 1.44129 17.1213 0.87868C16.5587 0.316071 15.7956 0 15 0C14.2044 0 13.4413 0.316071 12.8787 0.87868C12.3161 1.44129 12 2.20435 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C2.20435 7 1.44129 7.31607 0.87868 7.87868C0.316071 8.44129 0 9.20435 0 10C0 10.7956 0.316071 11.5587 0.87868 12.1213C1.44129 12.6839 2.20435 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.34C12.11 16.55 12.08 16.77 12.08 17C12.08 18.61 13.39 19.91 15 19.91C16.61 19.91 17.92 18.61 17.92 17C17.92 16.2256 17.6124 15.4829 17.0648 14.9352C16.5171 14.3876 15.7744 14.08 15 14.08Z" fill="#6C6E73"/>
</svg>
          </div>      
      </div>
  </div>
</div>`);

    // Event Listener: Hover Label
    Array.from(document.getElementsByClassName("yt-summary-hover-el")).forEach(el => {
      const label = el.getAttribute("data-hover-label");
      if (!label) {
        return;
      }
      el.addEventListener("mouseenter", (e) => {
        e.stopPropagation();
        e.preventDefault();
        Array.from(document.getElementsByClassName("yt_ai_summary_header_hover_label")).forEach(el => {
          el.remove();
        })
        el.insertAdjacentHTML("beforeend", `<div class="yt_ai_summary_header_hover_label">${label.replace(/\n+/g, `<br />`)}</div>`);
      })
      el.addEventListener("mouseleave", (e) => {
        e.stopPropagation();
        e.preventDefault();
        Array.from(document.getElementsByClassName("yt_ai_summary_header_hover_label")).forEach(el => {
          el.remove();
        })
      })
    })

    // Event Listener: Copy Transcript
    document.querySelector("#yt_ai_summary_header_copy").addEventListener("click", (e) => {
      e.stopPropagation();
      const videoId = getSearchParam(window.location.href).v;
      copyTranscript(videoId);
    })

    // Example POST method implementation:
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "strict-origin-when-cross-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      //console.log(response);
      return response.json(); // parses JSON response into native JavaScript objects
    }

    // Event Listener: AI Summary
    document.querySelector("#yt_ai_summary_header_ai_summary").addEventListener("click", (e) => {
      e.stopPropagation();
      let prompt = copyTranscriptAndPrompt();
      // prompt = 'test prompt';
      setTimeout(() => {
        chrome.runtime.sendMessage({ message: "setPrompt", prompt: prompt });
        //const port = chrome.runtime.connect();
        //port.postMessage({question: "test prompt"})
        window.open("https://chatgpt.com/", "_blank");
      }, 500);
    })
    document.querySelector("#yt_ai_summary_header_summary").addEventListener("click", async (e) => {
      e.stopPropagation();
      document.querySelector("#yt_ai_summary_body").innerHTML = `
<svg class="yt_ai_summary_loading" style="display: block;width: 48px;margin: 40px auto;" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 36C59.9995 36 37 66 37 99C37 132 61.9995 163.5 100 163.5C138 163.5 164 132 164 99" stroke="#5C94FF" stroke-width="6"/>
</svg>`;
      const videoId = getSearchParam(window.location.href).v;
      // Get Transcript Language Options & Create Language Select Btns
      const langOptionsWithLink = await getLangOptionsWithLink(videoId);
      if (!langOptionsWithLink) {
        noTranscriptionAlert();
        return;
      }
      //createLangSelectBtns(langOptionsWithLink);

      // Create Transcript HTML & Add Event Listener
      const transcriptHTML = await getTranscriptHTML(langOptionsWithLink[0].link, videoId);
      //document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
      document.querySelector("#yt_ai_summary_body").innerHTML = '<div id="yt_ai_summary_text" class="yt_ai_summary_text">' + transcriptHTML + '</div>';
      evtListenerOnTimestamp();

      // Event Listener: Language Select Btn Click
      evtListenerOnLangBtns(langOptionsWithLink, videoId);
    })
    // Event Listener: Toggle Transcript Body
    document.querySelector("#yt_ai_summary_header").addEventListener("click", async (e) => {

      const videoId = getSearchParam(window.location.href).v;
      sanitizeWidget();

      if (!isWidgetOpen()) {
        return;
      }

      // Get Transcript Language Options & Create Language Select Btns
      const langOptionsWithLink = await getLangOptionsWithLink(videoId);
      if (!langOptionsWithLink) {
        noTranscriptionAlert();
        return;
      }
      createLangSelectBtns(langOptionsWithLink);

      // Create Transcript HTML & Add Event Listener
      const transcriptHTML = await getTranscriptHTML(langOptionsWithLink[0].link, videoId);
      document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
      evtListenerOnTimestamp();

      // Event Listener: Language Select Btn Click
      evtListenerOnLangBtns(langOptionsWithLink, videoId);

    })

  });

}

function sanitizeWidget() {
  // Sanitize Transcript Div
  document.querySelector("#yt_ai_summary_lang_select").innerHTML = "";
  document.querySelector("#yt_ai_summary_text").innerHTML = "";

  // Height Adjust
  document.querySelector("#yt_ai_summary_body").style.maxHeight = window.innerHeight - 160 + "px";
  document.querySelector("#yt_ai_summary_text").innerHTML = `
<svg class="yt_ai_summary_loading" style="display: block;width: 48px;margin: 40px auto;" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 36C59.9995 36 37 66 37 99C37 132 61.9995 163.5 100 163.5C138 163.5 164 132 164 99" stroke="#5C94FF" stroke-width="6"/>
</svg>`;

  // Toggle Class List
  document.querySelector("#yt_ai_summary_body").classList.toggle("yt_ai_summary_body_show");
  document.querySelector("#yt_ai_summary_header_copy").classList.toggle("yt_ai_summary_header_icon_show");
  document.querySelector("#yt_ai_summary_header_summary").classList.toggle("yt_ai_summary_header_icon_show");
  //document.querySelector("#yt_ai_summary_footer_summary").classList.toggle("yt_ai_summary_header_icon_show");
  //document.querySelector("#yt_ai_summary_header_summorize_by_time").classList.toggle("yt_ai_summary_header_icon_show");
  document.querySelector("#yt_ai_summary_header_ai_summary").classList.toggle("yt_ai_summary_header_icon_show");
  //document.querySelector("#yt_ai_summary_share").classList.toggle("yt_ai_summary_header_icon_show");
  //document.querySelector("#yt_ai_summary_footer_track").classList.toggle("yt_ai_summary_header_icon_show");
  document.querySelector("#yt_ai_summary_header_toggle").classList.toggle("yt_ai_summary_header_toggle_rotate");
}

function isWidgetOpen() {
  return document.querySelector("#yt_ai_summary_body").classList.contains("yt_ai_summary_body_show");
}

function noTranscriptionAlert() {
  document.querySelector("#yt_ai_summary_text").innerHTML = `
<div style="margin: 40px auto;text-align: center;">
  <p>No Transcription Available... 😢</p>
</div>
`;
}

function createLangSelectBtns(langOptionsWithLink) {
  document.querySelector("#yt_ai_summary_lang_select").innerHTML = Array.from(langOptionsWithLink).map((langOption, index) => {
    return `<button class="yt_ai_summary_lang ${(index == 0) ? "yt_ai_summary_lange_selected" : ""}" data-yt-transcript-lang="${langOption.language}">${langOption.language}</button>`;
  }).join("");
}

function evtListenerOnLangBtns(langOptionsWithLink, videoId) {
  Array.from(document.getElementsByClassName("yt_ai_summary_lang")).forEach((langBtn) => {
    langBtn.addEventListener("click", async (e) => {
      const lang = e.target.getAttribute("data-yt-transcript-lang");
      const targetBtn = document.querySelector(`.yt_ai_summary_lang[data-yt-transcript-lang="${lang}"]`);
      const link = langOptionsWithLink.find((langOption) => langOption.language === lang).link;
      // Create Transcript HTML & Event Listener
      const transcriptHTML = await getTranscriptHTML(link, videoId);
      document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
      evtListenerOnTimestamp()
      targetBtn.classList.add("yt_ai_summary_lange_selected");
      Array.from(document.getElementsByClassName("yt_ai_summary_lang")).forEach((langBtn) => {
        if (langBtn !== targetBtn) {
          langBtn.classList.remove("yt_ai_summary_lange_selected");
        }
      })
    })
  })
}

function getTYCurrentTime() {
  return document.querySelector("#movie_player > div.html5-video-container > video").currentTime ?? 0;
}

function getTYEndTime() {
  return document.querySelector("#movie_player > div.html5-video-container > video").duration ?? 0;
}

function scrollIntoCurrTimeDiv() {
  const currTime = getTYCurrentTime();
  Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text_timestamp")).forEach((el, i, arr) => {
    const startTimeOfEl = el.getAttribute("data-start-time");
    const startTimeOfNextEl = (i === arr.length - 1) ? getTYEndTime() : arr[i + 1].getAttribute("data-start-time") ?? 0;
    if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      document.querySelector("#secondary > div.yt_ai_summary_container").scrollIntoView({
        behavior: 'auto',
        block: 'end'
      });
    }
  })
}

function evtListenerOnTimestamp() {
  Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text_timestamp")).forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const starttime = el.getAttribute("data-start-time");
      const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
      ytVideoEl.currentTime = starttime;
      ytVideoEl.play();
    })
  })
}

function copyTranscript(videoId) {
  let contentBody = document.getElementById("yt_ai_summary_body").textContent;
  console.log(contentBody);
  copyTextToClipboard(contentBody);
}

function copyTranscriptAndPrompt() {
  const textEls = document.getElementsByClassName("yt_ai_summary_transcript_text");
  const textData = Array.from(textEls).map((textEl, i) => {
    return {
      text: textEl.textContent.trim(),
      index: i,
    }
  })
  const text = getChunckedTranscripts(textData, textData);
  const prompt = getSummaryPrompt(text);
  copyTextToClipboard(prompt);
  return prompt;
}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
;// CONCATENATED MODULE: ./src/contentscript/index.js


let oldHref = "";


window.onload = async () => {

  if (window.location.hostname === "www.youtube.com") {

    if (window.location.search !== "" && window.location.search.includes("v=")) {
      insertSummaryBtn();
    }

    const bodyList = document.querySelector("body");
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (oldHref !== document.location.href) {
          oldHref = document.location.href;
          insertSummaryBtn();
        }
      });
    });
    observer.observe(bodyList, { childList: true, subtree: true });

  }

  if (window.location.hostname === "chatgpt.com") {
    setTimeout(function () {
      //  window.addEventListener("load", (event) => {
      console.log('chatGPT here');
      const promptArea = document.querySelector('p.placeholder');
      //const promptArea = document.querySelector('textarea.text-token-text-primary');

      let sendBtn = document.querySelector('[data-testid="send-button"]');
      // if (!sendBtn) sendBtn = promptArea.parentNode.querySelector('button');
      console.log('!!!', promptArea, sendBtn);
      if (promptArea && sendBtn) {
        console.log('OK!!!!!!!!');
        chrome.runtime.sendMessage({ message: "getPrompt" }, async (response) => {
          console.log(response, promptArea, sendBtn);
          console.log('response is:', response.prompt);

          if (!response.prompt) {
            console.log('return');
            return;
          }

          setTimeout(() => {
            console.log('changing....', response.prompt, promptArea);
            promptArea.innerHTML = response.prompt;
            promptArea.style.height = promptArea.scrollHeight + "px",
              promptArea.focus();
            promptArea.dispatchEvent(new Event("input", { bubbles: true }));

            sendBtn.disabled = false;
            sendBtn.click();

            setTimeout(() => {
              const downBtn = document.querySelector('[role="presentation"] button.cursor-pointer');
              console.log(downBtn);
              if (!downBtn) return;
              downBtn.click();
            }, 2000);
          }, 1500);
        });
      }

      if (document.getElementsByTagName("textarea")[0]) {
        document.getElementsByTagName("textarea")[0].focus();
        // If search query is "?ref=ytrans"
        //if (window.location.search === "?ref=ytrans") {
        // get prompt from background.js
        chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
          document.getElementsByTagName("textarea")[0].value = response.prompt;
          if (response.prompt !== "") {
            document.getElementsByTagName("textarea")[0].focus();
            document.getElementsByTagName("button")[document.getElementsByTagName("button").length - 1].click();
          }
        });
        //}
      }
    }, 4000); //delay is in milliseconds
    //    });
  }

}

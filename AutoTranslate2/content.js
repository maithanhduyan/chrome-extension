var holds = [];

chrome.runtime.sendMessage("holds", function (settings) {
  holds = settings;
});

$(document).ready(function () {
  var mouseoverDelay = 300;
  var async = 0;
  var popup;

  function createPopup() {
    popup = document.createElement("DIV");
    popup.className = "auto-translate-div";
  }

  var popupOffset = 5;

  function resetStyles(el) {
    el.style.color = "inherit";
    el.style.background = "none";
    el.style.border = "none";
  }

  function showPopup(context) {
    popup || createPopup();

    popup.style.display = "block";
    document.body.appendChild(popup);

    popup.innerHTML = context.theme;

    resetStyles(popup.getElementsByClassName("translation")[0]);
    resetStyles(popup.getElementsByClassName("additional")[0]);
    resetStyles(popup.getElementsByClassName("lang")[0]);

    popup.getElementsByClassName("lang")[0].innerHTML =
      context.lang.from + " &#8594; " + context.lang.to;
    popup.getElementsByClassName("translation")[0].innerHTML =
      context.translation;
    popup.getElementsByClassName("additional")[0].innerHTML =
      context.additional;
    Array.prototype.slice
      .call(
        popup
          .getElementsByClassName("additional")[0]
          .getElementsByTagName("div")
      )
      .forEach(function (el) {
        resetStyles(el);
      });

    if (popup.offsetHeight + popupOffset < context.rect.y) {
      popup.style.top =
        context.rect.y - popup.offsetHeight - popupOffset + "px";
    } else {
      popup.style.top = context.rect.y + context.rect.h + popupOffset + "px";
    }

    var l = context.rect.x + context.rect.w / 2 - popup.offsetWidth / 2;
    l = Math.min(
      l,
      document.body.clientWidth - popup.offsetWidth - popupOffset
    );
    l = Math.max(l, popupOffset);
    popup.style.left = l + "px";
  }

  chrome.runtime.onMessage.addListener(function (m, sender, sendResponse) {
    switch (m.message) {
      case "result":
        if (m.context.async === async) {
          showPopup(m.context);
        }
        break;
    }
  });

  var keys = ["Ctrl", "Alt", "Shift", "Meta"];
  function invoke(e, type) {
    var hotkeys = [];
    for (var k in keys) {
      if (e[keys[k].toLowerCase() + "Key"]) {
        hotkeys.push(keys[k]);
      }
    }

    hotkeys = hotkeys.join("+");
    var hs = hotkeys + "+Selection";
    var hm = hotkeys + "+Mouseover";
    var rect = { x: 0, y: 0, w: 0, h: 0 };

    var text = "";

    if (holds.indexOf(hs) >= 0 && type == "mouseup") {
      var selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        text = selection.toString();
        var bcr = selection.getRangeAt(0).getBoundingClientRect();
        rect = {
          x: bcr.left + window.pageXOffset,
          y: bcr.top + window.pageYOffset,
          w: bcr.width,
          h: bcr.height,
        };
        hotkeys = hs;
      }
    }

    if (holds.indexOf(hm) >= 0 && type == "mouseover") {
      var data = getWordAtPoint(e.srcElement, e.x, e.y);
      if (data == null) return;
      text = data.text;
      rect = data.rect;
      hotkeys = hm;
    }

    if (text.length < 1) {
      return;
    }

    chrome.runtime.sendMessage({
      message: "translate",
      context: {
        text: text,
        hotkeys: hotkeys,
        rect: rect,
        async: ++async,
      },
    });
  }

  var holdMouseover = false;
  var holdMouseoverT;
  var mouseoverT;
  document.body.addEventListener("mouseup", function (e) {
    clearTimeout(holdMouseoverT);
    clearTimeout(mouseoverT);
    holdMouseover = true;
    holdMouseoverT = setTimeout(function () {
      holdMouseover = false;
    }, 2 * mouseoverDelay);
    invoke(e, "mouseup");
  });
  document.body.addEventListener("mousemove", function (e) {
    if (holdMouseover) return;
    clearTimeout(mouseoverT);
    mouseoverT = setTimeout(invoke.bind(null, e, "mouseover"), mouseoverDelay);
  });

  document.body.addEventListener(
    "mousedown",
    function (e) {
      if (!popup || !popup.parentNode) return;

      var r = true;
      e = e.srcElement;
      while (e.parentNode) {
        if (e === popup) {
          r = false;
          break;
        }
        e = e.parentNode;
      }
      if (r) {
        popup.style.display = "none";
        popup.parentNode.removeChild(popup);
      }
    },
    false
  );

  function getWordAtPoint(elem, x, y) {
    if (elem.nodeType == elem.TEXT_NODE) {
      var range = elem.ownerDocument.createRange();
      range.selectNodeContents(elem);
      var currentPos = 0;
      var endPos = range.endOffset;
      var bcr;
      while (currentPos + 1 < endPos) {
        range.setStart(elem, currentPos);
        range.setEnd(elem, currentPos + 1);
        bcr = range.getBoundingClientRect();
        if (
          bcr.left <= x &&
          bcr.right >= x &&
          bcr.top <= y &&
          bcr.bottom >= y
        ) {
          range.expand("word");
          bcr = range.getBoundingClientRect();
          var ret = range.toString();
          range.detach();

          return {
            text: ret,
            rect: {
              x: bcr.left + window.pageXOffset,
              y: bcr.top + window.pageYOffset,
              w: bcr.width,
              h: bcr.height,
            },
          };
        }
        currentPos += 1;
      }
    } else {
      for (var i = 0; i < elem.childNodes.length; i++) {
        var range = elem.childNodes[i].ownerDocument.createRange();
        range.selectNodeContents(elem.childNodes[i]);
        if (
          range.getBoundingClientRect().left <= x &&
          range.getBoundingClientRect().right >= x &&
          range.getBoundingClientRect().top <= y &&
          range.getBoundingClientRect().bottom >= y
        ) {
          range.detach();
          return getWordAtPoint(elem.childNodes[i], x, y);
        } else {
          range.detach();
        }
      }
    }
    return null;
  }
});

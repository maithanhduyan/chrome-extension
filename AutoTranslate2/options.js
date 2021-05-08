$(document).ready(function () {
  var selects = ["from", "first", "second", "theme"];
  var checkboxes = ["ctrl", "alt", "shift", "meta", "selection", "mouseover"];
  var languages = JSON.parse(localStorage["languages"]);
  var options = JSON.parse(localStorage["options"]);
  var defaults = JSON.parse(localStorage["defaults"]);

  function getById(id) {
    return document.getElementById(id);
  }

  function read() {
    document.getElementsByClassName("add")[0].addEventListener("click", add);
    document.getElementsByClassName("save")[0].addEventListener("click", save);
    options.forEach(add);
  }

  function add(set, index) {
    index == undefined && ((set = defaults), (index = 0));
    var tpl = document.getElementsByClassName("set")[0],
      out;
    out = tpl.cloneNode(true);
    Array.prototype.slice
      .call(out.getElementsByTagName("select"))
      .forEach(function (select, index) {
        if (index < 3) {
          if (index == 0) {
            select.appendChild(new Option("Auto-detect language", "auto"));
            select.appendChild(
              new Option("Latest detected language", "latest")
            );
            select.appendChild(new Option("-", "-"));
            select.lastChild.disabled = "disabled";
          }
          for (var lng in languages) {
            var name =
              lng.substring(0, 1) +
              lng.substring(1).toLowerCase().replace("_", " ");
            select.appendChild(new Option(name, languages[lng]));
          }
        }
        select.value = set[selects[index]];
      });
    Array.prototype.slice
      .call(out.querySelectorAll("input[type=checkbox]"))
      .forEach(function (checkbox, index) {
        checkbox.checked = set[checkboxes[index]] ? "checked" : "";
      });
    out
      .getElementsByClassName("remove")[0]
      .addEventListener("click", function (e) {
        this.parentNode.parentNode.removeChild(this.parentNode);
        if (document.getElementsByClassName("set").length == 1) {
          add();
        }
      });
    out
      .getElementsByTagName("select")[0]
      .addEventListener("change", function (e) {
        if (["latest", "auto"].indexOf(this.value) == -1) {
          this.parentNode.parentNode.getElementsByTagName(
            "select"
          )[2].value = this.value;
        }
      });
    out.style.display = "";
    tpl.parentNode.appendChild(out);
  }

  function save() {
    var ops = [],
      set;
    Array.prototype.slice
      .call(document.getElementsByClassName("set"), 1)
      .forEach(function (out, index) {
        set = {};
        Array.prototype.slice
          .call(out.getElementsByTagName("select"))
          .forEach(function (select, index) {
            set[selects[index]] = select.value;
          });
        Array.prototype.slice
          .call(out.querySelectorAll("input[type=checkbox]"))
          .forEach(function (checkbox, index) {
            set[checkboxes[index]] = checkbox.checked;
          });
        ops.push(set);
      });

    message("Options saved");
    options = ops;
    localStorage["options"] = JSON.stringify(options);
    chrome.runtime.sendMessage({ message: "options" });
  }

  function message(message, type) {
    getById("message").innerHTML = message;
    getById("message").style.opacity = "1";
    setTimeout(function () {
      getById("message").style.opacity = "0";
    }, 2500);
  }

  read();

  function getOS() {
    var OSName = "unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
    return OSName;
  }

  jQuery(document).ready(function ($) {
    if (getOS() == "MacOS") {
      jQuery(".Ctrl_block").css("display", "none");
    } else {
      jQuery(".Cmd_block").css("display", "none");
    }
  });
});

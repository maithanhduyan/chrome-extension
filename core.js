//

function getOS() {
    var _OSName = "unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) _OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) _OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) _OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) _OSName = "Linux";
    app.osName = _OSName;
    return _OSName;
}
!function (t) {
    function e(e) {
        for (var o, a, r = e[0], _ = e[1], l = e[2], u = 0, c = []; u < r.length; u++)
            a = r[u],
                Object.prototype.hasOwnProperty.call(i, a) && i[a] && c.push(i[a][0]), i[a] = 0;
        for (o in _) Object.prototype.hasOwnProperty.call(_, o) && (t[o] = _[o]);
        for (p && p(e); c.length;)c.shift()();
        return s.push.apply(s, l || []), n()
    }
    function n() {
        for (var t, e = 0; e < s.length; e++) {
            for (var n = s[e], o = !0, r = 1; r < n.length; r++) { var _ = n[r]; 0 !== i[_] && (o = !1) } o && (s.splice(e--, 1), t = a(a.s = n[0]))
        }
        return t
    }
    var o = {}, i = { 3: 0 }, s = [];
    function a(e) {
        if (o[e])
            return o[e].exports;
        var n = o[e] = { i: e, l: !1, exports: {} };
        return t[e].call(n.exports, n, n.exports, a), n.l = !0, n.exports
    } a.m = t, a.c = o, a.d = function (t, e, n) { a.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n }) }, a.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, a.t = function (t, e) { if (1 & e && (t = a(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var n = Object.create(null); if (a.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) a.d(n, o, function (e) { return t[e] }.bind(null, o)); return n }, a.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return a.d(e, "a", e), e }, a.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, a.p = "./"; var r = window.webpackJsonp = window.webpackJsonp || [], _ = r.push.bind(r); r.push = e, r = r.slice(); for (var l = 0; l < r.length; l++)e(r[l]); var p = _; s.push([175, 0]), n()
}({
    175: function (t, e, n) {
        "use strict";
        n.r(e); n(222); var o = n(0), i = n(4), s = n(1), a = n(2), r = n(15), _ = n.n(r), l = n(31);
        class p {
            constructor() {
                chrome.storage ? (this._options = a.a, this._logger = Object(l.a)()) : this._options = { preferred_quality_level: "High", show_3gp_ext: !1, one_click: !0, get: function (t) { return this[t] }, load: function () { return { then: function (t) { t() } } }, set: function (t, e) { console.log("set", t, "to", e) } }, this._options.load().then(() => this._init())
            } _init() { this._optionsNode = o.query("#options"), this._drawOptionsPage(), this._setupEventListeners(), s.a.log("PageShown", s.a.PAGE_OPTIONS) } _drawOptionsPage() { var t = this._options.get("preferred_quality_level"), e = this._options.get("min_stream_size"), n = { onPageButtonsEnabled: this._options.get("on_page_buttons"), detachButtonEnabled: this._options.get("detach_enabled"), isDarkThemeEnabled: this._options.get("dark_theme"), isOneClickEnabled: this._options.get("one_click"), preferLastQuality: this._options.get("prefer_last_quality"), instantDownload: this._options.get("instant_actions_button_download"), minStreamSize: e, minStreamSizeValue: o.beautifyFileSize(e), qLevels: i.a.QUALITY_LEVELS.map(e => ({ i18n_ql_title: o.i18n("ql_" + e.toLowerCase()), qLevelName: e, isChecked: e === t })), show3gpExt: this._options.get("show_3gp_ext"), i18n_options_title: o.i18n("options_title"), i18n_show_on_page_buttons: o.i18n("options_show_on_page_buttons"), i18n_show_detach_button: o.i18n("options_show_detach_button"), i18n_dark_theme: o.i18n("options_dark_theme"), i18n_one_click: o.i18n("options_one_click"), i18n_preferred_quality: o.i18n("popup_preferred_quality"), i18n_prefer_last_quality: o.i18n("options_prefer_last_quality"), i18n_min_stream_szie: o.i18n("options_min_stream_size"), i18n_save_and_close: o.i18n("options_save_and_close"), i18n_show_3gp: o.i18n("options_show_3gp"), i18n_show_instant_download: o.i18n("instant_actions_download_options") }, s = o.query("#options-template").textContent; this._optionsNode.innerHTML = _.a.render(s, n) } _setupEventListeners() { this._optionsNode.addEventListener("click", t => { var e = t.target, n = !!e.checked; switch (e.id) { case "on-page-buttons": return this._options.set("on_page_buttons", n), this._drawOptionsPage(), void s.a.log("CheckBoxClicked", s.a.CHECK_BOX_SHOW_ON_PAGE_BUTTONS + n); case "detach-button": return this._options.set("detach_enabled", n), void s.a.log("CheckBoxClicked", s.a.CHECK_BOX_DETACH_ENABLED + n); case "dark-theme-enable": return this._options.set("dark_theme", n), void s.a.log("CheckBoxClicked", s.a.CHECK_BOX_DARK_THEM_ENABLED + n); case "one-click-download": return this._options.set("one_click", n), void s.a.log("CheckBoxClicked", s.a.CHECK_BOX_ENABLE_ONE_CLICK + n); case "prefer-last-quality": return this._options.set("prefer_last_quality", n), void s.a.log("CheckBoxClicked", s.a.CHECK_BOX_PREFER_LAST_QUALITY + n); case "show-3gp-ext": this._options.set("show_3gp_ext", n); break; case "instant-button-download": this._options.set("instant_actions_button_download", n), this._logger({ testName: "instantdownload1", saviorAction: "instant-download-state", state: n }) }switch (e.getAttribute("name")) { case "optionsRadios": this._options.set("preferred_quality_level", e.value), s.a.log("OneClickQualityChanged", i.a.getOneClickQualityIndex(e.value)) } }, !1), this._optionsNode.addEventListener("input", () => { var t = o.query("#min-stream-size"), e = o.query("#min-stream-size-value"), n = +t.value; this._options.set("min_stream_size", n), e.textContent = o.beautifyFileSize(n) }, !1) }
        }
        document.addEventListener("DOMContentLoaded", () => new p)
    }, 222: function (t, e) { }
});
class Background {

    constructor() {
        this.APP_URL = chrome.runtime.getURL("app.html"),
            this.findAppTab(), this.onIconClicked(),
            this.onWindowRemoved()
    }

    findAppTab() {
        chrome.tabs.query({
            url: this.APP_URL, windowType: "popup"
        },
            a => {
                a && a[0] && (this.appTabId = a[0].id,
                    this.appWindowId = a[0].windowId)
            }
        )
    }

    onIconClicked() {
        chrome.browserAction.onClicked.addListener(() => {
            if (this.appWindowId) chrome.windows.update(this.appWindowId,
                { focused: !0 }); else {
                const a = navigator.appVersion.includes("Mac") ? 770 : 750;
                chrome.windows.create({
                    type: "popup",
                    url: this.APP_URL,
                    width: 800,
                    height: a,
                    left: screen.width / 2 - 400
                },
                    a => {
                        this.appWindowId = a.id,
                            this.appTabId = a.tabs[0].id
                    })
            }
        })
    }
    onWindowRemoved() {
        chrome.windows.onRemoved.addListener(
            a => { a === this.appWindowId && (this.appTabId = null, this.appWindowId = null) })
    }
}

const b = new Background;
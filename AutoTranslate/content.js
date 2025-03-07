let holds = [];

async function initHolds() {
    if (!chrome.runtime || typeof chrome.runtime.sendMessage !== 'function') {
        console.error('Chrome runtime is not available');
        return [];
    }
    return new Promise(resolve => {
        chrome.runtime.sendMessage("holds", resolve);
    });
}

$(document).ready(async () => {
    try {
        holds = await initHolds();
        console.log('Holds initialized:', holds);
    } catch (error) {
        console.error('Failed to initialize holds:', error);
        return;
    }

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

        popup.innerHTML = `
            <div class="auto-translate-container ${context.themeName}">
                <div class="auto-translate-header">
                    <span class="lang auto-translate-lang"></span>
                    <button class="save-btn">Save</button>
                </div>
                <div class="translation auto-translate-translation"></div>
                <div class="additional"></div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .auto-translate-container {
                min-width: 200px;
                max-width: 400px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
            }
            .auto-translate-container.black {
                background: #333;
                color: #fff;
            }
            .auto-translate-container.white {
                background: #fff;
                color: #333;
                border: 1px solid #ddd;
            }
            .auto-translate-header {
                padding: 5px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .save-btn {
                padding: 2px 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            .save-btn:hover {
                background: #45a049;
            }
            .auto-translate-translation {
                padding: 10px;
                word-wrap: break-word;
            }
            .additional {
                padding: 0 10px 10px;
            }
        `;
        popup.appendChild(style);

        const langEl = popup.querySelector(".lang");
        const transEl = popup.querySelector(".translation");
        const addEl = popup.querySelector(".additional");
        const saveBtn = popup.querySelector(".save-btn");

        if (!langEl || !transEl || !addEl || !saveBtn) {
            console.error('Failed to find popup elements:', { langEl, transEl, addEl, saveBtn });
            return;
        }

        resetStyles(langEl);
        resetStyles(transEl);
        resetStyles(addEl);

        langEl.innerHTML = `${context.lang.from} → ${context.lang.to}`;
        transEl.innerHTML = context.translation || 'No translation available';
        addEl.innerHTML = context.additional || '';

        if (context.translation && context.translation.startsWith("Translation failed")) {
            transEl.style.color = "#ff4444";
        }

        saveBtn.addEventListener('click', () => {
            const translationData = {
                original: context.text,
                translated: context.translation,
                from: context.lang.from,
                to: context.lang.to,
                timestamp: new Date().toISOString()
            };

            if (chrome.storage) {
                chrome.storage.local.get(['savedTranslations'], (result) => {
                    let savedTranslations = result.savedTranslations || [];
                    savedTranslations.push(translationData);

                    chrome.storage.local.set({ savedTranslations }, () => {
                        saveBtn.textContent = 'Saved!';
                        saveBtn.style.background = '#666';
                        saveBtn.disabled = true;

                        setTimeout(() => {
                            saveBtn.textContent = 'Save';
                            saveBtn.style.background = '#4CAF50';
                            saveBtn.disabled = false;
                        }, 2000);
                    });
                });
            } else {
                console.error('Chrome storage is not available');
            }
        });

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

    if (chrome.runtime) {
        chrome.runtime.onMessage.addListener((m) => {
            if (m.message === "result" && m.context.async === asyncCounter) {
                showPopup(m.context);
            }
        });
    } else {
        console.error('Chrome runtime is not available for message listener');
    }

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
        if (chrome.runtime) {
            chrome.runtime.sendMessage({
                message: "translate",
                context: {
                    text,
                    hotkeys,
                    rect,
                    async: ++asyncCounter
                }
            });
        } else {
            console.error('Cannot send translate request: Chrome runtime unavailable');
        }
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
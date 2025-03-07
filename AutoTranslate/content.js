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
    const MAX_SAVED_TRANSLATIONS = 100; // Giới hạn số lượng bản dịch
    let asyncCounter = 0;
    let popup;
    let historyPopup;
    const popupOffset = 5;

    function createPopup() {
        popup = document.createElement("div");
        popup.className = "auto-translate-div";
        popup.style.position = "absolute";
        popup.style.zIndex = "10000";
    }

    function createHistoryPopup() {
        historyPopup = document.createElement("div");
        historyPopup.className = "auto-translate-history-div";
        historyPopup.style.position = "fixed";
        historyPopup.style.zIndex = "10001";
        historyPopup.style.right = "10px";
        historyPopup.style.top = "10px";
        historyPopup.style.width = "300px";
        historyPopup.style.maxHeight = "400px";
        historyPopup.style.overflowY = "auto";
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
                    <div class="button-group">
                        <button class="copy-btn">Copy</button>
                        <button class="save-btn">Save</button>
                        <button class="history-btn">History</button>
                    </div>
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
            .button-group {
                display: flex;
                gap: 5px;
            }
            .copy-btn, .save-btn, .history-btn {
                padding: 2px 10px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                color: white;
            }
            .copy-btn {
                background: #2196F3;
            }
            .copy-btn:hover {
                background: #1976D2;
            }
            .save-btn {
                background: #4CAF50;
            }
            .save-btn:hover {
                background: #45a049;
            }
            .history-btn {
                background: #9C27B0;
            }
            .history-btn:hover {
                background: #7B1FA2;
            }
            .auto-translate-translation {
                padding: 10px;
                word-wrap: break-word;
            }
            .additional {
                padding: 0 10px 10px;
            }
            .auto-translate-history-div {
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                padding: 10px;
            }
            .history-item {
                border-bottom: 1px solid #eee;
                padding: 5px 0;
                position: relative;
            }
            .history-item:last-child {
                border-bottom: none;
            }
            .delete-btn {
                position: absolute;
                right: 5px;
                top: 5px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 2px 5px;
                cursor: pointer;
            }
            .delete-btn:hover {
                background: #d32f2f;
            }
        `;
        popup.appendChild(style);

        const langEl = popup.querySelector(".lang");
        const transEl = popup.querySelector(".translation");
        const addEl = popup.querySelector(".additional");
        const copyBtn = popup.querySelector(".copy-btn");
        const saveBtn = popup.querySelector(".save-btn");
        const historyBtn = popup.querySelector(".history-btn");

        if (!langEl || !transEl || !addEl || !copyBtn || !saveBtn || !historyBtn) {
            console.error('Failed to find popup elements');
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

        // Nút Copy
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(context.translation).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            });
        });

        // Nút Save
        saveBtn.addEventListener('click', () => {
            const translationData = {
                original: context.text,
                translated: context.translation,
                from: context.lang.from,
                to: context.lang.to,
                timestamp: new Date().toISOString()
            };

            chrome.storage.local.get(['savedTranslations'], (result) => {
                let savedTranslations = result.savedTranslations || [];
                if (savedTranslations.length >= MAX_SAVED_TRANSLATIONS) {
                    savedTranslations.shift(); // Xóa bản cũ nhất nếu vượt giới hạn
                }
                savedTranslations.push(translationData);

                chrome.storage.local.set({ savedTranslations }, () => {
                    saveBtn.textContent = 'Saved!';
                    saveBtn.style.background = '#666';
                    saveBtn.disabled = true;

                    // Thông báo Chrome
                    if (chrome.notifications) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'assets/icons/48.png', // Cần thêm icon vào project
                            title: 'Translation Saved',
                            message: 'Your translation has been saved successfully!'
                        });
                    }

                    setTimeout(() => {
                        saveBtn.textContent = 'Save';
                        saveBtn.style.background = '#4CAF50';
                        saveBtn.disabled = false;
                    }, 2000);
                });
            });
        });

        // Nút History
        historyBtn.addEventListener('click', () => {
            if (!historyPopup) createHistoryPopup();

            chrome.storage.local.get(['savedTranslations'], (result) => {
                const savedTranslations = result.savedTranslations || [];
                historyPopup.innerHTML = `
                    <h3>Saved Translations (${savedTranslations.length}/${MAX_SAVED_TRANSLATIONS})</h3>
                    <div class="history-list">
                        ${savedTranslations.reverse().map((item, index) => `
                            <div class="history-item">
                                <small>${new Date(item.timestamp).toLocaleString()}</small>
                                <p><strong>${item.original}</strong> → ${item.translated}</p>
                                <button class="delete-btn" data-index="${savedTranslations.length - 1 - index}">Delete</button>
                            </div>
                        `).join('')}
                    </div>
                `;

                if (!historyPopup.parentNode) document.body.appendChild(historyPopup);

                // Xử lý xóa
                historyPopup.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const index = parseInt(btn.dataset.index);
                        savedTranslations.splice(index, 1);
                        chrome.storage.local.set({ savedTranslations }, () => {
                            btn.parentElement.remove();
                        });
                    });
                });
            });
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
        if (chrome.runtime && typeof chrome.runtime.sendMessage === 'function') {
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
        let target = e.target;
        while (target) {
            if (target === popup || target === historyPopup) return;
            target = target.parentNode;
        }
        if (popup && popup.parentNode) {
            popup.style.display = "none";
            popup.parentNode.removeChild(popup);
        }
        if (historyPopup && historyPopup.parentNode) {
            historyPopup.parentNode.removeChild(historyPopup);
        }
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
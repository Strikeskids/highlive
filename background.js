var contextMenuId = 'highlight-menu'

chrome.runtime.onInstalled.addListener(setup)
setTimeout(checkSetup, 300)
setupListeners()

function setup() {
    chrome.contextMenus.create({
        id: contextMenuId,
        title: "Highlight Code",
        contexts: ['all'],
    })
}

function checkSetup() {
    chrome.contextMenus.update(contextMenuId, {}, function() {
        if (chrome.runtime.lastError) {
            setup()
        }
    })
}

function setupListeners() {
    chrome.contextMenus.onClicked.addListener(menuClicked)
}

function menuClicked(info, tab) {
    if (info.menuItemId !== contextMenuId) return
    chrome.tabs.insertCSS(tab.tabId, {file: 'vendor/highlight/styles/default.css'})
    chrome.tabs.executeScript(tab.tabId, {file: 'vendor/highlight/highlight.pack.js'})
    chrome.tabs.executeScript(tab.tabId, {file: 'highlighter.js'})
}

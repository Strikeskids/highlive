var contextMenuId = 'highlight-menu'

chrome.runtime.onInstalled.addListener(setup)

function setup() {
    chrome.contextMenus.create({
        id: contextMenuId,
        title: "Highlight Text",
        contexts: ['all'],
    })

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId !== contextMenuId) return
        chrome.tabs.insertCSS(tab.tabId, {file: 'vendor/highlight/styles/default.css'})
        chrome.tabs.executeScript(tab.tabId, {file: 'vendor/highlight/highlight.pack.js'})
        chrome.tabs.executeScript(tab.tabId, {file: 'highlighter.js'})
    })
}

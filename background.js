var contextMenuId = 'highlight-menu'

chrome.runtime.onInstalled.addListener(setup)

function setup() {
    chrome.contextMenus.create({
        id: contextMenuId,
        title: "Highlight Text",
    })
    chrome.contextMenus.onClicked.addListener(contextClicked)
}

function contextClicked(info, tab) {
    if (info.menuItemId !== contextMenuId) return
    chrome.tabs.executeScript(tab.tabId, {file: 'highlighter.js'})
}

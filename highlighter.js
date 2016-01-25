var sel = document.getSelection()

if (sel && sel.anchorNode) {
    var node = sel.anchorNode
    while (node && !isHighlighted(node) && !canHighlight(node)) {
        node = node.parentElement
    }
    if (canHighlight(node)) {
        if (!hasCodeNode(node)) {
            wrapInCode(node)
        }
        hljs.highlightBlock(node)
    }
}

function hasCodeNode(node) {
    if (node.firstChild.nodeType !== Node.TEXT_NODE) return true
    while (node) {
        if (node.nodeName.toLowerCase() === 'code') return true
        node = node.parentElement
    }
    return false
}

function wrapInCode(node) {
    var code = document.createElement('code')
    while (node.firstChild) {
        code.appendChild(node.firstChild)
    }
    node.appendChild(code)
}

function canHighlight(node) {
    if (!node || !node.firstChild || !node.tagName) return false
    var tagName = node.nodeName.toLowerCase()
    return (tagName === 'code' || tagName === 'pre')
        && !isHighlighted(node) && !canHighlight(node.parentElement)
}

function isHighlighted(node) {
    return node.querySelector && !!node.querySelector('span')
}

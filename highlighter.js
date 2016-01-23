var sel = document.getSelection()

if (sel && sel.anchorNode) {
    var node = sel.anchorNode
    while (!node.tagName) {
        node = node.parentElement
    }
    if (node.tagName === 'PRE') {
        var code = document.createElement('code')
        while (node.firstChild) {
            code.appendChild(node.firstChild)
        }
        node.appendChild(code)
        hljs.highlightBlock(code)
    }
}

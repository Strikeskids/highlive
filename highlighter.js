var sel = document.getSelection()

if (sel && sel.anchorNode) {
    var node = sel.anchorNode
    while (node && !isHighlighted(node) && !canHighlight(node)) {
        node = node.parentElement
    }
    if (canHighlight(node)) {
        runHighlight(node)
    }
}

function runHighlight(node) {
    var text = node.textContent
    var oldClassName = node.className

    var result = hljs.highlightAuto(text)

    node.innerHTML = `<code class="hljs ${result.language}">${result.value}</code>`
    
    node.style.cssText += 'position: relative;'
    addLanguageNode(node, result.language)
}

function buildClassName(className, language) {
    var result = className
    if (!result.match(/\bhljs\b/)) {
        result += ' hljs'
    }
    if (result.indexOf(language) === -1) {
        result += ' ' + language
    }
    return result
}

function addLanguageNode(node, language) {
    var menu = document.createElement('div')
    menu.style.cssText = (
            'position: absolute;' +
            'right: 0;' +
            'top: 0;' +
            'font-family: initial;' +
            'white-space: initial;' +
            'background-color: #f0fff0;' + 
            'padding: 5px;' +
            'border-bottom-left-radius: 5px;'
        )
    menu.innerText = language
    node.appendChild(menu)
}

function canHighlight(node) {
    if (!node || !node.firstChild || !node.tagName) return false
    var tagName = node.nodeName.toLowerCase()
    return (tagName === 'pre')
        && !isHighlighted(node) && !canHighlight(node.parentElement)
}

function isHighlighted(node) {
    return node.querySelector && !!node.querySelector('span')
}

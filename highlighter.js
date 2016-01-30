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
    node.appendChild(languageInfoNode(result.language))
}

function languageInfoNode(currentSelected) {
    var languages = hljs.listLanguages()
    var languageOptions = languages.map((language) => `
            <option value="${language}"
                    ${currentSelected === language ? 'selected' : ''}>
                ${language}
            </option>
        `)

    var wrapper = document.createElement('div')
    wrapper.style.cssText = `
            position: absolute;
            right: 0;
            top: 0;
            font-family: initial;
            white-space: initial;
            background-color: #f0fff0;
            padding: 5px;
            border-bottom-left-radius: 5px;
        `
    wrapper.innerHTML = `
            <select class="highlight-language">
                ${languageOptions.join('\n')}
            </select>
        `

    var select = wrapper.querySelector('select.highlight-language')

    select.addEventListener('change', (e) => {
            var main = wrapper.parentElement
            var code = main.querySelector('.hljs')
            if (code) {
                code.innerHTML = hljs.highlight(select.value, code.textContent, true).value
            }
        })

    return wrapper
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

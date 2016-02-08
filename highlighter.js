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

    var analysis = analyzeText(text)
    var result = analysis.best

    node.innerHTML = `<code class="hljs ${result.language}">${result.value}</code>`
    node.appendChild(languageInfoNode(analysis))
}

function analyzeText(text, languages) {
    var best = {
        language: '',
        relevance: 0,
        value: text,
    }
    languages = languages || hljs.listLanguages()
    var data = languages.map((language) => {
        var info = hljs.highlight(language, text, false)
        info.language = language
        if (info.r > best.relevance) {
            best = {
                language: info.language,
                value: info.value,
                relevance: info.r,
            }
        }
        return {
            language: info.language,
            relevance: info.r
        }
    })
    data.sort((a, b) => b.relevance - a.relevance)
    return {
        data: data,
        best: best,
    }
}

function languageInfoNode(analysis) {
    var currentSelected = analysis.best.language
    var languageOptions = analysis.data.map((cur) => `
            <div data-language="${cur.language}" class="hl-language">
                ${cur.language}: ${cur.relevance}
            </div>
        `)

    var wrapper = document.createElement('div')
    wrapper.className = 'hl-language-choice'
    wrapper.innerHTML = languageOptions.join('\n')

    var buttons = wrapper.querySelectorAll('.hl-language')
    Array.prototype.forEach.call(buttons, function(b) {
        if (b.dataset.language === currentSelected) {
            b.classList.add('hl-selected')
        }
        b.addEventListener('click', languageClicked)
    })

    return wrapper

    function languageClicked(e) {
        var language = e.target.dataset.language
        var main = wrapper.parentElement
        var code = main.querySelector('.hljs')
        if (code && language) {
            wrapper.querySelector('.hl-selected').classList.remove('hl-selected')
            e.target.classList.add('hl-selected')
            code.innerHTML = hljs.highlight(language, code.textContent, true).value
        }
    }
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

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
    node.style.cssText += 'position: relative; margin: 0;'

    var computedBodyStyle = getComputedStyle(document.body)
    var computedHljsStyle = getComputedStyle(node.firstChild)

    if (computedBodyStyle['background-color'] === 'rgba(0, 0, 0, 0)') {
        // Make body color hljs color if transparent
        document.body.style.backgroundColor = computedHljsStyle['background-color']
    }
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
    data.sort((a, b) => a.language.localeCompare(b.language))
    return {
        data: data,
        best: best,
    }
}

function relevanceColor(current, max) {
    var ratio = (current / max)
    var lightness = 94 - 25 * ratio * ratio
    return `hsl(120, 100%, ${lightness}%)`
}

function languageInfoNode(analysis) {
    var currentSelected = analysis.best.language
    var maxRelevance = Math.max(...analysis.data.map(cur => cur.relevance))
    var languageOptions = analysis.data.map((cur) => `
            <div data-language="${cur.language}"
                style="background-color: ${relevanceColor(cur.relevance, maxRelevance)}"
                class="hl-language">
                ${cur.language}
            </div>
        `.trim())

    var wrapper = document.createElement('div')
    wrapper.className = 'hl-language-choice'
    wrapper.innerHTML = languageOptions.join('\n')

    var buttons = wrapper.querySelectorAll('.hl-language')
    Array.prototype.forEach.call(buttons, function(b) {
        if (b.dataset.language === currentSelected) {
            b.classList.add('hl-selected')
        }
    })
    wrapper.addEventListener('click', containerClicked)
    document.body.addEventListener('keydown', keydown)

    return wrapper

    function keydown(e) {
        var code = e.which || e.keyCode
        if (code === 27) {
            wrapper.className = wrapper.className.replace('hl-active', '')
        }
    }

    function containerClicked(e) {
        if (wrapper.classList.contains('hl-active')) {
            var target = e.target
            var language = target.dataset.language
            var code = wrapper.parentElement.querySelector('.hljs')
            if (code && language && !target.classList.contains('hl-selected')) {
                wrapper.querySelector('.hl-selected').classList.remove('hl-selected')
                e.target.classList.add('hl-selected')
                code.innerHTML = hljs.highlight(language, code.textContent, true).value
            }
            wrapper.classList.remove('hl-active')
        } else {
            wrapper.classList.add('hl-active')
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

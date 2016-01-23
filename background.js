chrome.webRequest.onResponseStarted.addListener(handlePageLoad,
    {
        types: ['main_frame', 'sub_frame'],
        urls: ['<all_urls>']
    },
    ['responseHeaders']
)

function handlePageLoad(details) {
    var contentType = getContentType(details)
    if (contentType.startsWith('text/plain')) {
        // Perform language detection
        // Perform syntax highlighting
    }
}

function getContentType(details) {
    if (!details || !details.responseHeaders) return
    var header = details.responseHeaders.find(header => header.name.toLowerCase() === 'content-type')
    return header && header.value
}

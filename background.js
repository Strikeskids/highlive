chrome.webRequest.onResponseStarted.addListener(handlePageLoad,
    {
        types: ['main_frame', 'sub_frame'],
        urls: ['<all_urls>']
    },
    ['responseHeaders']
)

function handlePageLoad(details) {
    console.log(details.responseHeaders)
}
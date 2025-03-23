document.addEventListener("DOMContentLoaded", function () {
    const resetButtonElem = document.getElementById('confirmreset')
    const resultElem = document.getElementById('result')
    if (!resetButtonElem || !resultElem) return;
        resetButtonElem.addEventListener('click', function() {
        let storageclear = browser.storage.sync.clear()
        let localstorageclear = browser.storage.local.clear()
        Promise.all([storageclear, localstorageclear]).then(() => {
            resultElem.textContent = 'リセットしました。5秒後にメイン設定に戻ります...'
            const buttonsAndAnchors = document.querySelectorAll('button, a');
            Array.from(buttonsAndAnchors).forEach(element => element.remove());
            setTimeout(function() {
                window.location.href = "settings.html"
            }, 5000)
        })
    })
});
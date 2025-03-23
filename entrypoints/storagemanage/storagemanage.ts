document.querySelectorAll('a').forEach((elem) => {
    elem.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.style.animation = 'fadeout 0.1s ease forwards 0s'
        if (e.target && e.target instanceof HTMLAnchorElement) {
            let href = e.target.getAttribute('href')
            setTimeout(function () {
                if (href) window.location.href = href
            }, 100)
        }
    }, true)
})

document.addEventListener("DOMContentLoaded", async () => {
    let result = await browser.storage.sync.get(null);
    let storageText = JSON.stringify(result)
    const storageDataElem = document.getElementById('storage-data');
    if (!storageDataElem) return
    storageDataElem.textContent = storageText
    const storagetoclipboardElem = document.getElementById('storagetoclipboard');
    if (storagetoclipboardElem) {
        storagetoclipboardElem.addEventListener('click', function () {
            navigator.clipboard.writeText(storageText);
            this.textContent = 'コピーしました'
        })
    }
    const showstorageElem = document.getElementById('showstorage');
    if (showstorageElem) {
        showstorageElem.addEventListener('click', function () {
            if (this.textContent === "非表示") {
                storageDataElem.style.backgroundColor = '#000';
                storageDataElem.style.color = '#000';
                this.textContent = '表示'
            } else {
                storageDataElem.style.backgroundColor = 'transparent';
                storageDataElem.style.color = 'inherit';
                this.textContent = '非表示'
            }
        });
    }

    const importElem = document.getElementById('import');
    if (importElem) {
        importElem.addEventListener('click', async () => {
            const StorageInput = document.getElementById('inputstorage')
            if (!StorageInput || !(StorageInput instanceof HTMLTextAreaElement)) return;
            const input = StorageInput.value;
            if (!input) return;

            try {
                let importedStorage = JSON.parse(input);
                await browser.storage.sync.set(importedStorage)
                const importResult = document.getElementById('importresult');
                if (importResult) {
                    importResult.style.color = 'green';
                    importResult.textContent = `インポートに成功しました`;
                }
                const newResult = await browser.storage.sync.get(null);
                storageDataElem.textContent = JSON.stringify(newResult);

            } catch (err) {
                const importResult = document.getElementById('importresult');
                if (importResult) {
                    importResult.style.color = 'red';
                    importResult.textContent = `インポートに失敗しました: ${err}`;
                }
            }
        });
    }

    let localResult = await browser.storage.local.get(null)
    let localStorageText = JSON.stringify(localResult)
    let localStorageBlob = new Blob([localStorageText])
    const sizeElement = document.getElementById('localstoragesize')
    if (sizeElement) sizeElement.textContent = localStorageBlob.size.toString()
    // Rewrite this portion without jQuery
    const localstorageToclipboardButton = document.getElementById('localstoragetoclipboard');
    if (localstorageToclipboardButton) {
        localstorageToclipboardButton.addEventListener('click', function () {
            navigator.clipboard.writeText(localStorageText);
            localstorageToclipboardButton.textContent = 'コピーしました';
        });
    }


    const clearLocalStorageButtonElem = document.getElementById('clearlocalstorage')
    if (clearLocalStorageButtonElem) clearLocalStorageButtonElem.addEventListener('click', function () {
        let localstorageclear = browser.storage.local.clear()
        if (localstorageclear == undefined) {
            localstorageclear = browser.storage.local.clear()
        }
        localstorageclear.then(() => {
            location.reload()
        })
    })
});
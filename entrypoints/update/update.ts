const manifestData = browser.runtime.getManifest()
document.addEventListener("DOMContentLoaded", function () {
    const currentVersionElem = document.getElementById("current-version")
    if (!currentVersionElem) return
    currentVersionElem.textContent = manifestData.version_name || manifestData.version || "Unknown"
})

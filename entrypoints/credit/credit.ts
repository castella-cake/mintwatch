document.addEventListener("DOMContentLoaded", function () {
    const manifestData = browser.runtime.getManifest()
    const thisVersion = manifestData.version_name || manifestData.version || "Unknown"
    const versionElem = document.getElementById("version")
    if (versionElem) versionElem.textContent = "v" + thisVersion + " Manifest V" + manifestData.manifest_version
})

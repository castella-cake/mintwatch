function onError(error) {
    console.log(`Error: ${error}`);
}

document.addEventListener("DOMContentLoaded", function () { 
    const manifestData = browser.runtime.getManifest();
    const thisVersion = manifestData.version_name || manifestData.version || "Unknown"
    document.getElementById("version").textContent = "v" + thisVersion + " Manifest V" + manifestData.manifest_version;
})

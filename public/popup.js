document.addEventListener("DOMContentLoaded", () => {
  const listVersionElement = document.getElementById("list_version");

  chrome.runtime.sendMessage(
    "INITIALIZE_POPUP",
    ([siteListVersion, isNeedEdge]) => {
      listVersionElement.textContent = siteListVersion;
      document.getElementById("message").textContent = isNeedEdge
        ? "Need Edge detected!"
        : "Need Edge not detected.";
    }
  );

  document.getElementById("update").addEventListener("click", () => {
    listVersionElement.textContent = "Updating...";
    chrome.runtime.sendMessage(
      "FORCE_UPDATE_NEED_EDGE_DATA",
      (siteListVersion) => {
        listVersionElement.textContent = siteListVersion;
      }
    );
  });
});

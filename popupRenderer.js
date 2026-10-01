window.addEventListener("DOMContentLoaded", () => {
    const exitButton = document.getElementById("exit");

    if (!exitButton) {
        console.error("Exit button not found in popup.html.");
        return;
    }

    if (!window.electronAPI?.exitPopup) {
        console.error("electronAPI.exitPopup is not available.");
        return;
    }

    exitButton.addEventListener("click", () => {
        console.log("Exit clicked: calling exitPopup()");
        window.electronAPI.exitPopup();
    });
});

let focusStateEl;
let statusIndicatorEl;
let userIdEl;

async function updateFocusUI() {
    try {
        const focusMode = await window.firebaseAPI.getFocusMode();

        if (focusMode === true) {
            focusStateEl.textContent = "ON";
            focusStateEl.classList.remove("off");
            focusStateEl.classList.add("on");

            statusIndicatorEl.classList.remove("off");
            statusIndicatorEl.classList.add("on");
        } else {
            focusStateEl.textContent = "OFF";
            focusStateEl.classList.remove("on");
            focusStateEl.classList.add("off");

            statusIndicatorEl.classList.remove("on");
            statusIndicatorEl.classList.add("off");
        }
    } catch (err) {
        console.error("Error updating focus UI:", err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    userIdEl = document.getElementById("userId");
    focusStateEl = document.getElementById("focusState");
    statusIndicatorEl = document.getElementById("statusIndicator");

    // Defensive check
    if (!userIdEl || !focusStateEl || !statusIndicatorEl) {
        console.error("One or more DOM elements not found.");
        return;
    }

    try {
        await window.firebaseAPI.setFocusMode(false);
        focusStateEl.textContent = "OFF";
        focusStateEl.classList.add("off");
        focusStateEl.classList.remove("on");
        statusIndicatorEl.classList.add("off");
        statusIndicatorEl.classList.remove("on");
    } catch (err) {
        console.error("Error resetting focusMode on load:", err);
    }

    try {
        const username = await window.firebaseAPI.getUsername();
        if (username?.length >= 8) {
            userIdEl.textContent = `${username.substring(0, 4)}-${username.substring(4)}`;
        } else {
            userIdEl.textContent = "INVALID-ID";
        }
    } catch (err) {
        userIdEl.textContent = "NOT-FOUND";
        console.error("Could not load USER_ID:", err);
    }

    // Regular UI sync
    setInterval(updateFocusUI, 1000);

    // Reset focusMode before quitting
    window.onbeforeunload = async (e) => {
        e.returnValue = false;
        try {
            await window.firebaseAPI.resetFocusMode();
        } catch (err) {
            console.error("Error resetting focusMode before quit:", err);
        } finally {
            window.onbeforeunload = null;
            window.close();
        }
    };
});

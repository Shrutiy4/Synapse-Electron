// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("firebaseAPI", {
    getUsername: () => ipcRenderer.invoke("get-username"),
    setFocusMode: (value) => ipcRenderer.invoke("set-focus-mode", value),
    getFocusMode: () => ipcRenderer.invoke("get-focus-mode"),
    resetFocusMode: () => ipcRenderer.invoke("reset-focus-mode")
});

contextBridge.exposeInMainWorld("electronAPI", {
    exitPopup: () => ipcRenderer.send("terminate-popup")
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("harmony", {
  navigate: (url) => ipcRenderer.send("navigate", url),

  back: () => ipcRenderer.send("back"),

  forward: () => ipcRenderer.send("forward"),

  refresh: () => ipcRenderer.send("refresh"),

  newTab: () => ipcRenderer.send("new-tab"),

  switchTab: (id) => ipcRenderer.send("switch-tab", id),

  closeTab: (id) => ipcRenderer.send("close-tab", id),

  onUrlChanged: (callback) => {
    ipcRenderer.on("url-changed", (_, url) => {
      callback(url);
    });
  },

  onTabsUpdated: (callback) => {
    ipcRenderer.on(
      "tabs-updated",
      (_, tabs, activeTabId) => {
        callback(tabs, activeTabId);
      }
    );
  },
});
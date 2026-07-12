import {
  app,
  BrowserWindow,
  WebContentsView,
  ipcMain,
} from "electron";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HarmonyTab {
  id: string;
  title: string;
  url: string;
  view: WebContentsView;
}

let mainWindow: BrowserWindow | null = null;

let tabs: HarmonyTab[] = [];
let activeTabId: string | null = null;

function getActiveTab() {
  return tabs.find((tab) => tab.id === activeTabId);
}

function updateTabBounds() {
  if (!mainWindow) return;

  const activeTab = getActiveTab();
  if (!activeTab) return;

  const [width, height] = mainWindow.getContentSize();

  activeTab.view.setBounds({
    x: 0,
    y: 110,
    width,
    height: height - 110,
  });
}

function sendTabsToRenderer() {
  mainWindow?.webContents.send(
    "tabs-updated",
    tabs.map((tab) => ({
      id: tab.id,
      title: tab.title,
      url: tab.url,
    })),
    activeTabId
  );
}

function switchToTab(tabId: string) {
  if (!mainWindow) return;

  const targetTab = tabs.find((tab) => tab.id === tabId);
  if (!targetTab) return;

  tabs.forEach((tab) => {
    mainWindow.contentView.removeChildView(tab.view);
  });

  mainWindow.contentView.addChildView(targetTab.view);

  activeTabId = tabId;

  updateTabBounds();

  mainWindow.webContents.send(
    "url-changed",
    targetTab.url
  );

  sendTabsToRenderer();
}

function createTab(
  initialUrl = "https://google.com"
) {
  if (!mainWindow) return;

  const id = crypto.randomUUID();

  const view = new WebContentsView();

  const tab: HarmonyTab = {
    id,
    title: "New Tab",
    url: initialUrl,
    view,
  };

  view.webContents.loadURL(initialUrl);

  view.webContents.on(
    "page-title-updated",
    (_, title) => {
      tab.title = title;
      sendTabsToRenderer();
    }
  );

  view.webContents.on(
    "did-navigate",
    (_, url) => {
      tab.url = url;

      if (activeTabId === tab.id) {
        mainWindow?.webContents.send(
          "url-changed",
          url
        );
      }

      sendTabsToRenderer();
    }
  );

  view.webContents.on(
    "did-navigate-in-page",
    (_, url) => {
      tab.url = url;

      if (activeTabId === tab.id) {
        mainWindow?.webContents.send(
          "url-changed",
          url
        );
      }

      sendTabsToRenderer();
    }
  );

  tabs.push(tab);

  switchToTab(id);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,

    title: "Harmony",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  createTab("https://google.com");

  mainWindow.on("resize", () => {
    updateTabBounds();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("navigate", (_, input: string) => {
  const activeTab = getActiveTab();
  if (!activeTab) return;

  let target = input.trim();

  const looksLikeUrl =
    target.includes(".") ||
    target.startsWith("localhost") ||
    target.startsWith("http://") ||
    target.startsWith("https://");

  if (looksLikeUrl) {
    if (
      !target.startsWith("http://") &&
      !target.startsWith("https://")
    ) {
      target = `https://${target}`;
    }
  } else {
    target =
      `https://www.google.com/search?q=` +
      encodeURIComponent(target);
  }

  activeTab.view.webContents.loadURL(target);
});

ipcMain.on("new-tab", () => {
  createTab();
});

ipcMain.on("switch-tab", (_, id: string) => {
  switchToTab(id);
});

ipcMain.on("close-tab", (_, id: string) => {
  if (tabs.length === 1) return;

  const index = tabs.findIndex(
    (tab) => tab.id === id
  );

  if (index === -1) return;

  const closingTab = tabs[index];

  mainWindow?.contentView.removeChildView(
    closingTab.view
  );

  closingTab.view.webContents.close();

  tabs.splice(index, 1);

  if (activeTabId === id) {
    const nextTab =
      tabs[index] || tabs[index - 1];

    if (nextTab) {
      switchToTab(nextTab.id);
    }
  }

  sendTabsToRenderer();
});

ipcMain.on("back", () => {
  getActiveTab()?.view.webContents.goBack();
});

ipcMain.on("forward", () => {
  getActiveTab()?.view.webContents.goForward();
});

ipcMain.on("refresh", () => {
  getActiveTab()?.view.webContents.reload();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (
      BrowserWindow.getAllWindows().length === 0
    ) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
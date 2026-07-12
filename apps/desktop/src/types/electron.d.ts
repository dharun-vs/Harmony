export {};

interface HarmonyTab {
  id: string;
  title: string;
  url: string;
}

declare global {
  interface Window {
    harmony: {
      navigate: (url: string) => void;

      back: () => void;

      forward: () => void;

      refresh: () => void;

      newTab: () => void;

      switchTab: (id: string) => void;

      closeTab: (id: string) => void;

      onUrlChanged: (
        callback: (url: string) => void
      ) => void;

      onTabsUpdated: (
        callback: (
          tabs: HarmonyTab[],
          activeTabId: string
        ) => void
      ) => void;
    };
  }
}
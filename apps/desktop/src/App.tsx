import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  Sparkles,
  MoreVertical,
  X,
} from "lucide-react";

interface HarmonyTab {
  id: string;
  title: string;
  url: string;
}

export default function App() {
  const [url, setUrl] = useState("");

  const [tabs, setTabs] = useState<HarmonyTab[]>([]);

  const [activeTabId, setActiveTabId] =
    useState("");

  const navigate = () => {
    if (!url.trim()) return;

    window.harmony.navigate(url);
  };

  useEffect(() => {
    window.harmony.onUrlChanged((newUrl) => {
      setUrl(newUrl);
    });

    window.harmony.onTabsUpdated(
      (tabs, activeTabId) => {
        setTabs(tabs);
        setActiveTabId(activeTabId);
      }
    );
  }, []);

  return (
    <div className="h-screen bg-[#07070A] text-white flex flex-col overflow-hidden">

      {/* Tabs Bar */}

      <div className="h-14 flex items-center px-3 gap-2 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">

        <div className="text-purple-400 font-semibold px-2">
          Harmony
        </div>

        <div className="flex gap-2 overflow-x-auto">

          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() =>
                window.harmony.switchTab(tab.id)
              }
              className={`
                group
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-2xl
                cursor-pointer
                transition
                min-w-[180px]
                max-w-[220px]
                ${
                  activeTabId === tab.id
                    ? "bg-purple-500/20 border border-purple-400/20"
                    : "bg-white/[0.03] hover:bg-white/[0.06]"
                }
              `}
            >
              <span className="truncate flex-1 text-sm">
                {tab.title}
              </span>

              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    window.harmony.closeTab(
                      tab.id
                    );
                  }}
                  className="
                    opacity-0
                    group-hover:opacity-100
                    transition
                  "
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}

        </div>

        <button
          onClick={() =>
            window.harmony.newTab()
          }
          className="
            w-9
            h-9
            rounded-xl
            hover:bg-white/5
            transition
            flex
            items-center
            justify-center
          "
        >
          <Plus size={18} />
        </button>

        <div className="ml-auto flex gap-2 text-zinc-400">
          <button className="w-8 h-8 rounded-lg hover:bg-white/5">
            ─
          </button>

          <button className="w-8 h-8 rounded-lg hover:bg-white/5">
            □
          </button>

          <button className="w-8 h-8 rounded-lg hover:bg-red-500/20">
            ✕
          </button>
        </div>
      </div>

      {/* Navigation Bar */}

      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5 bg-white/[0.015] backdrop-blur-xl">

        <button
          onClick={() =>
            window.harmony.back()
          }
          className="w-10 h-10 rounded-xl hover:bg-white/5 transition flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          onClick={() =>
            window.harmony.forward()
          }
          className="w-10 h-10 rounded-xl hover:bg-white/5 transition flex items-center justify-center"
        >
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() =>
            window.harmony.refresh()
          }
          className="w-10 h-10 rounded-xl hover:bg-white/5 transition flex items-center justify-center"
        >
          <RefreshCw size={18} />
        </button>

        <input
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate();
            }
          }}
          placeholder="Ask, search, or enter an address..."
          className="
            flex-1
            h-11
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/10
            backdrop-blur-xl
            px-5
            outline-none
            text-white
            placeholder:text-zinc-500
          "
        />

        <button className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/20 flex items-center justify-center">
          <Sparkles size={18} />
        </button>

        <button className="w-10 h-10 rounded-xl hover:bg-white/5 transition flex items-center justify-center">
          <MoreVertical size={18} />
        </button>

      </div>

      <div className="flex-1 bg-[#050507]" />

    </div>
  );
}
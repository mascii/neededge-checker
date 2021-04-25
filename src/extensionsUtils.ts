import { browser, Tabs } from "webextension-polyfill-ts";

export async function getActiveTab(): Promise<Tabs.Tab | undefined> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export function setIcon(flag: boolean, tabId: number) {
  const path = flag
    ? {
        "16": "icons/16.png",
        "48": "icons/48.png",
        "128": "icons/128.png",
      }
    : {
        "16": "icons/16-gray.png",
        "48": "icons/48-gray.png",
        "128": "icons/128-gray.png",
      };
  try {
    (globalThis as any).chrome.action.setIcon({ path, tabId });
  } catch {}
}

export function setBadgeText(text: string, color = "#FF0000") {
  try {
    (globalThis as any).chrome.action.setBadgeText({ text });
    (globalThis as any).chrome.action.setBadgeBackgroundColor({
      color,
    });
  } catch {}
}

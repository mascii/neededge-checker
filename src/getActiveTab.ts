import { browser, Tabs } from "webextension-polyfill-ts";

export async function getActiveTab(): Promise<Tabs.Tab | undefined> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

import { browser } from "webextension-polyfill-ts";

import {
  fetchNeedEdgeXmlData,
  getNeedEdgeSiteListVersion,
  generateNeedEdgeTree,
  checkNeedEdge,
} from "./needEdgeUtils";
import { getActiveTab } from "./getActiveTab";
import { setIcon, setBadgeText } from "./setIcon";
import { NEED_EDGE_DATA_STORAGE_KEY } from "./constants";
import type { NeedEdgeMap } from "./NeedEdgeMap";

let siteListVersion = "not loaded";
let needEdgeTree: NeedEdgeMap | undefined;

const initializationPromise = initializeExtension();

async function initializeExtension() {
  try {
    [siteListVersion, needEdgeTree] = await getSiteListVersionAndNeedEdgeTree();
  } catch (e) {
    console.error(e);
  }

  const tab = await getActiveTab();

  if (typeof tab?.url === "string" && typeof tab?.id === "number") {
    setIcon(checkNeedEdge(needEdgeTree, tab.url), tab.id);
  }
}

async function getSiteListVersionAndNeedEdgeTree(
  forceUpdate = false
): Promise<[string, NeedEdgeMap]> {
  if (!forceUpdate) {
    const {
      [NEED_EDGE_DATA_STORAGE_KEY]: data,
    } = await browser.storage.local.get(NEED_EDGE_DATA_STORAGE_KEY);

    if (typeof data === "string") {
      return [getNeedEdgeSiteListVersion(data), generateNeedEdgeTree(data)];
    }
  }

  try {
    const data = await fetchNeedEdgeXmlData();
    browser.storage.local.set({ [NEED_EDGE_DATA_STORAGE_KEY]: data });
    setBadgeText("");
    return [getNeedEdgeSiteListVersion(data), generateNeedEdgeTree(data)];
  } catch (e) {
    setBadgeText("!");
    throw e;
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (typeof tab.url === "string") {
    setIcon(checkNeedEdge(needEdgeTree, tab.url), tabId);
  }
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await getActiveTab();

  if (tab?.id === activeInfo.tabId && typeof tab.url === "string") {
    setIcon(checkNeedEdge(needEdgeTree, tab.url), activeInfo.tabId);
  }
});

browser.runtime.onMessage.addListener(async (message: string) => {
  const tab = await getActiveTab();

  if (message === "INITIALIZE_POPUP") {
    await initializationPromise;

    let isNeedEdge = false;

    if (typeof tab?.url === "string" && typeof tab?.id === "number") {
      isNeedEdge = checkNeedEdge(needEdgeTree, tab.url);
      setIcon(isNeedEdge, tab.id);
    }

    return [siteListVersion, isNeedEdge];
  }

  if (message === "FORCE_UPDATE_NEED_EDGE_DATA") {
    [siteListVersion, needEdgeTree] = await getSiteListVersionAndNeedEdgeTree(
      true
    );

    if (typeof tab?.url === "string" && typeof tab?.id === "number") {
      setIcon(checkNeedEdge(needEdgeTree, tab.url), tab.id);
    }

    return siteListVersion;
  }
});

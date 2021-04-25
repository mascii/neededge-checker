import { NEED_EDGE_XML_URL, NEED_EDGE_MAP_PATHS_KEY } from "./constants";
import type { NeedEdgeMap } from "./types/NeedEdgeMap";

export async function fetchNeedEdgeXmlData(): Promise<string> {
  const response = await fetch(NEED_EDGE_XML_URL);
  const text = await response.text();
  return text;
}

export function getNeedEdgeSiteListVersion(needEdgeXmlData: string): string {
  return (
    needEdgeXmlData.match(/<site-list version="([0-9]+)">/)?.[1] ?? "unknown"
  );
}

export function generateNeedEdgeTree(needEdgeXmlData: string): NeedEdgeMap {
  const tree: NeedEdgeMap = new Map();

  const sites = needEdgeXmlData.matchAll(/<site url="([^"/]+)([^"]*)">/g);
  for (const [, hostname, pathname] of sites) {
    let subTree = tree;

    const domainsReversed = hostname.split(".").reverse();
    for (const domain of domainsReversed) {
      if (!subTree.has(domain)) {
        subTree.set(domain, new Map());
      }
      subTree = subTree.get(domain)!;
    }

    if (!subTree.has(NEED_EDGE_MAP_PATHS_KEY)) {
      subTree.set(NEED_EDGE_MAP_PATHS_KEY, []);
    }
    subTree.get(NEED_EDGE_MAP_PATHS_KEY)!.push(pathname);
  }

  return tree;
}

export function checkNeedEdge(
  needEdgeTree: NeedEdgeMap | undefined,
  url: string | undefined
): boolean {
  if (needEdgeTree == null || url == null) {
    return false;
  }

  try {
    const { protocol, hostname, pathname } = new URL(url);

    if (protocol !== "http:" && protocol !== "https:") {
      return false;
    }

    let subTree: NeedEdgeMap | undefined = needEdgeTree;

    const domainsReversed = hostname.split(".").reverse();
    for (const domain of domainsReversed) {
      subTree = subTree.get(domain);

      if (!subTree) {
        return false;
      }

      for (const path of subTree.get(NEED_EDGE_MAP_PATHS_KEY) || []) {
        if (pathname.startsWith(path)) {
          return true;
        }
      }
    }
  } catch {}

  return false;
}

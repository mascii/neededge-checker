import {
  getNeedEdgeSiteListVersion,
  generateNeedEdgeTree,
  checkNeedEdge,
} from "./needEdgeUtils";
import { NEED_EDGE_MAP_PATHS_KEY } from "./constants";

// subset of v31
const NEED_EDGE_XML_DATA = `<?xml version="1.0" encoding="utf-8" ?>
<site-list version="31">
  <site url="crowdworks.jp">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/fukuoka/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/kagoshima/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/kumamoto/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/miyazaki/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/nagasaki/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/oita/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="hondacars.jp/saga/">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="youtube.com">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
  <site url="youtubekids.com">
    <open-in allow-redirect="true">MSEdge</open-in>
  </site>
</site-list>
`;

describe("getNeedEdgeSiteListVersion", () => {
  it("check it can get version", () => {
    expect(getNeedEdgeSiteListVersion(NEED_EDGE_XML_DATA)).toBe("31");
  });
});

describe("generateNeedEdgeTree", () => {
  it("check tree construction", () => {
    const tree = generateNeedEdgeTree(NEED_EDGE_XML_DATA);
    expect(tree.has("jp")).toBe(true);
    expect(tree.has("com")).toBe(true);
    expect(tree.has(NEED_EDGE_MAP_PATHS_KEY)).toBe(false);

    const jpTree = tree.get("jp")!;
    expect(jpTree.has("crowdworks")).toBe(true);
    expect(jpTree.has("hondacars")).toBe(true);
    expect(jpTree.has(NEED_EDGE_MAP_PATHS_KEY)).toBe(false);

    const cwTree = jpTree.get("crowdworks")!;
    expect(cwTree.get(NEED_EDGE_MAP_PATHS_KEY)).toEqual([""]);

    const hondaTree = jpTree.get("hondacars")!;
    expect(hondaTree.get(NEED_EDGE_MAP_PATHS_KEY)).toEqual([
      "/fukuoka/",
      "/kagoshima/",
      "/kumamoto/",
      "/miyazaki/",
      "/nagasaki/",
      "/oita/",
      "/saga/",
    ]);

    const emptyTree = generateNeedEdgeTree("");
    expect(emptyTree.size).toBe(0);
  });
});

describe("checkNeedEdge", () => {
  const tree = generateNeedEdgeTree(NEED_EDGE_XML_DATA);
  it.each([
    ["https://crowdworks.jp/", true],
    ["https://crowdworks.jp/dashboard", true],
    ["https://blog.crowdworks.jp/", true],
    ["https://crowdworks.co.jp/", false],

    ["http://hondacars.jp/", false],
    ["http://hondacars.jp/tokyo/", false],
    ["http://hondacars.jp/fukuoka/", true],
    ["http://www.hondacars.jp/fukuoka/", true],

    ["https://www.youtube.com/", true],
    ["https://music.youtube.com/", true],

    ["https://example.com/", false],
    ["https://example.com/youtube.com", false],

    ["about:blank", false],
    ["chrome://version/", false],
    ["foo", false],
  ])("url: %s, result: %s", (url, result) => {
    expect(checkNeedEdge(tree, url)).toBe(result);
  });

  it("emptyTree", () => {
    const emptyTree = generateNeedEdgeTree("");
    expect(checkNeedEdge(emptyTree, "https://www.youtube.com/")).toBe(false);
  });
});

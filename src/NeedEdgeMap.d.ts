import type { NEED_EDGE_PATHS_KEY } from "./constants";

export interface NeedEdgeMap extends Map<string, any> {
  get(key: NEED_EDGE_PATHS_KEY): string[] | undefined;
  get(key: string): NeedEdgeMap | undefined;
  set(key: NEED_EDGE_PATHS_KEY, value: string[]): this;
  set(key: string, value: NeedEdgeMap): this;
}

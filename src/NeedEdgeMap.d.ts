import type { NEED_EDGE_PATHS_KEY } from "./constants";

export interface NeedEdgeMap extends Map<string, NeedEdgeMap | string[]> {
  get(key: NEED_EDGE_PATHS_KEY): string[] | undefined;
  get(key: string): NeedEdgeMap | undefined;
  set(key: NEED_EDGE_PATHS_KEY, value: string[]): this;
  set<T extends string>(
    key: T,
    value: T extends NEED_EDGE_PATHS_KEY ? never : NeedEdgeMap
  ): this;
}

export type NeedEdgeMapPathsKey = "$$PATHS";

export interface NeedEdgeMap extends Map<string, NeedEdgeMap | string[]> {
  get(key: NeedEdgeMapPathsKey): string[] | undefined;
  get(key: string): NeedEdgeMap | undefined;
  set(key: NeedEdgeMapPathsKey, value: string[]): this;
  set<T extends string>(
    key: T,
    value: T extends NeedEdgeMapPathsKey ? never : NeedEdgeMap
  ): this;
}

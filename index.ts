type QueryKeys<T, P extends string[] = []> = {
  queryKey: [...P];
} & (
T extends (
  ...args: any[]
) => {
  queryFn: (...args: any[]) => any;
  queryKey: any[];
}
  ? (
      ...args: Parameters<T>
    ) => {
      queryFn: () => ReturnType<ReturnType<T>['queryFn']>;
      queryKey: [...P, ...Parameters<T>];
    }
  : 
T extends (...args: any[]) => any ? 
// @ts-expect-error idk
  (...args: Parameters<T>) => { queryKey: [...P, ...Parameters<T>] } & { [K in keyof ReturnType<T>]: QueryKeys<ReturnType<T>[K], [...P, ...Parameters<T>, K]> }
: T extends
      | {
          queryFn: (...args: any[]) => any;
          queryKey: any[];
        }
      | {
          queryFn: (...args: any[]) => any;
        }
  ? T
  //@ts-expect-error idk
  : { [K in keyof T]: QueryKeys<T[K], [...P, K]> });

export function getQueryKeys<T>(input: T, path: string[] = []): QueryKeys<T> {
  const result = { queryKey: path };

  for (const key in input) {
    const newPath = [...path, key];

    if (typeof input[key] === 'function' && key === "queryFn") {
      // @ts-expect-error idk
      return { queryFn: input[key], queryKey: path };
    }

    // @ts-expect-error idk
    if (typeof input[key] === 'function' && !input[key]()["queryFn"]) {
      // @ts-expect-error idk
      result[key] = (...args) => getQueryKeys(input[key](...args), [...path, key, ...args]);
    }
    else if (typeof input[key] === 'function') {
      // Handle functions (query functions or paginated functions)
      // @ts-expect-error idk
      const fn = (...args) => ({ queryFn: input[key](...args)["queryFn"], queryKey: [...newPath, ...args] });
      fn.queryKey = newPath;
      // @ts-expect-error idk
      result[key] = fn;
    } else if (typeof input[key] === 'object') {
      // Recursively convert nested structures
      // @ts-expect-error idk
      result[key] = getQueryKeys(input[key], newPath);
    }
  }

  // @ts-expect-error idk
  return result;
};

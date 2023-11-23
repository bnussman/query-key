type QueryKeys<T, P extends string[] = []> = {
  queryKey: [...P];
} & (T extends (
  ...args: any[]
) => {
  queryFn: (...args: any[]) => any;
  queryKey: any[];
}
  ? (
      ...args: Parameters<T>
    ) => {
      queryFn: ReturnType<T>['queryFn'];
      queryKey: [...P, ...Parameters<T>];
    }
  : T extends
      | {
          queryFn: (...args: any[]) => any;
          queryKey: any[];
        }
      | {
          queryFn: (...args: any[]) => any;
        }
  ? T
  : { [K in keyof T]: QueryKeys<T[K], [...P, K]> });

export function getQueryKeys<T>(input: T, path: string[] = []): QueryKeys<T> {
  const result = { queryKey: path };

  for (const key in input) {
    const newPath = [...path, key];

    if (typeof input[key] === 'function' && key === "queryFn") {
      return { queryFn: input[key], queryKey: path };
    }

    if (typeof input[key] === 'function') {
      // Handle functions (query functions or paginated functions)
      const fn = { paginated: (...args) => ({ queryFn: input[key](...args)["queryFn"], queryKey: [...newPath, ...args] }) };
      result[key] = fn.paginated;
    } else if (typeof input[key] === 'object') {
      // Recursively convert nested structures
      result[key] = getQueryKeys(input[key], newPath);
    }
  }

  return result;
};

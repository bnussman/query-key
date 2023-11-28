# query-key

> [!Warning]
> This package is a work in progress

Similar to https://github.com/lukemorales/query-key-factory but actually allows nesting

```typescript
const queries = getQueryKeys({
  account: {
    agreements: {
      queryFn: () => Promise.resolve("agreements"),
    },
    availability: {
      all: {
        queryFn: () => Promise.resolve("all"),
      },
      paginated: (params: string, filters: number) => ({
        queryFn: () => Promise.resolve(params),
        queryKey: [params, filters],
      }),
    },
    info: {
      queryFn: () => Promise.resolve("info"),
    },
  }
});
```

```typescript
{
  queryKey: [],
  account: {
    queryKey: ["account"],
    agreements: {
      queryKey: ["account", "agreements"]
      queryFn: () => Promise.resolve("agreements"),
    },
    info: {
      queryKey: ["account", "info"],
      queryFn: () => Promise.resolve("info")
    }
    availability: {
      queryKey: ["account", "availability"],
      all: {
        queryKey: ["account", "availability", "all"] 
        queryFn: () => Promise.resolve("all")
      },
      paginated: (params: string, filters: number) => ({
        queryFn: () => Promise.resolve(params),
        queryKey: ["account", "availability", "paginated", params, filters],
      })
    },
  }
}
```

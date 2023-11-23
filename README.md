# query-key

```typescript
const queries = getQueryKeys({
  agreements: {
    queryFn: () => Promise.resolve("agreements"),
  },
  avilability: {
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
    avilability: {
      queryKey: ["account", "avilability"],
      all: {
        queryKey: ["account", "avilability", "all"] 
        queryFn: () => Promise.resolve("all")
      },
      paginated: (params: string, filters: number) => ({
        queryFn: () => Promise.resolve(params),
        queryKey: ["account", "avilability", "paginated", params, filters],
      })
    },
  }
}
```
# @bnussman/query-key

A simple package to help you construct typesafe query keys for [`@tanstack/react-query`](https://tanstack.com/query) 🔑

This package is inspired by and is similar to [`@lukemorales/query-key-factory`](https://github.com/lukemorales/query-key-factory), but allows you to nest queries.

## 🚀 Main Features
- Generates typesafe query keys based on an object's shape
- Tightly couples queryKey and queryFn based on [this](https://twitter.com/TkDodo/status/1724082589068075450) reccomendation
- Allows infinite nesting

## Usage

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

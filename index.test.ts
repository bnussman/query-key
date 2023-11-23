import { expect, expectTypeOf, test } from "vitest";
import { getQueryKeys } from ".";

test("should handle functions", async () => {
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

  expect(queries.avilability.paginated("test", 1).queryKey).toStrictEqual(["avilability", "paginated", "test", 1]);
  expect((await queries.avilability.paginated("test", 1).queryFn())).toEqual("test");

  expectTypeOf(queries.info.queryFn).toBeFunction()
  expectTypeOf(queries.info).toMatchTypeOf<{ queryFn: () => Promise<string>, queryKey: ["info"] }>()
});

test("should handle object nesting", async () => {
  const queries = getQueryKeys({
    account: {
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
    }
  });

  console.log(JSON.stringify(queries, null, 2))
  console.log(queries)

  expect(queries.account.avilability.paginated("test", 1).queryKey).toStrictEqual(["account", "avilability", "paginated", "test", 1]);
  expect((await queries.account.avilability.paginated("test", 1).queryFn())).toEqual("test");

  expectTypeOf(queries.account.info.queryFn).toBeFunction()
  expectTypeOf(queries.account.info).toMatchTypeOf<{ queryFn: () => Promise<string>, queryKey: ["account", "info"] }>()
});

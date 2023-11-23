import { expect, expectTypeOf, test } from "vitest";
import { getQueryKeys } from ".";


test("should handle functions", async () => {
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

  expect(queries.account.avilability.paginated("test", 1).queryKey).toStrictEqual(["account", "avilability", "paginated", "test", 1]);
  expect((await queries.account.avilability.paginated("test", 1).queryFn())).toEqual("test");

  expectTypeOf(queries.account.info.queryFn).toBeFunction()
  expectTypeOf(queries.account.info).toMatchTypeOf<{ queryFn: () => Promise<string>, queryKey: ["account", "info"] }>()
});

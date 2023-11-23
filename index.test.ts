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

test("should handle very deep nesting", async () => {
  const queries = getQueryKeys({
    linodes: {
      paginated: (params: string, filters: number) => ({
        queryFn: () => Promise.resolve(params),
        queryKey: [params, filters],
      }),
      all: {
        queryFn: () => Promise.resolve("all")
      },
      linode: {
        details: (id: number) => ({
          queryFn: () => Promise.resolve(id),
          queryKey: [id],
        }),
        volumes: (id: number) => ({
          queryFn: () => Promise.resolve(id),
          queryKey: [id],
        }),
      }
    }
  });

  expect(queries.linodes.paginated("test", 1).queryKey).toStrictEqual(["linodes", "paginated", "test", 1]);
  expect(queries.linodes.linode.details(1).queryKey).toStrictEqual(["linodes", "linode", "details", 1]);
  expect(queries.linodes.linode.volumes(1).queryKey).toStrictEqual(["linodes", "linode", "volumes", 1]);
  expect((await queries.linodes.linode.volumes(1).queryFn())).toEqual(1);
});

test("should handle very deep nesting", async () => {
  const queries = getQueryKeys({
    linodes: {
      paginated: (params: string, filters: number) => ({
        queryFn: () => Promise.resolve(params),
        queryKey: [params, filters],
      }),
      all: {
        queryFn: () => Promise.resolve("all")
      },
      linode: (id: number) => ({
        details: {
          queryFn: () => Promise.resolve(id),
        },
        volumes: {
          queryFn: () => Promise.resolve(id),
        },
      }),
    }
  });

  expect(queries.linodes.paginated("test", 1).queryKey).toStrictEqual(["linodes", "paginated", "test", 1]);
  expect(queries.linodes.linode(1).details).toStrictEqual(["linodes", "linode", "details", 1]);
  expect(queries.linodes.linode(1).volumes).toStrictEqual(["linodes", "linode", "volumes", 1]);
  expect((await queries.linodes.linode(1).volumes.queryFn())).toEqual(1);
});

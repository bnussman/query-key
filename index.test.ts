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
  expect(queries.avilability.paginated.queryKey).toStrictEqual(["avilability", "paginated"]);
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
  expect((await queries.linodes.paginated("test", 1).queryFn())).toStrictEqual("test");
  expect(queries.linodes.linode(1).details.queryKey).toStrictEqual(["linodes", "linode", 1, "details"]);
  expect(queries.linodes.linode(1).volumes.queryKey).toStrictEqual(["linodes", "linode", 1, "volumes"]);
  expect((await queries.linodes.linode(1).volumes.queryFn())).toEqual(1);
});


test("should handle nesting function", async () => {
  const queries = getQueryKeys({
    linodes: {
      linode: (id: number) => ({
        details: {
          queryFn: () => Promise.resolve(id),
        },
        volumes: (label: string) => ({
          details: {
            queryFn: () => Promise.resolve(id),
          },
          events: {
            queryFn: () => Promise.resolve(id),
          },
        }),
      }),
    }
  });

  expect(queries.linodes.linode(1).volumes("test").events.queryKey).toStrictEqual(["linodes", "linode", 1, "volumes", "test", "events"]);
  expect(queries.linodes.linode(1).volumes("test").queryKey).toStrictEqual(["linodes", "linode", 1, "volumes", "test"]);
});

test("should handle function params", async () => {
  const queries = getQueryKeys({
    linode: (id: string) => ({
      queryFn: () => Promise.resolve(id),
    }),
  });

  expect((await queries.linode("test").queryFn() )).toBe("test");
})


test("should be mergeable", async () => {
  const linodes = getQueryKeys({
    linodes: {
      linode: (id: number) => ({
        details: {
          queryFn: () => Promise.resolve(id),
        },
        volumes: (label: string) => ({
          details: {
            queryFn: () => Promise.resolve(id),
          },
          events: {
            queryFn: () => Promise.resolve(id),
          },
        }),
      }),
    }
  });

  const account = getQueryKeys({
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

  const queries = { ...account, ...linodes };

  expect(queries.linodes.linode(1).volumes("test").events.queryKey).toStrictEqual(["linodes", "linode", 1, "volumes", "test", "events"]);
  expect(queries.account.avilability.all.queryKey).toStrictEqual(["account", "avilability", "all"]);
});
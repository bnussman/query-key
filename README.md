# @bnussman/query-key

A simple package to help you construct typesafe query keys for [`@tanstack/react-query`](https://tanstack.com/query) 🔑

This package is inspired by and is similar to [`@lukemorales/query-key-factory`](https://github.com/lukemorales/query-key-factory), but allows you to nest queries.

## 🚀 Main Features
- Generates typesafe query keys based on an object's shape
- Tightly couples queryKey and queryFn based on [this](https://twitter.com/TkDodo/status/1724082589068075450) reccomendation
- Allows infinite nesting

## Usage

```typescript
import { getQueryKeys } from '@bnussman/query-key';
import { useQuery } from '@tanstack/react-query';

const queries = getQueryKeys({
  users: {
    paginated: (params: Params = {}, filter: Filter = {}) => ({
      queryFn: () => getUsers(params, filter),
      queryKey: [params, filter]
    }),
    user: (id: string) => ({
      queryFn: () => getUser(id)
    }),
    all: {
      queryFn: getAllUsers
    }
  },
});

const useUsersQuery = (params: Params, filter: Filter) => 
  useQuery<Page<User>, APIError[]>(queries.users.paginated(params, filter));

const useUserQuery = (id: string, enabled = true) => 
  useQuery<User, APIError[]>({
    ...queries.users.user(id),
    enabled,
  });

const useAllUsersQuery = (params: Params, filter: Filter) => 
  useQuery<User[], APIError[]>(queries.users.all);

const useUserMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<User, APIError[], Partial<User>>({
    mutationFn: (data) => updateUser(id, data),
    onSuccess: (user) => {
      queryClient.setQueryData(queries.users.user(id).queryKey, user);
      queryClient.invalidateQueries(queries.users.paginated.queryKey);
      queryClient.invalidateQueries(queries.users.all.queryKey);
    },
  });
};
```

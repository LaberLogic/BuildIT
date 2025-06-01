import type { CreateUserDto, UpdateUserDto, UserResponseDto } from "shared";

const getToken = () => `Bearer ${useAuthStore().token}`;

export const useCompanyUsers = (companyId: string) => {
  const { data, pending, error, refresh } = useFetch<UserResponseDto[]>(
    () => `/api/companies/${companyId}/users`,
    {
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    users: data,
    isLoading: pending,
    error,
    refresh,
  };
};

export const useUserById = (userId: string) => {
  const { data, pending, error, refresh } = useFetch<UserResponseDto>(
    () => `/api/users/${userId}`,
    {
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    user: data,
    isLoading: pending,
    error,
    refresh,
  };
};

export const useCreateUser = (companyId: string, payload: CreateUserDto) => {
  const { data, pending, error } = useFetch<UserResponseDto>(
    () => `/api/companies/${companyId}/users`,
    {
      method: "POST",
      body: payload,
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    user: data,
    isLoading: pending,
    error,
  };
};

export const useUpdateUser = (
  companyId: string,
  userId: string,
  payload: UpdateUserDto,
) => {
  const { data, pending, error } = useFetch<UserResponseDto>(
    () => `/api/companies/${companyId}/users/${userId}`,
    {
      method: "PUT",
      body: payload,
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    user: data,
    isLoading: pending,
    error,
  };
};

export const useDeleteUser = (companyId: string, userId: string) => {
  const { data, pending, error } = useFetch<null>(
    () => `/api/companies/${companyId}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    result: data,
    isLoading: pending,
    error,
  };
};

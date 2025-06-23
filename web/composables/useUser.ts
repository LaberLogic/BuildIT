import type { CreateUserDto, UpdateUserDto, UserResponseDto } from "shared";

const getToken = () => `Bearer ${useAuthStore().token}`;

export const useCompanyUsers = (companyId: string) => {
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<UserResponseDto[]>(
    () => `${config.public.API_BASE_URL}/companies/${companyId}/users`,
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
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<UserResponseDto>(
    () => `${config.public.API_BASE_URL}/users/${userId}`,
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

export const createUser = async (
  companyId: string,
  payload: CreateUserDto,
): Promise<UserResponseDto> => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  return await $fetch<UserResponseDto>(
    `${config.public.API_BASE_URL}/companies/${companyId}/users`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: payload,
    },
  );
};

export const updateUser = async (
  companyId: string,
  userId: string,
  payload: UpdateUserDto,
): Promise<UserResponseDto> => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  return await $fetch<UserResponseDto>(
    `${config.public.API_BASE_URL}/companies/${companyId}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: payload,
    },
  );
};

export const updateProfile = async (
  payload: UpdateUserDto,
): Promise<UserResponseDto> => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  return await $fetch<UserResponseDto>(
    `${config.public.API_BASE_URL}/users/me`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: payload,
    },
  );
};

export const deleteUser = async (
  companyId: string,
  userId: string,
): Promise<{ id: string }> => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  return await $fetch<{ id: string }>(
    `${config.public.API_BASE_URL}/companies/${companyId}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  );
};

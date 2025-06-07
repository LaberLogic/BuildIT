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

import type { CreateUserDto, UpdateUserDto, UserResponseDto } from "shared";

import { useAuthStore } from "@/stores/auth";

export const createUser = async (
  companyId: string,
  payload: CreateUserDto,
): Promise<UserResponseDto | null> => {
  try {
    const authStore = useAuthStore();
    const result = await $fetch<UserResponseDto>(
      `/api/companies/${companyId}/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: payload,
      },
    );

    return result;
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
};

export const updateUser = async (
  companyId: string,
  userId: string,
  payload: UpdateUserDto,
): Promise<UserResponseDto | null> => {
  try {
    const authStore = useAuthStore();
    const result = await $fetch<UserResponseDto>(
      `/api/companies/${companyId}/users/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: payload,
      },
    );

    return result;
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
};

export const deleteUser = async (
  companyId: string,
  userId: string,
): Promise<null | undefined> => {
  try {
    const authStore = useAuthStore();
    await $fetch<null>(`/api/companies/${companyId}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    return null;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return undefined;
  }
};

import type { RegisterDto, SignInDto } from "shared";

export const useAuth = () => {
  const config = useRuntimeConfig();

  const register = async (data: RegisterDto) => {
    return await $fetch(`${config.public.apiBase}/register`, {
      method: "POST",
      body: data,
    });
  };

  const signIn = async (data: SignInDto) => {
    return await $fetch(`${config.public.apiBase}/signin`, {
      method: "POST",
      body: data,
    });
  };

  return { register, signIn };
};

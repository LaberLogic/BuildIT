import type {
  RegisterDto,
  RegisterResponseDto,
  SignInDto,
  SignInResponseDto,
} from "shared";

export const setPassword = async (
  data: { password: string },
  token: string,
) => {
  const config = useRuntimeConfig();
  return await $fetch<RegisterResponseDto>(
    `${config.public.API_BASE_URL}/auth/set-password`,
    {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const resetPasswordRequest = async (data: { email: string }) => {
  const config = useRuntimeConfig();
  return await $fetch<RegisterResponseDto>(
    `${config.public.API_BASE_URL}/auth/reset-password`,
    {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const register = async (data: RegisterDto) => {
  const config = useRuntimeConfig();
  return await $fetch<RegisterResponseDto>(
    `${config.public.API_BASE_URL}/auth/register`,
    {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const signIn = async (data: SignInDto) => {
  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    const res = await $fetch<SignInResponseDto>(
      `${config.public.API_BASE_URL}/auth/signin`,
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.accessToken) {
      console.warn("No access token received from server");
      return { success: false };
    }

    authStore.setToken(res.accessToken);
    authStore.setUser(res.user);

    return { success: true, user: res.user };
  } catch (error) {
    console.error("Sign-in failed:", error);
    return { success: false };
  }
};

export const signOut = () => {
  const auth = useAuthStore();
  const router = useRouter();

  auth.clearAuth();
  router.push("/auth/login");
};

export type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type Address = {
  streetNumber: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type CompanyForm = {
  companyName: string;
  address: Address;
};

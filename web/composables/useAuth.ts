import type {
  RegisterDto,
  RegisterResponseDto,
  SignInDto,
  SignInResponseDto,
} from "shared";

export const getToken = () => `Bearer ${useAuthStore().token}`;

export const register = async (data: RegisterDto) => {
  return await $fetch<RegisterResponseDto>("/api/auth/register", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const signIn = async (data: SignInDto) => {
  try {
    const authStore = useAuthStore();

    const res = await $fetch<SignInResponseDto>("/api/auth/signin", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

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

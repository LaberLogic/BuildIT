import axios from "axios";
import type { RegisterDto, SignInDto } from "shared";
import { useAuthStore } from "@/stores/auth";

export const useAuth = () => {
  const auth = useAuthStore();

  const api = axios.create({
    baseURL: "http://localhost:3001/auth",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const register = async (data: RegisterDto) => {
    const response = await api.post("/register", data);
    return response.data;
  };

  const signIn = async (data: SignInDto) => {
    const { data: res } = await api.post("/signin", data);
    const token = res.accessToken;

    if (!token) return { success: false };

    auth.setToken(token);
    auth.setUser(res.user);

    return { success: true, user: res.user };
  };

  const signOut = async () => {
    try {
      auth.clearAuth();
      const router = useRouter();
      router.push("/auth/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return {
    register,
    signIn,
    signOut,
    user: computed(() => auth.user),
    token: computed(() => auth.token),
  };
};

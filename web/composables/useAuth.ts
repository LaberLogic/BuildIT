import axios from "axios";
import type { RegisterDto, SignInDto } from "shared";

export const useAuth = () => {
  const config = useRuntimeConfig();

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
    const response = await api.post("/signin", data);
    return response.data;
  };

  return { register, signIn };
};

import axios from "axios";
import type { UserResponseDto } from "shared";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as UserResponseDto | null,
    token: useCookie("token").value as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === "ADMIN",
    isManager: (state) => state.user?.role === "MANAGER",
    isManagerOrAdmin: (state): boolean =>
      state.user?.role === "MANAGER" || state.user?.role === "ADMIN",
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      useCookie("token", {
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
      }).value = token;
    },

    setUser(user: UserResponseDto) {
      this.user = user;
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      useCookie("token").value = null;
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const { data } = await axios.get<UserResponseDto>(
          "http://localhost:3001/users/me",
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        );
        this.setUser(data);
      } catch (err) {
        console.error("Failed to fetch user from token:", err);
        this.clearAuth();
      }
    },
  },
});

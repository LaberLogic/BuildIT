export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token").value;
  if (!token) {
    return navigateTo("/auth/login");
  } else navigateTo(to);
});

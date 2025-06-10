export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token").value;
  console.log(token);
  if (!token) {
    return navigateTo("/auth/login");
  } else navigateTo(to);
});

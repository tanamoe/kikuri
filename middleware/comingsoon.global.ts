export default defineNuxtRouteMiddleware((to) => {
  switch (to.path) {
    case "/about":
    case "/credits":
    case "/contact":
    case "/sitemap.xml":
    case "/profile":
      return navigateTo("/coming-soon");
  }
});

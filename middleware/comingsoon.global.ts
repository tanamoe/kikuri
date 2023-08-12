export default defineNuxtRouteMiddleware((to) => {
  switch (to.path) {
    case "/about":
    case "/credits":
    case "/contact":
    case "/sitemap.xml":
    case "/title":
    case "/profile":
      return navigateTo("/coming-soon");
  }
});

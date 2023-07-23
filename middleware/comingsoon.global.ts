export default defineNuxtRouteMiddleware((to) => {
  switch (to.path) {
    case "/about":
    case "/credits":
    case "/terms":
    case "/privacy-policy":
    case "/contact":
    case "/sitemap.xml":
    case "/title":
    case "/profile":
      return navigateTo("/coming-soon");
  }
});

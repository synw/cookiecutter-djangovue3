import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { baseTitle } from "./conf";
import HomeView from "./views/HomeView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomeView,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/page",
    component: () => import("./views/PageView.vue"),
    meta: {
      title: "Page"
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.afterEach((to, from) => { // eslint-disable-line
  document.title = `${baseTitle} - ${to.meta?.title}`
});

export default router

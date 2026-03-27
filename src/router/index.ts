import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/HomePage.vue"),
    },
    {
      path: "/search/works",
      name: "search-works",
      component: () => import("@/pages/SearchWorksPage.vue"),
    },
  ],
});

export default router;

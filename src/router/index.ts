import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/play/:gameId",
      name: "play",
      component: () => import("../views/PlayView.vue"),
    },
    {
      path: "/board",
      name: "sandbox-board",
      component: () => import("../views/SandboxBoardView.vue"),
    },
  ],
});

export default router;

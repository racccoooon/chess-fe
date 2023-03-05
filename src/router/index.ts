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
      path: "/:gameId",
      redirect: (to) => {
        return { name: "play", params: to.params };
      },
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
    {
      path: "/spectate/:gameId",
      name: "spectate",
      component: () => import("../views/SpectateView.vue"),
    },
  ],
});

export default router;

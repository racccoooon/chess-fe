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
      path: "/play",
      name: "start-playing",
      component: () => import("../views/StartPlayingView.vue"),
    },
    {
      path: "/play/:gameId",
      name: "play",
      component: () => import("../views/PlayView.vue"),
    },
  ],
});

export default router;

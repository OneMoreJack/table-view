import Vue from "vue";
import VueRouter from "vue-router";
import Basic from "../views/Basic.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "basic",
    component: Basic,
    meta: {
      title: '基本示例'
    }
  },
  {
    path: "/Complex",
    name: "Complex",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Complex.vue"),
    meta: {
      title: '复杂示例'
    }
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

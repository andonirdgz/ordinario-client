import Vue from "vue";
import VueRouter from "vue-router";
import Projects from "../views/Projects.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Projects",
    component: Projects,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

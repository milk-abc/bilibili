import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Index",
      redirect: { name: "Blogs" }
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue")
    },
    {
      path: "/blogs",
      name: "Blogs",
      component: () => import("../views/Blogs.vue")
    },
    {
      path: "/blog/add",
      name: "BlogAdd",
      component: () => import("../views/BlogEdit"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/blog/:blogId",
      name: "BlogDetail",
      component: () => import("../views/BlogDetail")
    },
    {
      path: "/blog/:blogId/edit",
      name: "BlogEdit",
      component: () => import("../views/BlogEdit")
    }
  ]
});

import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Admin from "@/views/admin/Admin";
import Login from "@/views/Login";
import test from "@/views/test";

import Cash from "@/views/admin/Cash";
import FoodAdd from "@/views/admin/FoodAdd";
import FoodManage from "@/views/admin/FoodManage";
import FoodType from "@/views/admin/FoodType";
import FoodOption from "@/views/admin/FoodOption";
import StoreAdd from "@/views/admin/StoreAdd";
import StoreList from "@/views/admin/StoreList";
import Setting from "@/views/admin/Setting";

Vue.use(VueRouter);

// admin children routes
const childRoutes = [
  {
    path: "cash",
    name: "Cash",
    component: Cash
  },
  {
    path: "foodadd",
    name: "FoodAdd",
    component: FoodAdd
  },
  {
    path: "foodmanage",
    name: "FoodManage",
    component: FoodManage
  },
  {
    path: "foodtype",
    name: "FoodType",
    component: FoodType
  },
  {
    path: "foodoption",
    name: "FoodOption",
    component: FoodOption
  },
  {
    path: "storeadd",
    name: "StoreAdd",
    component: StoreAdd
  },
  {
    path: "storelist",
    name: "StoreList",
    component: StoreList
  },
  {
    path: "set",
    name: "Setting",
    component: Setting
  }
];

// root routes
const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    children: childRoutes,
    redirect: "/admin/cash"
  },
  {
    path: "/login",
    component: Login,
    name: "login"
  },
  {
    path: "/test",
    component: test
  }
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if (!token && to.path != "/login") {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;

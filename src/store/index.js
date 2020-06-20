import Vue from "vue";
import Vuex from "vuex";
import axios from "../axios";
import { dateDiff } from "@/utils/date.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("sf-token")
      ? localStorage.getItem("sf-token")
      : "",
    info: JSON.parse(localStorage.getItem("store-info"))
      ? JSON.parse(localStorage.getItem("store-info"))
      : {},
    formRules: {
      tel: [
        { required: true, msg: "请输入手机号码" },
        { reg: /^1[34578]\d{9}$/, msg: "请输入格式正确是手机号码" }
      ],
      pass: [
        { required: true, msg: "请输入密码" },
        { reg: /^[\s\S]{8,20}$/, msg: "密码为8-12位" }
      ],
      code: [
        { required: true, msg: "请输入验证码" },
        { reg: /^\d{6}$/, msg: "验证码格式不正确" }
      ]
    },
    customers: [],
    orderList: []
  },
  getters: {},
  mutations: {
    setToken(state, payload) {
      localStorage.setItem("sf-token", payload.token);
      state.token = payload.token;
    },
    setInfo(state, payload) {
      localStorage.setItem("store-info", JSON.stringify(payload));
      state.info = payload;
    },
    pushCustomers(state, customer) {
      console.log("state: " + customer);
      state.customers.push(customer);
    },
    pushOrder(state, order) {
      console.log(order);
      order.orderNum = state.orderList.length + 1;
      state.orderList.push(order);
    },
    fillOrderList(state, orderList) {
      state.orderList = orderList;
    },
    changeOrder(state, orderid) {
      state.orderList.forEach((item, index, array) => {
        if (item.orderid == orderid) array[index].state = 0;
      });
    }
  },
  actions: {
    requestOrderList(context) {
      axios
        .get("/admin/order/list", {
          params: { storeid: context.state.info.id }
        })
        .then(res => {
          console.log(res.data);
          let result = res.data.orderlist
            .filter(item => dateDiff(item.ctime) < 0)
            .map((item, index) => {
              item.orderNum = index + 1;
              return item;
            });
          context.commit("fillOrderList", result);
        })
        .catch(err => {
          console.log("requestOrderList: \n" + err);
        });
    }
  },
  modules: {}
});

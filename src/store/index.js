import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("sf-token")
      ? localStorage.getItem("sf-token")
      : "",
    info: JSON.parse(localStorage.getItem("store-info"))
      ? JSON.parse(localStorage.getItem("store-info"))
      : {},
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
      state.customers.push(customer);
    },
    pushOrder(state, order) {
      state.orderList.push(order);
    }
  },
  actions: {},
  modules: {}
});

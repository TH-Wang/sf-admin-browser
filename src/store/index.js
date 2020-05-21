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
    }
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
    }
  },
  actions: {},
  modules: {}
});

import axios from "axios";
import router from "../router";
import store from "../store";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true
});

instance.interceptors.request.use(
  config => {
    let { url } = config;
    if (!/^\/admin\/(getcode|login)[\S]*$/.test(url)) {
      let token = store.state.token;
      if (!token) {
        console.log("请求拦截", token);
        router.replace({ path: "/login" });
        return Promise.reject("请先登录!");
      } else {
        config.headers["Authorization"] = token;
        return config;
      }
    } else {
      return config;
    }
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  res => {
    let resErr = res.data.err;
    if (resErr == 99 || resErr == 98) {
      console.log("响应拦截", resErr);
      router.replace({ path: "/login" });
      return Promise.reject("请先登录!");
    } else return res;
  },
  err => Promise.reject(err)
);

export default instance;

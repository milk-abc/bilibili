import axios from "axios";
import Vue from "vue";
import router from "./router";
const http = axios.create({
  baseURL: "http://localhost:3000/admin/api",
});

//在请求头上加token
http.interceptors.request.use(
  (config) => {
    if (localStorage.token) {
      config.headers.Authorization = "Bearer " + (localStorage.token || "");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//全局捕获error
http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: "error",
        message: err.response.data.message,
      });
      if (err.response.status === 401) {
        router.push("/login");
      }
    }

    return Promise.reject(err);
  }
);
export default http;

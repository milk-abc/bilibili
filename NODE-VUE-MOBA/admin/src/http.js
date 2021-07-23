import axios from "axios";
import Vue from "vue";
const http = axios.create({
  baseURL: "http://localhost:3000/admin/api",
});

//全局捕获error
http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    Vue.prototype.$message.error(err.response.data.message);
    return Promise.reject(err);
  }
);
export default http;

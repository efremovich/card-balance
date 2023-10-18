import Vue from "vue";

// axios
import axios from "axios";

const axiosIns = axios.create({

  baseURL: "https://xn--e1aybc.xn--80aagg0ac7bbh.xn--p1ai:8888",

  timeout: 10000,
  headers: { "Access-Control-Allow-Origin": "*", "X-Custom-Header": "foobar" }

});
Vue.prototype.$http = axiosIns;

export default axiosIns;

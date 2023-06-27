import Vue from 'vue';

// axios
import axios from 'axios';

const axiosIns = axios.create({
  // You can add your headers here
  // ================================

  baseURL: 'https://secret.re-base.ru:8888',

  timeout: 10000,
  // headers: { 'Access-Control-Allow-Origin': '*' },
  // headers: {'X-Custom-Header': 'foobar'}
});
Vue.prototype.$http = axiosIns;

export default axiosIns;

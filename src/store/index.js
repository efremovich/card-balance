import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import user from './app-user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    visible: false,
    cardNumber: null,
  },
  actions: {
    getVisible({ commit }) {
      commit('getVisible');
    },
    getNotVisible({ commit }) {
      commit('getNotVisible');
    },
    getCardNumber({ commit }, payload) {
      commit('gotNumber', payload);
    },
  },
  mutations: {
    getVisible(state) {
      state.visible = true;
    },
    getNotVisible(state) {
      state.visible = false;
    },
    gotNumber(state, payload) {
      state.cardNumber = payload;
    },
  },
  modules: {
    app,
    appConfig,
    verticalMenu,
    user,
  },
  strict: process.env.DEV,
});

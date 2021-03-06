import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import user from './app-user';

Vue.use(Vuex);
// import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
// eslint-disable-next-line import/prefer-default-export
export default new Vuex.Store({
  state: {
    visible: false,
    cardNumber: null,
    password: [null, null],
    avatar: '',
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
    getPassword({ commit }, payload) {
      commit('passwordValue', payload);
    },
    getAvatar({ commit }, payload) {
      commit('getSrc', payload);
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
    passwordValue(state, payload) {
      // eslint-disable-next-line no-sequences
      state.password[1] = payload;
    },
    getSrc(state, payload) {
      state.avatar = payload;
    },
  },
  // getters: {
  //   avatarState: (state) => state.avatar,
  // },
  modules: {
    app,
    appConfig,
    verticalMenu,
    user,
  },
  strict: process.env.DEV,
});

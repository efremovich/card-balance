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
    contractNumber: null,
    contractId: null,
    avatar: '',
    cardsView: '',
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
    getAvatar({ commit }, payload) {
      commit('getSrc', payload);
    },
    getContractNumber({ commit }, payload) {
      commit('changeContractNumber', payload);
    },
    getContractId({ commit }, payload) {
      commit('changeContractId', payload);
    },
    getCardsView({ commit }, payload) {
      commit('cardsView', payload);
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
    getSrc(state, payload) {
      state.avatar = payload;
    },
    changeContractNumber(state, payload) {
      state.contractNumber = payload;
    },
    changeContractId(state, payload) {
      state.contractId = payload;
    },
    cardsView(state, payload) {
      state.cardsView = payload;
    },
  },
  getters: {
    contractID: (state) => state.contractId,
    contractNUMBER: (state) => state.contractNumber,
    CARDS_VIEW: (state) => state.cardsView,
  },
  modules: {
    app,
    appConfig,
    verticalMenu,
    user,
  },
  strict: process.env.DEV,
});

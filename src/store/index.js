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
    contractNumber: null,
    contractId: null,
    // avatar: '',
    cardsView: '',
    selectedPage: 1,
  },
  actions: {
    getVisible({ commit }) {
      commit('getVisible');
    },
    getNotVisible({ commit }) {
      commit('getNotVisible');
    },

    // getAvatar({ commit }, payload) {
    //   commit('getSrc', payload);
    // },
    getContractNumber({ commit }, payload) {
      commit('changeContractNumber', payload);
    },
    getContractId({ commit }, payload) {
      commit('changeContractId', payload);
    },
    getCardsView({ commit }, payload) {
      commit('setCardsView', payload);
    },

  },
  mutations: {
    getVisible(state) {
      state.visible = true;
    },
    getNotVisible(state) {
      state.visible = false;
    },
    changeContractNumber(state, payload) {
      state.contractNumber = payload;
    },
    changeContractId(state, payload) {
      state.contractId = payload;
    },
    setCardsView(state, cardsView) {
      state.cardsView = cardsView;
    },
    // getSelectedPages(state, payload) {
    //   state.selectedPage = payload;
    // },
  },
  getters: {
    CONTRACT_ID: (state) => state.contractId,
    CONTRACT_NUMBER: (state) => state.contractNumber,
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

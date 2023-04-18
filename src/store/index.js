import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// Modules
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
// eslint-disable-next-line import/no-cycle
import user from './app-user';

Vue.use(Vuex);
// import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
// eslint-disable-next-line import/prefer-default-export
export default new Vuex.Store({
  state: {
    visible: false,
    contractNumber: null,
    contractId: null,
    status: null,
    cardsView: '',
    selectedPage: 1,
    cardNumber: null,
    companies: null,
    selectedCompany: null,
    companyId: null,
    email: null,
    isAdmin: null,
  },
  plugins: [createPersistedState()],
  actions: {
    getVisible({ commit }) {
      commit('getVisible');
    },
    getNotVisible({ commit }) {
      commit('getNotVisible');
    },
    getCardNumber({ commit }, payload) {
      commit('selectCardNumber', payload);
    },
    getContractNumber({ commit }, payload) {
      commit('changeContractNumber', payload);
    },
    getContractId({ commit }, payload) {
      commit('changeContractId', payload);
    },
    getCardsView({ commit }, payload) {
      commit('setCardsView', payload);
    },
    getStatus({ commit }, payload) { // Надо определять статус организации: коммерц. или бюджет
      commit('setStatus', payload);
    },
    getAllCompanies({ commit }, payload) {
      commit('setAllCompanies', payload);
    },
    getCompany({ commit }, payload) {
      commit('setCompany', payload);
    },
    getCompanyId({ commit }, payload) {
      commit('setCompanyId', payload);
    },
    getEmail({ commit }, payload) {
      commit('setEmail', payload);
    },
    getAdmin({ commit }, payload) {
      commit('setAdmin', payload);
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
    setStatus(state, payload) {
      state.status = payload;
    },
    selectCardNumber(state, payload) {
      state.cardNumber = payload;
    },
    setAllCompanies(state, payload) {
      state.companies = payload;
    },
    setCompany(state, payload) {
      state.selectedCompany = payload;
    },
    setCompanyId(state, payload) {
      state.companyId = payload;
    },
    setEmail(state, payload) {
      state.email = payload;
    },
    setAdmin(state, payload) {
      state.isAdmin = payload;
    },

  },
  getters: {
    CONTRACT_ID: (state) => state.contractId,
    CONTRACT_NUMBER: (state) => state.contractNumber,
    CARDS_VIEW: (state) => state.cardsView,
    CARD_NUMBER: (state) => state.cardNumber,
    STATUS_ORG: (state) => state.status,
    ALL_COMPANIES: (state) => state.companies,
    COMPANY: (state) => state.selectedCompany,
    COMPANY_ID: (state) => state.companyId,
    EMAIL: (state) => state.email,
    ADMIN: (state) => state.isAdmin,
  },
  modules: {
    app,
    appConfig,
    verticalMenu,
    user,
  },
  strict: process.env.DEV,
});

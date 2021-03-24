import { initialAbility } from '@/libs/acl/config';
import useJwt from '@/auth/jwt/useJwt';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {
    LOGUOT(state) {
      state.accessToken = '';
      state.refreshToken = '';

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    },
    UpdateUserData(state, payload) {
      state.User = payload.account;
    },
  },
  actions: {
    getUserData(ctx, payload) {
      const userData = payload;
      userData.ability = initialAbility;
      useJwt.setToken(userData.account.accessToken);
      useJwt.setRefreshToken(userData.account.refreshToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      return userData;
    },
    getCardStatistic(ctx, payload) {
      const cardStatistic = payload;
      localStorage.setItem('cardStatistic', JSON.stringify(cardStatistic));
      return cardStatistic;
    },
    getCurrentConsumption(ctx, payload) {
      const currentConsumption = payload;
      localStorage.setItem('currentConsumption', JSON.stringify(currentConsumption));
      return currentConsumption;
    },
    getBalance(ctx, payload) {
      const balance = payload;
      localStorage.setItem('balance', JSON.stringify(balance));
      return balance;
    },
    getConsumptionDinamic(ctx, payload) {
      const consumptionDinamic = payload;
      localStorage.setItem('consumptionDinamic', JSON.stringify(consumptionDinamic));
      return consumptionDinamic;
    },
  },
};

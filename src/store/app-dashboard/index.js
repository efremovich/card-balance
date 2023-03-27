// eslint-disable-next-line import/extensions
import useJwt from '@/auth/jwt/useJwt'; // @/auth/jwt/useJwt

export default {
  namespaced: true,
  state: {
    consumptionData: {
      thisMonth: 0,
      lastMonth: 0,
      otherMonth: 0,
    },
    consumptionSeries: [],
    currentConsumption: [],
    cardStatistic: [],
  },
  getters: {},
  mutations: {
    // Updates user info in state and localstorage
    UPDATE_DASHBOARD_DATA(state, payload) {
      // Get Data localStorage
      const dashBoardData = JSON.parse(localStorage.getItem('dashBoardData')) || state;

      // eslint-disable-next-line no-restricted-syntax
      for (const property of Object.keys(payload)) {
        if (payload[property] != null) {
          state[property] = payload[property];

          // Update key in localStorage
          dashBoardData[property] = payload[property];
        }
      }
      // Store data in localStorage
      localStorage.setItem('dashBoardData', JSON.stringify(dashBoardData));
    },
  },
  actions: {
    getCardStatistic({ commit }, playload) {
      return new Promise((resolve, reject) => {
        useJwt
          .getCardStatistic(playload.cid)
          .then((response) => {
            if (response.data.status) {
              commit('UPDATE_DASHBOARD_DATA', response.data);

              resolve(response);
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject({ message: 'Ошибка обновления расхода за текущий месяц' });
            }
          })
          .catch((error) => reject(error));
      });
    },
  },
};

import axios from '@axios';

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
    LOGUOT(state) {
      state.accessToken = '';
      state.refreshToken = '';

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    },
  },
  actions: {
    logout(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/api/user/logout', { id: payload })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
};

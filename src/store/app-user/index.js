import { initialAbility } from '@/libs/acl/config'
import useJwt from '@/auth/jwt/useJwt'

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
    LOGUOT(state) {
      state.accessToken = ''
      state.refreshToken = ''

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userData')
    },
  },
  actions: {
    getUserData(ctx, payload) {
      const userData = payload
      userData.ability = initialAbility
      useJwt.setToken(userData.account.accessToken)
      useJwt.setRefreshToken(userData.account.refreshToken)
      localStorage.setItem('userData', JSON.stringify(userData))
    },
  },
}

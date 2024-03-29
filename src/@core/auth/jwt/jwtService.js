// eslint-disable-next-line import/extensions
import router from '@/router';
// eslint-disable-next-line import/extensions
import jwtDefaultConfig from '@/@core/auth/jwt/jwtDefaultConfig';

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null;

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // For Refreshing Token
  subscribers = [];

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns;
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const accessToken = this.getToken();

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        // const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;
        // if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;

              // Update accessToken in localStorage
              this.setToken(r.data.account.accessToken);
              this.setRefreshToken(r.data.account.refreshToken);

              this.onAccessTokenFetched(r.data.account.accessToken);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              // Make sure to assign accessToken according to your response.
              // Check: https://pixinvent.ticksy.com/ticket/2413870
              // Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(this.axiosIns(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        if (response && response.status === 403) {
          if (response.config.url.includes('/api/user/refreshtoken')) {
            this.deleteToken();
            router.push({ name: 'auth-login', params: { error } });
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) => callback(accessToken));
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  deleteToken() {
    localStorage.removeItem(this.jwtConfig.storageTokenKeyName);
    localStorage.removeItem('refreshToken');
    if (localStorage.getItem('userData')) {
      localStorage.removeItem('userData');
    }
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args);
  }

  logout() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      return this.axiosIns
        .post(this.jwtConfig.logoutEndpoint, {
          id: userData.id,
        })
        .then(this.deleteToken());
    }
    return null;
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args);
  }

  verifyEmail(...args) {
    return this.axiosIns.post(this.jwtConfig.verifyEmailEndpoint, ...args);
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }

  async refreshGetCurrentUser(payload) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.post(
        `/api/user/${userData.account.uid}`,
        payload,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Изменение лимитов пользователем (заявка) //Блокировка || Разблокировка карты
  async refreshDataUserLimits(payload) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.post(
        '/api/request/new',
        payload,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Смена пароля
  async changePassword(payload) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.post(
        '/api/user/change-password',
        payload,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async refreshUserPassword(payload) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.post(
        `/api/user/${userData.account.uid}`, payload,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Смена данных о пользователе (телефон,имя,почта)
  async updateUser(payload) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.post(
        `/api/user/${userData.account.uid}`, payload,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getCurrenUser() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/user/${userData.account.uid}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getAllCompanies() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        '/api/companies',
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Данные при смене договора
  async getCurrentUserFromID(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/user/${params}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getCardStatisticFromID(param) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/card/getcardstatistic/${param}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getCardStatistic() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/card/getcardstatistic/${userData.account.contract_id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // ТРАНЗАКЦИИ
  async getTransactions(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/transactions?${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  //  отчёт по ЛИМИТАМ
  async getLimits(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/getLimitReport?${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  async getAllLimits(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/limits?${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  // ЗАЯВКИ
  async GetRequests(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/requests?${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  // Платежи
  async getPayments(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/payments?${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  // Все виды топлива
  async getService() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get('/api/services');
      return response;
    }
    return { data: { status: false } };
  }

  // Виды топлива по эмитенту
  async getServiceFromEmitent(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/services?${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  // Все периоды
  async getAllPeriods() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get('/api/limitPeriods');
      return response;
    }
    return { data: { status: false } };
  }

  // Литры или рубли
  async getAllUnits() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get('/api/limitUnits');
      return response;
    }
    return { data: { status: false } };
  }

  // Данные по карте
  async getCardData(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(`/api/card/${params}`);
      return response;
    }
    return { data: { status: false } };
  }

  async getBalance() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getBalance/${userData.account.contract_id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // при обновлении договора
  async getRefreshBalance(param) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getBalance/${param}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getCurrentConsumption() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getCurrentConsumption/${userData.account.contract_id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getConsumption(param) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getCurrentConsumption/${param}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getConsumptionDinamic() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getConsumptionDinamic/${userData.account.contract_id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  async getDynamic(param) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getConsumptionDinamic/${param}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Все карты
  async getCards(contractId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/cardsAndHolers/${contractId}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // ID организации для получения банковских реквизитов
  async getOrgId(contractId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/contract/${contractId}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Инфо по картам (cards)
  async getCardsDate(params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/cards/${userData.account.contract_id}?${params}`,

      );
      return response;
    }
    return { data: { status: false } };
  }

  // Инфо по картам при смене контракта (cards)
  async getChangeCardsDate(contractId, params) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/cards/${contractId}?${params}`,

      );
      return response;
    }
    return { data: { status: false } };
  }

  async changeContract(id) {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
      const response = await this.axiosIns.get(
        `/api/changeContract/${userData.account.uid}/${id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Все поставщики
  async getAllProviders() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        '/api/organisations',
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Все реквизиты по ID
  async getAllpayAccountsFrom(id) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/payAccount/${id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Получить покупателя
  async getConsumer(id) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/company/${id}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Отдать поставщика
  async getProvider(id, param) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/organisation/${id}?${param}`,
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Отчёт (оперативный)
  async getOperReport(id) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        `/api/getOperReport?${id}`,
        // {
        //   responseType: 'arraybuffer',
        // },
      );
      return response;
    }
    return { data: { status: false } };
  }

  // Значения для бюджетных организаций (потребление за месяц)
  async getValueServices() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const response = await this.axiosIns.get(
        '/api/contractsSettings',
      );
      return response;
    }
    return { data: { status: false } };
  }
}

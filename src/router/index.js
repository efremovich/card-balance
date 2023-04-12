import Vue from 'vue';

import VueRouter from 'vue-router';
// eslint-disable-next-line import/no-cycle
// import store from '@/store';
// import { mapGetters } from 'vuex';
import 'animate.css';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
// import 'swiper/swiper-bundle.css';
// Routes
import { canNavigate } from '../libs/acl/routeProtection'; // @/libs/acl/routeProtection
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from '../auth/utils';// @/auth/utils
// eslint-disable-next-line import/no-cycle
import pages from './pages';

Vue.use(VueRouter);
// import { useStore } from 'vuex';

// const store = useStore();

const router = new VueRouter({
  mode: 'hash', // history
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    { path: '/', redirect: { name: 'dashboard' } },
    ...pages,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
});

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn();
  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login' });

    // If logged in => not authorized
    return next({ name: 'not-authorized' });
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData();
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null));
  }

  return next();
});
Vue.mixin({
  beforeRouteLeave(to, from, next) {
    // if (from.name === 'card' && this.servicesLength === true) {
    //   next(false);
    //   this.$toast({
    //     component: ToastificationContent,
    //     props: {
    //       title: 'Укажите вид(ы) топлива',
    //       icon: 'AlertTriangleIcon',
    //       variant: 'danger',
    //     },

    //   });
    // }

    // || (from.name === 'profile' && this.comparison === true && this.saveChange !== true))
    if (from.name === 'card' && (this.comparison === false || this.holderComparison === false) && this.saveChange === false) {
      this.$bvModal
        .msgBoxConfirm('Изменения ещё не сохранены. Сохранить?', {
          title: 'Уведомление',
          size: 'sm',
          okVariant: 'primary',
          okTitle: 'Да',
          cancelTitle: 'Нет',
          cancelVariant: 'outline-secondary',
          hideHeaderClose: false,
          centered: true,
        }).then((value) => {
          this.saveChange = value;
          if (this.saveChange === true && this.servicesLength === true) {
            next(false);
            this.$refs.limitsForm.validate();
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Укажите вид(ы) топлива',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },

            });
          } else if (this.saveChange === true && this.servicesLength === false && this.changeValueHolder === false) {
            this.sendRequest();
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Данные сохранены',
                icon: 'EditIcon',
                variant: 'success',
              },
            });
            next(true);
          } else if (this.saveChange === true && this.changeValueHolder === true) {
            this.changeHolder();
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Данные сохранены',
                icon: 'EditIcon',
                variant: 'success',
              },
            });
            next(true);
          } else if (this.saveChange === false) {
            next(true);
          }
          // else next(false);
        });
    } else { // Это позволяет уйти со страницы при повторной попытке выхода
      next(true);
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   if (to.name === 'bill') {
  //     next((vm) => {
  //       if (vm.getWidth === 'xs') {
  //         console.log('xs');
  //         next(false);
  //       } else next(true);
  //     });
  //   }
  // },
});

export default router;

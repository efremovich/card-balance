import Vue from 'vue';
import VueRouter from 'vue-router';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

// Routes
import { canNavigate } from '@/libs/acl/routeProtection';
// import { getModal } from '@/views/CardDetails.vue';
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from '@/auth/utils';
import pages from './pages';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
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
    if (from.name === 'card') {
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
          if (this.saveChange === true) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Данные сохранены',
                icon: 'EditIcon',
                variant: 'success',
              },
            });
          }
          if (this.saveChange !== null) {
            next(true);
          } else next(false);
        });
    } else {
      next(true);
    }
  },
});

export default router;

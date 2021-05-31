import Vue from 'vue';
import VueRouter from 'vue-router';

// Routes
import { canNavigate } from '@/libs/acl/routeProtection';
// import { CardDetails } from '@/views/CardDetails.vue';
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
    // eslint-disable-next-line eqeqeq
    if (from !== 'cards') {
      // this.getModal();
      console.log(from);
      next(true);
    } else {
      this.getModal();
      next(false);
    }
  },
});

export default router;

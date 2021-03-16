<template>
  <layout-full>
    <router-view />
  </layout-full>
</template>

<script>
import LayoutFull from '@core/layouts/layout-card/LayoutCard.vue';

export default {
  components: {
    LayoutFull,
  },
};
</script>

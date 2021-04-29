<template>
  <b-card
    title="Статистика по карте ">
    <p>
      {{ card }}
    </p>
  </b-card>
</template>

<script>
import { BCard } from 'bootstrap-vue';

export default {

  components: {
    BCard,

  },
  props: {
    number: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      card: null,
    };
  },
  beforeMount() {
    console.log(this.number);
    this.card = this.number;
  },

};
</script>

<style></style>

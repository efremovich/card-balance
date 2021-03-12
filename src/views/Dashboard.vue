<template>
  <div>
    <b-col md="6">
      <b-card-actions
        ref="refreshCard"
        title="Информация по договору"
        action-refresh
        @refresh="refreshStop('refreshCard')"
      >
        <b-card-text
          fluid
          class="flex"
        >
          <h3>Баланс: <span> {{ value }} </span></h3>
          <h5>Допустимая задолженность: <span class="text-danger h6"> {{ - value }} </span> </h5>
          <div
            class="d-flex justify-content-between"
          >
            <h3> Договор </h3>
            <v-select
              v-model="selected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :options="option"
              class="w-50"
            />

          </div>
          <h4> Статус: {{ value }} </h4>
          <h4> Дата начала: {{ value }} </h4>
        </b-card-text>

      </b-card-actions>
    </b-col>

  </div>

</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import vSelect from 'vue-select'
import {
  BCardText,
  BCol,
} from 'bootstrap-vue'

export default {
  components: {
    BCardActions,
    BCol,
    BCardText,
    vSelect,

  },

  data() {
    return {
      value: 100,
      option: [1, 2, 3],
    }
  },
  methods: {

    // stop refreshing card in 3 sec
    refreshStop(cardName) {
      setTimeout(() => {
        this.$refs[cardName].showLoading = false
      }, 3000)
    },
  },
}
</script>

<style>
</style>

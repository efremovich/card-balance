<template>
  <div>
    <b-container
      fluid
      class="pb-2">
      <b-row>
        <b-col>
          <b-card title="Добавить карту">
            <div class="d-flex justify-content-center mb-3">
              <feather-icon
                size="60"
                icon="PlusIcon"
                class="text-muted cursor-pointer" />
            </div>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="7824861010047300291">
            <div class="d-flex justify-content-between">
              <div>Баланс:</div>
              <div class="text-success">
                155255 руб.
                <div />
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <h4>Статус:</h4>
              </div>
              <div>
                Активна
                <div />
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <b-button variant="primary">
                <feather-icon icon="LockIcon" /> Заблокировать карту
              </b-button>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {
  BCard,

  BButton,
  BContainer,
  BCol,
  BRow,
} from 'bootstrap-vue';

export default {
  components: {
    BCard,
    BButton,
    BContainer,
    BCol,
    BRow,
  },
  data() {
    return {
      userData: '',
    };
  },
};
</script>

<style>
</style>

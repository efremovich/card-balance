<template>
  <b-overlay
    :show="!download"
    variant="black"
    spinner-type="grow"
    spinner-variant="primary"
    blur="2px"
    opacity=".75"
    rounded="md">
    <div
      v-if="download">
      <b-card>
        <p>Создать счёт по договору №  {{ contract }}</p>
        <v-select
          v-model="selected"
          :clearable="false"
          :options="option"
          class="w-100 mt-1 mb-1" />
        <b-form-input
          v-model="summ"
          autofocus
          placeholder="Введите сумму"
          class="mt-1"
          @input="getVisible" />
        <b-button
          v-if="visible"
          v-print="printObj"
          variant="success"
          class="btn btn-primary mt-1">
          Печать
        </b-button>

        <div
          v-show="visible"
          id="check"
          class="A4 mt-2 flex-column mx-auto"
          style="max-width: 1100px;
        max-height: 1127px;
        background-color: white;">
          <div
            class="grid-container"
            style="border: 2px solid black;
          width: 90%;
          height: 230px;
          margin: 0 auto;
          position: relative;
          top: 50px;">
            <div
              class="bank-pol"
              style="border-right: 2px solid black;
            border-bottom: 2px solid black;">
              <p
                style="text-align: left;
              font-weight: bold;
              padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.name }}
                <br>
                Банк получателя
              </p>
            </div>
            <div
              class="INNKPP"
              style="border-bottom: 2px solid black;">
              <div
                class="KPP"
                style="border-right: 2px solid black;">
                <p
                  style="text-align: left;
                 font-weight: bold;
                  padding-left: 10px;padding-top: 10px;">
                  КПП {{ getInfo.contract.company.kpp }}
                </p>
              </div>
              <div
                class="INN"
                style="border-right: 2px solid black;">
                <p
                  style="text-align: left;
                font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                  ИНН {{ getInfo.contract.company.inn }}
                </p>
              </div>
            </div>
            <div
              class="POL"
              style="border-right: 2px solid black;">
              <p
                style="text-align: left;
              font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                ЮГСМИ ООО р/с 40702810530090003040 в
                40702810530090003040, в ЮЖНЫЙ ФИЛИАЛ АО
                "БАНК ИНТЕЗА"
                Получатель
              </p>
            </div>
            <div class="bikKS">
              <div
                class="KS"
                style="border-bottom: 2px solid black;">
                <p
                  style="text-align: left;
                 font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                  к/с. No
                </p>
              </div>
              <div
                class="BIK"
                style="border-bottom: 2px solid black;">
                <p
                  style="text-align: left;
                font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                  БИК
                </p>
              </div>
            </div>
            <div
              class="NUMBER"
              style="border-bottom: 2px solid black;border-left: 2px solid black;">
              <p
                style="text-align: left;
               font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.bik }}
              </p>
              <p
                style="text-align: left;
               font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.cor_account }}
              </p>
            </div>
            <div
              class="RAS-SCHET">
              <p
                class="1"
                style="text-align: left;
                 font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                р/с. No
              </p>
            </div>
            <div
              class="numberRS"
              style="border-left: 2px solid black;">
              <p
                class="1"
                style="text-align: left;
                 font-weight: bold;
    padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.checking_account }}
              </p>
            </div>
          </div>
          <div
            class="marg"
            style="margin: 80px auto 0;
  width: 90%;">
            <p
              class="pay"
              style="font-size: 20px;
  font-weight: bold;
  padding-left: 10px">
              Счёт на оплату No {{ getRandom }} от {{ isToday() }}
            </p>
            <hr
              class="solid"
              style=" border: 2px solid;">
          </div>

          <div
            class="grid-container3"
            style="width: 90%;
  height: 120px;
  margin: 20px auto 0;">
            <div class="prov">
              <p
                class="l"
                style="text-align: left;
            padding-top: 10px;
            ">
                Поставщик:
              </p>
            </div>
            <div class="buyer">
              <p class="l">
                Покупатель:
              </p>
            </div>
            <div class="rekv">
              <p class="l">
                ИНН 2308151905, КПП 230901001,Общество с ограниченной ответственностью
                ЮГСМИ,350001, Краснодарский край, Краснодар г, Ставропольская ул, дом No
                210/1
              </p>
            </div>
            <div class="rekv2">
              <p class="l">
                ИНН {{ getInfo.contract.company.inn }}, КПП {{ getInfo.contract.company.kpp }}, {{ getInfo.contract.company.full_name }} , {{ getInfo.contract.company.legal_address }}
              </p>
            </div>
          </div>

          <div class="prowider">
            <div
              class="grid-container2"
              style="
          margin: 50px auto 0;
          width: 90%;
  height: 100px;
  margin-top: 20px;
  border: 2px solid black;margin: 0 auto;">
              <div class="qw">
                <p
                  class="i"
                  style="text-align: center;
  vertical-align: baseline;">
                  Товар
                </p>
              </div>
              <div
                class="we"
                style="border-left: 1px solid black;
  border-right: 1px solid black;">
                <p
                  class="i"
                  style="text-align: center;
  vertical-align: baseline;">
                  Цена
                </p>
              </div>
              <div class="ew">
                <p
                  class="i"
                  style="text-align: center;
  vertical-align: baseline;">
                  Сумма
                </p>
              </div>
              <div
                class="rtrt"
                style="border-top: 1px solid black;
            border-rigth: 1px solid black;display: flex;
align-content: ;
align-items: center;">
                <p
                  class="padding"
                  style="
  text-align: center;
    ">
                  {{ selected }}№ {{ contract }}
                </p>
              </div>
              <div
                class="tyty"
                style="border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;">
                <p
                  style="
  text-align: left;
    padding-left: 10px;">
                  {{ getSumm }}
                </p>
              </div>
              <div
                class="jhjh"
                style="border-top: 1px solid black;">
                <p
                  style="
  text-align: left;
    padding-left: 10px;">
                  {{ getSumm }}
                </p>
              </div>
              <div
                class="mnmn"
                style="border-right: 1px solid black;
  border-bottom: 1px solid black;">
                <p
                  class="i"
                  style="text-align: center;
  vertical-align: baseline;">
                  №
                </p>
              </div>
              <div
                class="vcvc"
                style="border-right: 1px solid black;">
                <p
                  style="
  text-align: center;
    padding-left: 10px;">
                  1
                </p>
              </div>
            </div>
          </div>
          <div
            class="summ"
            style="margin: 5px auto 0;
  width: 90%;">
            <p
              class="r"
              style="text-align: right;
  font-weight: bold;">
              Итого: {{ getSumm }}
            </p>
            <p
              class="r"
              style="text-align: right;
  font-weight: bold;">
              В том числе НДС: {{ getNDS }}
            </p>
          </div>
          <div
            class="total"
            style="width: 90%;
  margin: 0 auto;">
            <p
              class="l"
              style="text-align: left;">
              Всего наименований 1 на сумму {{ getSumm }}.
            </p>
          </div>
          <hr
            class="solid"
            style="width:90%;
             border: 2px solid;">
          <div
            class="signature"
            style="display: flex;
  margin: 60px auto 0;
    justify-content: space-around;
    width:90%;

  align-content: flex-start;">
            <div class="row align">
              <div
                class="align-r"
                style="display: flex;

  align-items: baseline;
  margin-top: 5px;">
                <h4

                  style="margin-right: 1rem !important;">
                  Руководитель
                </h4>

                <div
                  class="bb"
                  style="border-bottom: 1px solid black;
  width: 240px;" />
              </div>
              <div class="align-r">
                <h4
                  class="ml-2"
                  style="margin-right: 1rem !important;">
                  Бухгалтер
                </h4>
                <div
                  class="bb bb_ml"
                  style=" border-bottom: 1px solid black;
  width: 240px;margin-left: 38px;" />
              </div>
            </div>
          </div>
          <div class="col mt-2 ml-2">
            <h4>М.П.</h4>
          </div>
        </div>
      </b-card>
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard, BFormInput, BButton, BOverlay,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import print from 'vue-print-nb';
import vSelect from 'vue-select';
import { mapGetters } from 'vuex';
import store from '@/store';

export default {
  components: {
    BCard,
    BFormInput,
    BButton,
    BOverlay,
    vSelect,

  },

  directives: {
    print,
  },
  data() {
    return {
      getInfo: null,
      option: ['Оплата за ГСМ согласно договора поставки ', 'Предоплата за ГСМ  согласно договора поставки ', 'Оплата за информационное обслуживание согласно договора поставки ', 'Оплата за утерянную топливную карту по договору '],
      today: null,
      fullContract: null,
      selected: 'Оплата за ГСМ согласно договора поставки ',
      contractId: null,
      summ: '',
      visible: false,
      download: false,
      printObj: {
        id: 'check',
      },
    };
  },
  computed: {
    getNDS() {
      return ((this.summ * 20) / 100).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      });
    },
    ...mapGetters({
      gotSelected: 'CONTRACT_NUMBER',
      gotSelectedContract: 'CONTRACT_ID',
    }),
    getSumm() {
      return Number(this.summ).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      });
    },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },

    getRandom() {
      return Math.floor(Math.random() * 10000);
    },
    contract: {
      get() {
        return this.fullContract;
      },

      set() {
        // useJwt.changeContract(value)
        //   .then((response) => {
        //     if (response.status) {
        //       this.getInfo = response.data;
        //       console.log(this.getInfo);
        //       this.dateContract = this.getInfo.contract.date.split('').splice(0, 10).join('');
        //       this.fullContract = `${this.getInfo.contract.number} от ${this.dateContract}`;
        //       console.log(this.fullContract);
        //     }
        //   });
        // return this.fullContract;
      },

    },
  },
  watch: {
    gotSelectedContract(val) {
      useJwt.changeContract(val)
        .then((response) => {
          if (response.status) {
            this.getInfo = response.data;
            this.dateContract = this.getInfo.contract.date.split('').splice(0, 10).join('');
            this.fullContract = `${this.getInfo.contract.number} от ${this.dateContract}`;
          }
        });
    },
  },

  beforeMount() {
    // const userData = JSON.parse(localStorage.getItem('userData'));
    // if (userData) {
    //   const a = userData;
    //   this.contractId = a.contract.id;
    // }
    useJwt.changeContract(this.gotSelectedContract)
      .then((response) => {
        if (response.status) {
          this.getInfo = response.data;
          this.download = true;
          this.dateContract = this.getInfo.contract.date.split('').splice(0, 10).join('');
          this.fullContract = `${this.getInfo.contract.number} от ${this.dateContract}`;
        }
      });
  },

  methods: {
    isToday() {
      const today = new Date();
      return today.toLocaleDateString();
    },
    getVisible() {
      if (this.summ.split('').length > 0) {
        this.visible = true;
      } else this.visible = false;
    },
  },
};

</script>

<style lang="scss" scoped>
@import "../../assets/scss/components/bill";
</style>

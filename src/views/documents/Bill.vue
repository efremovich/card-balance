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
        <b-form-input
          v-model="text" />
        <b-form-input
          v-model="summ"
          autofocus
          placeholder="Введите сумму"
          class="mt-1"
          @input="getVisible" />
        <b-button
          v-if="visible"
          v-print="'#check'"
          variant="success"
          class="btn btn-primary mt-1">
          Печать
        </b-button>
        <!-- <b-button

        class="btn btn-primary mt-1 ml-1"
        @click="getVisible()">
        {{ visible ? "Убрать счёт" : "Показать счёт" }}
      </b-button> -->

        <div
          v-show="visible"
          id="check"
          class="A4 mt-2 flex-column mx-auto"
          style="max-width: 1100px;
        max-height: 1127px;
        background-color: white;">
          <div
            class="grid-container"
            style="border: 1px solid black;
          width: 90%;
          height: 300px;
          margin: 0 auto;
          position: relative;
          top: 50px;">
            <div
              class="bank-pol"
              style="border-right: 1px solid black;
            border-bottom: 1px solid black;">
              <p
                style="text-align: left;
              padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.name }}
                <br>
                Банк получателя
              </p>
            </div>
            <div
              class="INNKPP"
              style="border-bottom: 1px solid black;">
              <div
                class="KPP"
                style="border-right: 1px solid black;">
                <p
                  style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                  КПП {{ getInfo.company.kpp }}
                </p>
              </div>
              <div
                class="INN"
                style="border-right: 1px solid black;">
                <p
                  style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                  ИНН {{ getInfo.company.inn }}
                </p>
              </div>
            </div>
            <div
              class="POL"
              style="border-right: 1px solid black;">
              <p
                style="text-align: left;
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
                style="border-bottom: 1px solid black;">
                <p
                  style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                  к/с. No
                </p>
              </div>
              <div
                class="BIK"
                style="border-bottom: 1px solid black;">
                <p
                  style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                  БИК
                </p>
              </div>
            </div>
            <div
              class="NUMBER"
              style="border-bottom: 1px solid black;border-left: 1px solid black;">
              <p
                style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.bik }}
              </p>
              <p
                style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                {{ getInfo.contract.pay_account.cor_account }}
              </p>
            </div>
            <div
              class="RAS-SCHET">
              <p
                style="text-align: left;
    padding-left: 10px;padding-top: 10px;">
                р/с. No
              </p>
            </div>
            <div
              class="numberRS"
              style="border-left: 1px solid black;">
              <p
                style="text-align: left;
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
                ИНН {{ getInfo.company.inn }}, КПП {{ getInfo.company.kpp }}, {{ getInfo.company.full_name }} , {{ getInfo.company.legal_address }}
              </p>
            </div>
          </div>

          <div class="prowider">
            <div
              class="grid-container2"
              style="
          margin: 50px auto 0;
          width: 90%;
  height: 120px;
  margin-top: 50px;
  border: 1px solid black;margin: 0 auto;">
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
            border-rigth: 1px solid black;">
                <p
                  class="padding"
                  style="
  text-align: left;
    padding-left: 10px;">
                  {{ text }}№ {{ contract }}
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
          <div
            class="signature"
            style="display: flex;
  margin: 60px auto 0;
  width: 94%;
  align-content: flex-start;">
            <div class="col">
              <div
                class="align-r"
                style="display: flex;
  align-items: baseline;
  margin-top: 5px;">
                <h4
                  class="mr-1"
                  style="margin-right: 1rem !important;">
                  Руководитель
                </h4>

                <div
                  class="bb"
                  style="border-bottom: 1px solid black;
  width: 250px;" />
              </div>
              <div class="align-r">
                <h4
                  class="mr-1"
                  style="margin-right: 1rem !important;">
                  Бухгалтер
                </h4>
                <div
                  class="bb bb_ml"
                  style=" border-bottom: 1px solid black;
  width: 250px;margin-left: 38px;" />
              </div>
            </div>
            <div class="col">
              <h4>М.П.</h4>
            </div>
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

export default {
  components: {
    BCard,
    BFormInput,
    BButton,
    BOverlay,

  },

  directives: {
    print,
  },

  data() {
    return {
      getInfo: null,
      today: null,
      contract: null,
      summ: '',
      visible: false,
      download: false,
      text: 'Оплата согласно договора ',

    };
  },

  computed: {
    getNDS() {
      return ((this.summ * 20) / 100).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      });
    },
    getSumm() {
      return Number(this.summ).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      });
    },

    getRandom() {
      return Math.floor(Math.random() * 10000);
    },
  },

  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.getInfo = response.data;
          this.download = true;
          const dateContract = this.getInfo.contract.date.split('').splice(0, 10).join('');
          this.contract = `${this.getInfo.contract.number} от ${dateContract}`;
        });
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
.A4 {
  max-width: 797px;
  max-height: 1127px;
  background-color: white;
}

.signature {
  display: flex;
  margin: 60px auto 0;
  width: 94%;
  align-content: flex-start;
  padding-bottom: 3%;
}

.align-r {
  display: flex;
  align-items: baseline;
  margin-top: 5px;
}

p {
  text-align: left;
  padding-top: 10px;
  padding-left: 10px;
  font-size: 1rem;
}

.bb {
  border-bottom: 1px solid black;
  width: 250px;
}

.bb_ml {
  margin-left: 38px;
}

.r {
  text-align: right;
  font-weight: bold;
}

.summ {
  margin: 5px auto 0;
  width: 90%;
}

.total {
  width: 90%;
  margin: 0 auto;
}
.grid-container3 {
  display: grid;
  width: 90%;
  height: 120px;
  margin: 20px auto 0;
  grid-template-columns: 1fr 4.5fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "prov rekv"
    "buyer rekv2";
}

.l {
  text-align: left;
}

.padding {
  padding-top: 5px !important;
  padding-bottom: 2px !important;
}

.prov {
  grid-area: prov;
}

.buyer {
  grid-area: buyer;
}

.rekv {
  grid-area: rekv;
}

.rekv2 {
  grid-area: rekv2;
}

.pay {
  font-size: 20px;
  font-weight: bold;
}
.marg {
  margin: 80px auto 0;
  width: 90%;
}
.i {
  text-align: center;
  vertical-align: baseline;
}
.grid-container2 {
  margin: 50px auto 0;
  display: grid;
  grid-template-columns: 1fr 6fr 3fr 3fr;
  grid-template-rows: 0.3fr 5fr;
  gap: 0px 0px;
  grid-template-areas:
    "mnmn qw we ew"
    "vcvc rtrt tyty jhjh";
  width: 90%;
  height: 120px;
  border: 1px solid black;
}
.qw {
  grid-area: qw;
}
.we {
  border-left: 1px solid black;
  border-right: 1px solid black;
}
.ew {
  grid-area: ew;
}
.rtrt {
  grid-area: rtrt;
  border-top: 1px solid black;
}
.tyty {
  grid-area: tyty;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
}
.jhjh {
  grid-area: jhjh;
  border-top: 1px solid black;
}
.mnmn {
  grid-area: mnmn;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}
.vcvc {
  grid-area: vcvc;
  border-right: 1px solid black;
}

.grid-container {
  display: grid;
  grid-template-columns: 4.5fr 1fr 3fr;
  grid-template-rows: 2fr 0.7fr 3.5fr;
  gap: 0px 0px;
  grid-template-areas:
    "bank-pol bikKS NUMBER"
    "INNKPP RAS-SCHET numberRS"
    "POL RAS-SCHET numberRS";
  border: 1px solid black;
  width: 90%;
  height: 300px;
  margin: 0 auto;
  position: relative;
  top: 50px;
}

.bank-pol {
  grid-area: bank-pol;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}

.INNKPP {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: "INN KPP";
  grid-area: INNKPP;
  border-bottom: 1px solid black;
}

.KPP {
  grid-area: KPP;
  border-right: 1px solid black;
}

.INN {
  grid-area: INN;
  border-right: 1px solid black;
}

.POL {
  grid-area: POL;
  border-right: 1px solid black;
}

.bikKS {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "BIK"
    "KS";
  grid-area: bikKS;
}

.KS {
  grid-area: KS;
  border-bottom: 1px solid black;
}

.BIK {
  grid-area: BIK;
  border-bottom: 1px solid black;
}

.NUMBER {
  grid-area: NUMBER;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
}

.RAS-SCHET {
  grid-area: RAS-SCHET;
}

.numberRS {
  grid-area: numberRS;
  border-left: 1px solid black;
}

.solid {
  border: 2px solid;
}
</style>

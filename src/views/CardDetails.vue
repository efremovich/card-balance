<template>
  <b-overlay
    :show="!showLoading"
    variant="black"
    spinner-type="grow"
    spinner-variant="primary"
    blur="2px"
    opacity=".75"
    rounded="md">
    <div
      v-if="download">
      <!-- <div
        v-if="limitsLength>0"> -->
      <b-card
        :class="[getWidth === 'xs'?'max-w': '']">
        <b-card-header
          class="d-flex justify-content-start align-items-baseline">
          <b-link :to="{ name: 'cards' }">
            <feather-icon
              class="mr-1"
              icon="ArrowLeftCircleIcon"
              size="30" />
          </b-link>
          <h3 class="w-75">
            Настройка карты № {{ number }}
          </h3>
        </b-card-header>
        <div class="d-flex flex-wrap justify-content-between">
          <div :class="['image', {'max-h330':getWidth ==='xs'}]">
            <b-img
              :class="['card-img-top', getWidth === 'xs'? 'min-w270':'']"
              :src="
                require(`../assets/images/cards-icon/${cardData.data.emitent.code}.svg`)
              " />
            <b-badge
              v-if="getStatusRequests(cardData.data.request_edit_status)"
              :class="['badge-glow position-absolute',{'xs-margin':getWidth === 'xs'},{'md-margin':getWidth === 'md'},{'sm-margin':getWidth === 'sm'}, {'lg-margin':getWidth === 'lg'},{'xl-margin':getWidth === 'xl'}]"
              pill
              variant="warning">
              <feather-icon
                icon="ClockIcon"
                class="mr-25" />
              <span>
                В обработке
              </span>
            </b-badge>

            <div :class="[getWidth === 'xs' ? 'b-xs':'item-wrapper']">
              <h6 class="item-price">
                PIN: {{ cardData.data.pin }}
              </h6>
              <h5 class="item-price">
                {{ cardData.data.number }}
              </h5>
            </div>
            <div class="holder">
              <h6 class="ml-1">
                Держатель:
              </h6>
              <b-form-input
                v-model="cardHolder"
                @change="changeHolder" />
            </div>
          </div>
          <div v-if="getWidth !== 'xs'">
            <app-echart-doughnut
              v-if="totalRows>0"
              class="bottom-1"
              :series="series" />
          </div>
          <div
            :class="[{'d-flex':getWidth !== 'xs'}, {'flex-column':getWidth !== 'xs'}, 'align-items-start', 'justify-content-start', {'heigth':getWidth !== 'xs'}, {'ml-1':getWidth !== 'xs'},{'mx-auto':getWidth === 'xs'}]">
            <b-button
              v-if="cardData.data.card_status_id==='ACTIVE'"
              variant="danger"
              :disabled="getDisabledActive"
              :class="['btn' ,{'mb-2':getWidth !== 'xs'}]"
              @click="getLockCard">
              Заблокировать карту
              <feather-icon
                icon="LockIcon"
                class="mr-50" />
            </b-button>
            <b-button
              v-if="cardData.data.card_status_id !=='ACTIVE'"
              variant="success"
              :disabled="getDisabledBlock"
              :class="['btn' ,{'mb-2':getWidth !== 'xs'}]"
              @click="getUnlockCard(product)">
              Разблокировать карту
              <feather-icon
                icon="LockIcon"
                class="mr-50" />
            </b-button>
            <!-- <div class="mb-2">
              <h6 v-if="getWidth !== 'xs'">
                Выдана: {{ cardData.data.expiry_date | formatOnlyDate }}
              </h6>
            </div> -->
            <!-- указать дату выдачи карты не в лимитах, а выше, иначе при удалении всех лимитов
                  невозможно создать новый лимит -->
            <!-- <div class="mb-2">
              <h6 v-if="getWidth !== 'xs'">
                Действует до: {{ cardData.data.expiry_date | formatDateNoTime }}
              </h6>
            </div> -->
            <div class="mb-2">
              <h6 :class="{'text-center mt-1': getWidth === 'xs'}">
                Последняя активность:<br>
                {{ cardData.data.emitent.last_updated | formatDate }}
              </h6>
            </div>
          </div>
        </div>
        <div
          v-if="totalRows>0 "
          class="ml-2 mb-2 mt-2">
          <h5>Всего за период с {{ firstDayOfMonth }} по {{ lastDay }} по карте  №<code>{{ number }}</code> потреблено топлива <code>{{ allConsumptionSumm.toLocaleString() }}</code> л. на сумму <code>{{ summAllTransactions.toLocaleString() }}</code> руб., из них:</h5>
          <template
            v-for="(item,index) in dataCharts">
            <li
              v-if="getWidth !=='xs'"
              :key="index">
              <code>{{ item.name }}</code> : {{ item.consumption.toFixed(2) }} л. на  <span v-if="gotStatus !== 'true'">{{ item.value.toLocaleString() }} руб.; </span>
            </li>

            <h5
              v-else
              :key="index">
              {{ item.name }} :  <span v-if="gotStatus !== 'true'">{{ item.value.toLocaleString() }} руб. / </span> {{ item.consumption.toFixed(2) }} л. ;
            </h5>
          </template>
        </div>
        <b-tabs
          content-class="pt-1 position-relative"
          fill>
          <b-tab
            active
            title="Лимиты">
            <b-button
              v-if="!getRequestStatus"
              class="mr-1 mb-1"
              variant="success"
              @click="addLimit">
              Добавить лимит
            </b-button>
            <h5
              v-if="getRequestStatus"
              class="mt-1 mb-1 text-center text-danger">
              Возможность редактирования данных станет доступна после обработки ранее направленной заявки.
            </h5>
            <div
              class="d-flex flex-nowrap column ">
              <b-col
                md="7"
                class="p-0">
                <validation-observer
                  ref="limitsForm">
                  <b-form
                    @submit.prevent="newLimitsData">
                    <!-- Нужен template для отрисовки карты без заданнных при открытии карты лимитов, отрисовывать
                      шаблон лимита (newLimit), но не пустоту -->
                    <template v-if="limitsLength<1 || limitsLength ==null">
                      <template
                        v-for="(item,index) in count">
                        <b-card-actions
                          :key="item.limit_id"
                          no-body
                          action-close
                          class="border pl-1 pr-1"
                          @close="del(index)">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Виды топлива"
                            rules="required">
                            <b-form-group
                              label="Виды топлива:"
                              label-for="labelServices">
                              <!-- Добавление нового лимита при отсутствии первого невозможно
                              в виду limit.limit_services - null,   v-if="limit.limit_services !== null" -->
                              <v-select
                                id="labelServices"
                                v-model="count[index].limit_services"
                                :filter="fuseSearch"
                                :multiple="canGroupServeces"
                                label="full_name"
                                :reduce="(services) => `${services.id}`"
                                :options="services"
                                :selectable="(option) => !getSelectedServices.flat(1).includes(option.id)" />
                              <!-- Нужно отследить выбранные значения и фильтровать по ним services и затем передовать их options. Передавать computed свойство. -->
                              <small
                                class="text-danger">{{ errors[0] }}</small>
                            </b-form-group>
                          </validation-provider>
                          <div :class="['d-flex', 'flex-wrap', 'mt-1', getWidth === 'xs'?'align-items-center': '', ]">
                            <div :class="[getWidth === 'xs'?'d-flex flex-nowrap align-items-center':'d-flex mb-1 align-items-center',{'w-100': getWidth === 'md'} ]">
                              <h6 class="mr-1">
                                Лимит
                              </h6>
                              <div class="mr-1 mw-25">
                                <b-form-input
                                  v-model.number="count[index].value" />
                              </div>
                              <b-col
                                class="mw-75">
                                <v-select
                                  v-model="count[index].limit_unit_code"
                                  :class="[ {'mw-50':getWidth === 'xl'}]"
                                  :clearable="false"
                                  :reduce="(unit) => unit.code"
                                  :options="units" />
                              </b-col>
                            </div>
                            <b-col :class="['flex-grow-1', {'ml-1': getWidth === 'sm'}]">
                              <v-select
                                v-model="count[index].limit_period_code"
                                :class="[{'mt-1 mb-1':getWidth === 'xs'}, {'ml-1':getWidth === 'xl'},{'ml-1':getWidth === 'lg'}]"
                                :clearable="false"
                                :reduce="(period) => period.code"
                                :options="periods" />
                            </b-col>
                          </div>
                        </b-card-actions>
                      </template>
                    </template>

                    <!-- Добавить ещё один template для добавления 1-го лимита  -->
                    <template
                      v-for="(limit,index) in cardData.data.limits"
                      v-else>
                      <b-card-actions
                        :key="limit.limit_id"
                        no-body
                        action-close
                        :class="['border', 'pl-1', 'pr-1', {'pointer-events-none':getRequestStatus}]"
                        @close="hide(index)">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Виды топлива"
                          rules="required">
                          <b-form-group
                            label="Виды топлива:"
                            label-for="labelServices">
                            <!-- Добавление нового лимита при отсутствии первого невозможно
                              в виду limit.limit_services - null,   v-if="limit.limit_services !== null" -->
                            <v-select
                              id="labelServices"
                              v-model="limit.limit_services"
                              :filter="fuseSearch"
                              :multiple="canGroupServeces"
                              label="full_name"
                              :reduce="(services) => `${services.id}`"
                              :options="services"
                              :selectable="(option) => !getSelectedServices.flat(1).includes(option.id)" />
                            <!-- Нужно отследить выбранные значения и фильтровать по ним services и затем передовать их options. Передавать computed свойство. -->
                            <small
                              class="text-danger">{{ errors[0] }}</small>
                          </b-form-group>
                        </validation-provider>
                        <div :class="['d-flex', 'flex-wrap', 'mt-1', getWidth === 'xs'?'align-items-center': '', ]">
                          <div :class="[getWidth === 'xs'?'d-flex flex-nowrap align-items-center':'d-flex mb-1 align-items-center',{'w-100': getWidth === 'md'} ]">
                            <h6 class="mr-1">
                              Лимит
                            </h6>
                            <div class="mr-1 mw-25">
                              <b-form-input
                                v-model.number="limit.value" />
                            </div>
                            <b-col
                              class="mw-75">
                              <v-select
                                v-model="limit.limit_unit_code"
                                :class="[ {'mw-50':getWidth === 'xl'}]"
                                :clearable="false"
                                :reduce="(unit) => unit.code"
                                :options="units" />
                            </b-col>
                          </div>
                          <b-col :class="['flex-grow-1', {'ml-1': getWidth === 'sm'}]">
                            <v-select
                              v-model="limit.limit_period_code"
                              :class="[{'mt-1 mb-1':getWidth === 'xs'}, {'ml-1':getWidth === 'xl'},{'ml-1':getWidth === 'lg'}]"
                              :clearable="false"
                              :reduce="(period) => period.code"
                              :options="periods" />
                          </b-col>
                        </div>
                        <div class="mt-1">
                          <label>Остаток: {{ (limit.value - limit.consumption).toFixed(2) }}  {{ unicodeLabel[limit.limit_unit_code] }} </label>
                          <b-progress
                            :value="limit.value - limit.consumption"
                            :max="limit.value" />
                        </div>
                      </b-card-actions>
                    </template>
                  </b-form>
                </validation-observer>
              </b-col>
              <b-col
                md="5"
                class="border">
                <b-overlay
                  :show="!showLoading"
                  variant="black"
                  spinner-variant="primary"
                  blur="0"
                  opacity=".75"
                  rounded="sm">
                  <b-card-actions
                    ref="limits"
                    action-refresh
                    show
                    :class="[{'pl-1':getWidth !=='xs'}]"
                    @refresh="refreshLimits('limits')">
                    <h4>Текущие лимиты по карте:</h4>
                    <hr>
                    <div
                      v-if="canGroupServeces">
                      <template
                        v-for="(limit) in cardData.data.limits">
                        <div :key="limit.ID">
                          <h4>
                            Вид топлива:
                            {{ selectedService(limit.limit_services) }}
                          </h4>
                          <!-- Передать limit.limit_label -->
                          <h4>Лимит:  {{ periodLabel[limit.limit_period_code] }}.</h4>
                          <h4>
                            Остаток: {{ (limit.value - limit.consumption).toFixed(2) }} {{ unicodeLabel[limit.limit_unit_code] }}.
                          </h4>
                          <hr>
                        </div>
                      </template>
                    </div>
                    <div
                      v-else>
                      <template
                        v-for="(limit) in cardData.data.limits">
                        <div :key="limit.ID">
                          <h4>
                            Вид топлива:
                            {{ labelService[limit.limit_services] }}
                          </h4>

                          <h4>Лимит:  {{ periodLabel[limit.limit_period_code] }}.</h4>
                          <h4>
                            Остаток: {{ (limit.value - limit.consumption).toFixed(2) }} {{ unicodeLabel[limit.limit_unit_code] }}.
                          </h4>
                          <hr>
                        </div>
                      </template>
                    </div>
                  </b-card-actions>
                </b-overlay>
              </b-col>
            </div>
            <div
              class="d-flex justify-content-around w-90 position-sticky bottom">
              <b-button
                v-if="!getRequestStatus"
                variant="success"
                type="submit"
                @click="newLimitsData">
                Сохранить
              </b-button>
              <!-- При сохранении формы следует перенаправлять пользователя в cards -->
              <b-button
                v-if="!getRequestStatus"
                class="mr-1"
                variant="primary"
                @click="undoChange">
                Отмена
              </b-button>
            </div>
          </b-tab>
          <b-tab title="Транзакции">
            <h4
              v-if="totalRows<1"
              class="text-center">
              Транзакции по карте № {{ cardData.data.number }} за период c
              {{ firstDayOfMonth }} по {{ lastDay }} отсутствуют
            </h4>
            <div v-if="totalRows>0">
              <h6 class="text-center mb-1 mt-1">
                Транзакции по карте №{{ number }} за период c
                <code>{{ firstDayOfMonth }}</code>по <code>{{ lastDay }}</code>:
              </h6>
              <div v-if="getWidth!=='xs'">
                <b-table
                  striped
                  hover
                  responsive
                  class="position-relative"
                  :per-page="perPage"
                  :current-page="currentPage"
                  :items="transactions.data.result"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :fields="fields"
                  :filter="filter">
                  <template #cell(date)="row">
                    {{ row.item.date | formatDate }}
                  </template>
                </b-table>
              </div>
              <div v-else>
                <b-table
                  striped
                  hover
                  responsive
                  class="position-relative"
                  :per-page="perPage"
                  :current-page="currentPage"
                  :items="transactions.data.result"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :fields="fieldsSM"
                  :filter="filter">
                  <template #cell(date)="row">
                    {{ row.item.date | formatDate }}
                  </template>
                  <template #cell(summ)="row">
                    <b-col @click="row.toggleDetails">
                      <span :class="row.item.summ < 0 ? 'text-danger' : 'text-success'">{{ parseInt(row.item.summ).toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}</span><br>

                      <b-button
                        class="mt-1"
                        pill
                        size="sm"
                        @click="row.detailsShowing">
                        Детали
                      </b-button>
                    </b-col>
                  </template>

                  <template #row-details="row">
                    <b-card
                      @click="row.toggleDetails">
                      <b-row class="mb-2">
                        <b-col
                          md="4"
                          class="mb-1">
                          <strong>Дата/время : </strong>{{ row.item.date | formatDate }}
                        </b-col>
                        <b-col
                          md="4"
                          class="mb-1">
                          <strong>Количество : </strong>{{ row.item.quantity }}
                        </b-col>
                        <b-col
                          md="4"
                          class="mb-1">
                          <strong>Услуга : </strong>{{ row.item.service.full_name }}
                        </b-col>
                        <b-col
                          md="4"
                          class="mb-1">
                          <strong>Адрес операции: </strong>{{ row.item.pos.address }}
                        </b-col>
                      </b-row>

                      <!-- <b-button
                        size="sm"
                        variant="outline-secondary"
                        @click="row.toggleDetails">
                        Скрыть детали
                      </b-button> -->
                    </b-card>
                  </template>

                  <template #cell(period)="row">
                    <b-col @click="row.toggleDetails">
                      {{ row.item.date | formatDate }}
                    </b-col>
                  </template>
                </b-table>
              </div>

              <b-card-body class="d-flex justify-content-between flex-wrap pt-0">
                <!-- page length -->
                <b-form-group
                  label="На странице"
                  label-cols="7"
                  label-align="left"
                  label-size="sm"
                  label-for="sortBySelect"
                  class="text-nowrap mb-md-0 mr-2 pr-2">
                  <b-form-select
                    id="perPageSelect"
                    v-model="perPage"
                    size="sm"
                    inline
                    :options="pageOptions" />
                </b-form-group>

                <!-- pagination -->
                <div>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    first-number
                    last-number
                    prev-class="prev-item"
                    next-class="next-item"
                    class="mb-0">
                    <template #prev-text>
                      <feather-icon
                        icon="ChevronLeftIcon"
                        size="18" />
                    </template>
                    <template #next-text>
                      <feather-icon
                        icon="ChevronRightIcon"
                        size="18" />
                    </template>
                  </b-pagination>
                </div>
              </b-card-body>
            </div>
          </b-tab>
          <b-tab title="События">
            <h4
              v-if="totalRequestRows < 1"
              class="text-center">
              События по карте № {{ cardData.data.number }} за период c
              {{ firstDayOfMonth }} по {{ lastDay }} отсутствуют
            </h4>
            <!-- <h4
              v-else
              class="text-center">
              События по карте № {{ cardData.data.number }} за период c
              {{ firstDayOfMonth }} по {{ lastDay }} есть!!!!
            </h4> -->
            <b-table
              v-else
              hover
              :items="requests.result"
              responsive
              :filter="filter"
              :per-page="perPage"
              :current-page="currentPage"
              class="position-relative table-hover text-center"
              :fields="fieldsRequests">
              <template
                #cell(UpdatedAt)="row">
                <b-col>
                  {{ row.item.UpdatedAt | formatDate }}
                </b-col>
              </template>
              <template
                #cell(request_status_code)="row">
                <b-col>
                  <p>
                    {{ requsestsStatus[row.item.request_status_code] }}
                  </p>
                </b-col>
              </template>
              <template
                #cell(request_type_code)="row">
                <b-col>
                  <p>
                    {{ requsestsTypes[row.item.request_type_code] }}
                  </p>
                </b-col>
              </template>
            </b-table>
          </b-tab>
          <b-tab title="Сообщить о проблеме">
            <validation-observer
              ref="simpleRules">
              <b-form
                method="POST"
                enctype="multipart/form-data"
                @submit.prevent="sendMessage">
                <b-row class="justify-content-center">
                  <b-col :cols="[getWidth === 'xs'?'12': '8']">
                    <label
                      for="card"
                      class="w-100">Номер карты:
                      <validation-provider
                        v-slot="{ errors }"
                        rules="integer|min:10"
                        name="номер карты">
                        <b-form-input
                          id="card"
                          v-model="number" />
                        <small
                          class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </label>
                    <br>
                    <label
                      for="org"
                      class="w-100 mt-2 mb-2">Клиент:
                      <validation-provider
                        v-slot="{ errors }"
                        name="клиент"
                        rules="required|min:5">
                        <b-form-input
                          id="org"
                          v-model="nameOrg" />
                        <small
                          class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </label>
                    <br>
                    <label for="error">Выберите причину обращения:</label>
                    <v-select
                      id="error"
                      v-model="selectedError"
                      :clearable="false"
                      :options="optionError"
                      class="w-100 mb-1" />

                    <label
                      for="textarea-default"
                      class="mr-2">Или изложите его здесь:</label>
                    <b-form-textarea
                      id="textarea-default"
                      ref="message"
                      v-model="text"
                      :state="text.length >= 10"
                      placeholder="Проблема состоит в следующем..."
                      rows="2" />

                    <!-- submit and reset -->
                    <b-col
                      class="mt-2"
                      offset-md="4">
                      <b-button
                        type="submit"
                        variant="primary"
                        class="mr-1">
                        Отправить
                      </b-button>
                      <b-button
                        type="reset"
                        variant="outline-secondary">
                        Сброс
                      </b-button>
                    </b-col>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <div
      v-else>
      <!-- <div
          v-if="limitsLength<1"> -->
      <b-card>
        <b-card-header
          class="d-flex justify-content-start">
          <b-link :to="{ name: 'cards' }">
            <feather-icon
              class="mr-1"
              icon="ArrowLeftCircleIcon"
              size="30" />
          </b-link>
          <h3>
            Настройка карты № {{ number }}
          </h3>
        </b-card-header>
        <div class="d-flex flex-wrap justify-content-between">
          <div :class="['image', {'max-h330':getWidth ==='xs'}]">
            <b-img
              class="card-img-top"
              :src="
                require(`../assets/images/cards-icon/${cardEmitentCode}.svg`)
              " />
            <div class="item-wrapper">
              <h6 class="item-price">
                PIN: {{ cardData.data.pin }}
              </h6>
              <h5 class="item-price">
                {{ cardData.data.number }}
              </h5>
            </div>
            <div class="holder">
              <p>{{ cardData.data.limits }}</p>
              <h6 class="ml-1">
                Держатель:
              </h6>
              <b-form-input
                v-model.trim="cardHolder" />
            </div>
          </div>

          <div
            class="d-flex flex-column align-items-start justify-content-start heigth ml-1">
            <b-button
              v-if="cardData.data.card_status_id==='ACTIVE'"
              variant="danger"
              class="btn mb-2"
              @click="getLockCard">
              Заблокировать карту
              <feather-icon
                icon="LockIcon"
                class="mr-50" />
            </b-button>
            <b-button
              v-if="cardData.data.card_status_id !=='ACTIVE'"
              variant="success"
              class="btn mb-2"
              :disable="cardData.data.card_status_id ==='FINANCE'"
              @click="getUnlockCard">
              {{ cardData.data.card_status_id }}
              <feather-icon
                icon="unlock"
                class="mr-50" />
            </b-button>
            <div class="mb-2">
              <h6>
                Выдана: {{ cardData.data.limits.CreatedAt | formatDate }}
              </h6>
            </div>
            <div class="mb-2">
              <h6>
                Действует до: {{ cardData.data.limits.CreatedAt | formatDate }}
              </h6>
            </div>
            <div class="mb-2">
              <h6>
                Последняя активность в этом месяце:<br>
                {{ cardData.data.emitent.last_updated | formatDate }}
              </h6>
            </div>
          </div>
        </div>
        <b-tabs
          content-class="pt-1 position-relative"
          fill>
          <b-tab
            active
            title="Лимиты">
            <b-button
              v-if="!getRequestStatus"
              class="mr-1 mb-1"
              variant="success"
              :disabled="servicesLength"
              @click="addLimit">
              Добавить лимит
            </b-button>
            <div class="d-flex justify-content-around w-90 position-sticky bottom">
              <b-button
                variant="success"
                type="submit"
                @click="newLimitsData">
                Сохранить
              </b-button>
              <b-button
                class="mr-1"
                variant="primary"
                @click="undoChange">
                Отмена
              </b-button>
            </div>
          </b-tab>
          <b-tab title="Транзакции">
            <h4
              v-if="totalRows < 1"
              class="text-center">
              Транзакции по карте № {{ cardData.data.number }} за период c
              {{ firstDayOfMonth }} по {{ lastDay }} отсутствуют
            </h4>
            <div v-if="totalRows > 0">
              <b-card>
                <div class="d-flex justify-content-between flex-wrap">
                  <!-- filter -->
                </div>
              </b-card>
              <h6 class="text-center mb-1 mt-1">
                Транзакции по карте №{{ number }} за период c
                <code>{{ firstDayOfMonth }}</code>по <code>{{ lastDay }}</code>:
              </h6>
              <b-table
                striped
                hover
                responsive
                class="position-relative"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :items="transactions.data.result"
                :fields="fields"
                :filter="filter">
                <template #cell(date)="row">
                  {{ row.item.date | formatDate }}
                </template>
              </b-table>

              <b-card-body class="d-flex justify-content-between flex-wrap pt-0">
                <!-- page length -->
                <b-form-group
                  label="На странице"
                  label-cols="6"
                  label-align="left"
                  label-size="sm"
                  label-for="sortBySelect"
                  class="text-nowrap mb-md-0 mr-2 pr-2">
                  <b-form-select
                    id="perPageSelect"
                    v-model="perPage"
                    size="sm"
                    inline
                    :options="pageOptions" />
                </b-form-group>

                <!-- pagination -->
                <div>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    first-number
                    last-number
                    prev-class="prev-item"
                    next-class="next-item"
                    class="mb-0">
                    <template #prev-text>
                      <feather-icon
                        icon="ChevronLeftIcon"
                        size="18" />
                    </template>
                    <template #next-text>
                      <feather-icon
                        icon="ChevronRightIcon"
                        size="18" />
                    </template>
                  </b-pagination>
                </div>
              </b-card-body>
            </div>
          </b-tab>
          <b-tab title="События">
            <h4
              v-if="totalRequestRows < 1"
              class="text-center">
              События по карте № {{ cardData.data.number }} за период c
              {{ firstDayOfMonth }} по {{ lastDay }} отсутствуют
            </h4>
            <h4
              v-else
              class="text-center">
              События по карте № {{ cardData.data.number }} за период c
              {{ firstDayOfMonth }} по {{ lastDay }} есть!
            </h4>
            <!-- <b-table
              v-else
              hover
              :items="requests.result"
              responsive
              :filter="filter"
              :per-page="perPage"
              :current-page="currentPage"
              class="position-relative table-hover text-center"
              :fields="fieldsRequests">
              <template
                #cell(UpdatedAt)="row">
                <b-col>
                  {{ row.item.UpdatedAt | formatDate }}
                </b-col>
              </template>
              <template
                #cell(request_status_code)="row">
                <b-col>
                  <p>
                    {{ requsestsStatus[row.item.request_status_code] }}
                  </p>
                </b-col>
              </template>
              <template
                #cell(request_type_code)="row">
                <b-col>
                  <p>
                    {{ requsestsTypes[row.item.request_type_code] }}
                  </p>
                </b-col>
              </template>
            </b-table> -->
          </b-tab>
          <b-tab title="Сообщить о проблеме" />
        </b-tabs>
      </b-card>
      <!-- </div> -->
      <!-- </div> -->
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard,
  BRow,
  BImg,
  BTabs,
  BProgress,
  BOverlay,
  BCol,
  BTab,
  BFormInput,
  BButton,
  BTable,
  BPagination,
  BCardBody,
  BForm,
  BFormGroup,
  BFormSelect,
  // BInputGroup,
  BLink,
  BBadge,
  BCardHeader,
  BFormTextarea,
  // VBTooltip,
  // BInputGroupAppend,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import vSelect from 'vue-select';
import { required } from '@validations';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import { ref, computed } from '@vue/composition-api';
import Fuse from 'fuse.js';
import AppEchartDoughnut from '@core/components/charts/echart/AppEchartDoughnut.vue';
import { mapGetters } from 'vuex';
// eslint-disable-next-line import/extensions, import/no-cycle
import store from '@/store';
// eslint-disable-next-line import/extensions
import useJwt from '@/auth/jwt/useJwt';
import { useRouter } from '../@core/utils/utils';

export default {
  // directives: {
  //   'b-tooltip': VBTooltip,
  // },
  components: {
    ValidationProvider,
    ValidationObserver,
    AppEchartDoughnut,
    BCard,
    BImg,
    BForm,
    BTabs,
    BTab,
    BButton,
    BCardBody,
    BCol,
    BLink,
    vSelect,
    BOverlay,
    BFormTextarea,
    BRow,
    BCardActions,
    BFormGroup,
    BFormInput,
    BTable,
    BFormSelect,
    BPagination,
    // BInputGroup,
    BProgress,
    // BInputGroupAppend,
    BCardHeader,
    BBadge,
  },
  setup() {
    const cardData = ref({});
    const canGroupServeces = ref(null);
    const dataCharts = ref([]);
    const summAllTransactions = ref(null);
    const allConsumptionSumm = ref(null);
    // const unfulfilledRequest = ref(null); // неисполненная заявка
    const product = ref(null);
    const value = ref(null);
    const totalRows = ref(null);
    const transactions = ref({});
    const option = ref([]);
    const loadDone = ref(false);
    const lastDay = ref(null);
    const firstDayOfMonth = ref(null);
    const labelService = ref({});
    const perPage = 5;
    // const optionService = ref(null);
    const pageOptions = [3, 5, 10];
    const currentPage = 1;
    const filter = ref(null);
    const units = ref([]);
    const periods = ref([]);
    const services = ref([]);
    const showLoading = ref(true);
    const download = ref(false);
    const quantity = ref(null);
    const start = ref(null);
    const end = ref(null);
    const selectUnits = ref(null);
    const source = ref({});
    const limitsLength = ref(null);
    const cardEmitentCode = ref('0');
    const selected = ref(null);
    const totalRequestRows = ref(null);
    const number = ref(null);
    const requests = ref(null);
    const allLabelService = ref(null);
    const cardHolder = ref(null);
    const cardHolderSource = ref(null);
    const fields = [
      {
        key: 'date',
        label: 'Дата',
        sortable: true,
      },
      {
        key: 'service.full_name',
        label: 'Товар/услуга',
        sortable: true,
      },

      {
        key: 'quantity',
        label: 'Количество',
        sortable: true,
      },
      {
        key: 'summ',
        label: 'Сумма',
        sortable: true,
      },
    ];
    const consumptionData = ref([]);

    const series = [
      {
        name: 'Потребление топлива',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
        },
        labelLine: {
          show: true,
        },
        data: [
        ],
      },
    ];

    const unicodeLabel = {
      L: 'литров',
      RU: 'рублей',
    };
    const periodLabel = {
      DAY: 'Суточный',
      WEEK: 'Недельный',
      MONTH: 'Месячный',
      QUARTER: 'Квартальный',
      HALFYEAR: 'Полугодовой',
      YEAR: 'Годовой',
    };
    const columns = {
      'Товар/услуга': {
        field: 'service.full_name',
      },
      'Дата': {
        field: 'cardData',
      },
      'Сумма': {
        field: 'summ',
      },
      'Держатель': {
        field: 'holder',
      },
      'Номер договора': {
        field: 'contract.number',
      },
      'Номер карты': {
        field: 'card_number',
      },
      'Тип операции': {
        field: 'operation_type',
      },
      'Адрес операции': {
        field: 'pos.address',
      },
    };
    const fieldsRequests = [
      {
        key: 'UpdatedAt',
        label: 'Дата заявки',
        sortable: true,
      },
      {
        key: 'request_status_code',
        label: 'Статус заявки',
        sortable: true,
      },
      {
        key: 'request_type_code',
        label: 'Тип заявки',
        sortable: true,
      },
      {
        key: 'card_number',
        label: 'Номер карты',
        sortable: true,
      },
    ];
    const isToday = () => {
      const today = new Date();
      return today.toLocaleDateString();
    };
    const getFirstDay = () => {
      const newDate = new Date();
      const firstDay = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        1,
      ).toLocaleDateString();
      return firstDay;
    };

    const getService = (params) => {
      useJwt.getServiceFromEmitent(`emitent_code=${params}`).then((response) => {
        if (response.data.status) {
          services.value = response.data.data;
          const id = services.value.map((el) => el.id);
          const idService = Array.from(id);
          const label = Array.from(services.value.map((el) => el.label));
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < idService.length; i++) {
            labelService.value[idService[i]] = label[i];
          }
          // console.log('LABEL', labelService.value['c9562951-8641-11e7-9453-7054d2199b65']);
          allLabelService.value = Object.entries(labelService.value); // приведение к массиву
        }
      });
    };

    const transactionsSumm = ref(null);
    // const consumptionData = ref([]);
    const gotSelectedContract = computed(() => store.state.contractId);
    const contractID = ref(null);
    const contract = ref(null);
    const getAllTransactions = () => {
      firstDayOfMonth.value = getFirstDay();
      lastDay.value = isToday();
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && gotSelectedContract.value === null) {
        contract.value = userData;
        contractID.value = contract.value.contract.id;
      } else contractID.value = gotSelectedContract.value;
      start.value = `${getFirstDay()} 00:00:00`;
      end.value = `${isToday()} 23:59:59`;
      loadDone.value = true;
      useJwt
        .getTransactions(
          `contract_id=${contractID.value}&startDate=${start.value}&endDate=${end.value}&card_number=${number.value}`,
        )
        .then((response) => {
          if (response.data.status) {
            transactions.value = response.data;
            totalRows.value = transactions.value.data.total;

            const allLabels = [];
            allLabels.push(transactions.value.data.result.map((el) => el.service).map((el) => el.full_name));
            allConsumptionSumm.value = transactions.value.data.result.map((el) => el.quantity).reduce((el, acc) => el + acc, 0);
            summAllTransactions.value = transactions.value.data.result.map((el) => el.summ).reduce((el, acc) => el + acc, 0);
            const arr = allLabels[0];
            const uniqueLabel = new Set(arr); // size != length
            const arrLabel = Array.from(uniqueLabel);
            const data = {};
            const statData = {};
            dataCharts.value = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < arrLabel.length; i++) {
              let summ = 0;
              let consumption = 0;

              series[0].data = [];
              transactions.value.data.result.forEach((el) => { // необходимо создавать объект на каждое используемое значение вида топлива
                if (el.service.full_name === arrLabel[i]) {
                  summ += (el.summ);
                  consumption += el.quantity;
                  const name = arrLabel[i];
                  const valueFuel = summ;
                  statData[name] = consumption;
                  data[name] = valueFuel;
                }
              });
            }

            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < Object.keys(data).length; i++) {
              const label = Object.keys(data);
              const values = Object.values(data);
              const consumptionL = Object.values(statData);
              const randomObject = {};
              randomObject.value = values[i];
              randomObject.name = label[i];
              randomObject.consumption = consumptionL[i];
              series[0].data.push(randomObject);
              dataCharts.value.push(randomObject);
            }
          }
          loadDone.value = false;
        });
    };

    const getRequests = () => {
      useJwt.GetRequests(`contract_id=${contractID.value}&startDate=${start.value}&endDate=${end.value}&card_number=${number.value}`).then((response) => {
        if (response.data.status) {
          requests.value = response.data.data;
          totalRequestRows.value = requests.value.result.length;
        }
      });
    };

    const getAllPeriods = () => {
      useJwt.getAllPeriods().then((response) => {
        if (response.data.status) {
          periods.value = response.data.data;
          selected.value = periods.value[2].label;
        }
      });
    };
    const getAllUnits = () => {
      useJwt.getAllUnits().then((response) => {
        if (response.data.status) {
          units.value = response.data.data;

          selectUnits.value = units.value[0].label;
        }
      });
    };
    const cardDate = (params) => useJwt.getCardData(params).then((response) => {
      if (response.data.status) {
        cardData.value = response.data;
        cardEmitentCode.value = cardData.value.data.emitent.code;
        canGroupServeces.value = cardData.value.data.emitent.can_group_serveces;
        limitsLength.value = cardData.value.data.limits.length;
        source.value = JSON.parse(JSON.stringify(cardData.value.data.limits));
        cardHolderSource.value = JSON.parse(JSON.stringify(cardData.value.data.holder));
        cardHolder.value = cardData.value.data.holder;
        // для изменения имени держателя
        getService(cardEmitentCode.value);
      }
    });

    const fetchProduct = () => {
      const { route } = useRouter();
      cardDate(route.value.params.card_number);
      number.value = route.value.params.card_number;
      download.value = true;
      showLoading.value = true;
    };
    fetchProduct();
    getAllTransactions();
    getAllPeriods();
    getAllUnits();
    getRequests();

    return {
      consumptionData,
      canGroupServeces,
      allLabelService,
      allConsumptionSumm,
      summAllTransactions,
      dataCharts,
      contractID,
      lastDay,
      series,
      selectUnits,
      transactionsSumm,
      firstDayOfMonth,
      fieldsRequests,
      selected,
      product,
      cardEmitentCode,
      // optionService,
      limitsLength,
      unicodeLabel,
      showLoading,
      requests,
      // unfulfilledRequest,
      totalRequestRows,
      source,
      download,
      cardData,
      value,
      transactions,
      totalRows,
      columns,
      labelService,
      fields,
      end,
      start,
      perPage,
      pageOptions,
      currentPage,
      filter,
      getFirstDay,
      option,
      quantity,
      units,
      periods,
      services,
      periodLabel,
      number,
      cardHolder,
      cardHolderSource,
    };
  },
  data() {
    return {
      newLimit: {},
      sortBy: 'date',
      sortDesc: false,
      sortDirection: 'asc',
      required,
      operReport: null,
      blockCard: false,
      saveChange: false,
      comparison: true,
      holderComparison: true,
      changeValueHolder: false,
      newServices: [],
      newLimits: [{
        limit_period_code: 'MONTH',
        value: 0,
        limit_unit_code: 'L',
        limit_services: [],
        limit_commons: [],
        consumption: 0,
        userData: null,
        fullMessage: null,
        limit_id: this.getRandom(),
      }],
      fieldsSM: [
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
        },
        {
          key: 'summ',
          label: 'Сумма',
          sortable: true,
        },
      ],
      requsestsStatus: {
        CREATED: 'Создана',
        PROGRESSING: 'В обработке',
        DONE: 'Исполнена',
        CANCELED: 'Отменена',
        PROCCESSING: 'В обработке',
      },
      requsestsTypes: {
        ADD: 'Выдача топливных карт',
        EDIT: 'Смена лимита',
        LOCK: 'Блокировка карты',
        UNLOCK: 'Разблокировка карты',
        RENAME: 'Смена держателя',
      },

      // Telegram
      token: '5136675120:AAEKRZ1r_X1TGOct4vWGWhkBMB3Z1JyeXLI',
      chatID: '280997089',

      nameOrg: '',
      text: '',
      count: [],
      selectedError: 'Карта заблокирована',
      optionError: ['Карта заблокирована', 'Не могу заправиться определенным видом топлива', 'Не могу сменить лимит', 'Неверный баланс в личном кабинете', 'Другая причина'],

    };
  },

  computed: {
    servicesLength() {
      return this.cardData.data.limits.map((el) => el.limit_services).some((el) => el === null || el.length === 0);
    },
    getSelectedServices() {
      return this.cardData.data.limits.map((el) => el.limit_services);
    },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
    getRequestStatus() {
      return this.getStatusRequests(this.cardData.data.request_edit_status);
    },
    getDisabledActive() {
      // if ((this.cardData.data.request_block_status !== 'false') && (this.cardData.data.request_block_status !== 'null')) {
      //   return false;
      // } return true;
      return this.getStatusRequests(this.cardData.data.request_block_status);
    },
    getDisabledBlock() {
      if ((this.cardData.data.card_status_id === 'FINANCE') || (this.cardData.data.request_block_status === 'true')) {
        return true;
      }
      return false;
    },
    ...mapGetters({
      gotStatus: 'STATUS_ORG',
      changeContract: 'COMPANY',
    }),
  },
  watch: {
    'cardData.data.limits': {
      deep: true,
      handler(val) {
        if (JSON.stringify(val) === JSON.stringify(this.source)) {
          this.comparison = true;
        } else {
          this.comparison = false;
          this.newLimits = val;
        }
      },
    },
    // Holder(val) {
    //   if (JSON.stringify(val) !== JSON.stringify(this.cardHolderSource)) {
    //     this.Holder = val;
    //   }
    // },
    changeContract(old, val) {
      if (old !== val) {
        this.$router.push({ name: 'cards' });
      }
    },

    saveChange() {
      if ((this.saveChange === true) && (this.changeValueHolder === false)) {
        this.sendRequest();
      }
    },
    selectedError(val) {
      if (val === 'Другая причина') {
        this.$refs.message.focus();
      }
    },
  },
  beforeMount() {
    // useJwt.getCurrenUser().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getUserData', response.data).then(() => {
    //       this.userData = response.data;
    //       // this.name = this.userData.company.name;
    //     });
    //   }
    // });
  },
  methods: {
    showToast() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Уведомление',
          icon: 'BellIcon',
          text: '🙄 Данные обновить не удалось. Попробуйте позже, а мы пока починим 👨‍🔧',
        },
      });
    },

    getStatusRequests(item) {
      if (item) {
        return true;
      } return false;
    },

    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['full_name'],
        shouldSort: true,
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    },
    refreshLimits(card) {
      useJwt.getCardData(this.cardData.data.number).then((response) => {
        if (response.data.status) {
          this.cardData = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },
    changeHolder() {
      if (JSON.stringify(this.cardHolder) !== JSON.stringify(this.cardHolderSource)) {
        this.comparison = false;
        this.changeValueHolder = true;
        if (this.saveChange) {
          // const holder = this.cardHolder.trim(); // убираю кавычки и лишние пробелы у держателя
          const request = [{
            card_number: this.cardData.data.number,
            request_type_code: 'RENAME',
            request_status_code: 'CREATED',
            contract_id: this.cardData.data.contract_id,
            holder: JSON.stringify(`${this.cardHolder.trim()}`),
          }];
          useJwt.refreshDataUserLimits(request);
        }
      }
    },
    sendRequest() {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.newLimits.length; i++) {
        this.newLimits[i].limit_services = [this.newLimits[i].limit_services].flat();
        if (typeof (this.newLimits[i].limit_services) === 'string') {
          this.newLimits[i].limit_services = [this.newLimits[i].limit_services];
        }
      }
      const request = [{
        card_number: this.cardData.data.number,
        request_type_code: 'EDIT',
        request_status_code: 'CREATED',
        contract_id: this.cardData.data.contract_id,
        limits: this.newLimits,
      }];
      // console.log('res', request);
      useJwt.refreshDataUserLimits(request);
    },
    newLimitsData() {
      if (this.changeValueHolder === false) {
        this.$refs.limitsForm.validate().then((success) => {
          if (success) {
            this.saveChange = true;
            this.sendRequest();
            this.$router.push({ name: 'cards' });
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Данные сохранены',
                icon: 'EditIcon',
                variant: 'success',
              },
            });
          } else {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Укажите вид(ы) топлива',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },
            });
          }
        });
      } else {
        this.saveChange = true;
        this.changeHolder();
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Данные сохранены',
            icon: 'EditIcon',
            variant: 'success',
          },
        });
      }
    },
    sendMessage() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          // this.saveChange = true;
          // this.sendRequest();
          // this.$router.push({ name: 'cards' });
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Обращение направлено',
              icon: 'EditIcon',
              variant: 'success',
            },
          });
          const fullMessage = `Клиент:${this.nameOrg} (карта номер:${this.number}) жалуется на то,что ${this.selectedError}./n Считает, что ${this.text}.`;
          this.$http.post(`https://api.telegram.org/bot5136675120:AAEKRZ1r_X1TGOct4vWGWhkBMB3Z1JyeXLI/sendMessage?chat_id=280997089&text=${fullMessage}`)
            .then((response) => {
              this.fullMessage = response;
              this.$router.push({ name: 'cards' });
            });
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Укажите обязательные данные',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          });
        }
      });
    },
    undoChange() {
      useJwt.getCardData(this.cardData.data.number).then((response) => {
        if (response.data.status) {
          this.cardData = response.data;
        }
      });
    },
    getRandom() {
      return Math.floor(Math.random() * 10000);
    },
    // Передать в качестве значений объекта значения из v-model карточки
    addLimit() {
      this.newLimit = {
        limit_period_code: 'MONTH',
        value: 0,
        limit_unit_code: 'L',
        limit_services: [],
        limit_commons: [],
        consumption: 0,
        limit_id: this.getRandom(),
      };
      this.count.unshift(this.newLimit);
      if (this.cardData.data.limits.length === 0) { // При отсутствии первоначального лимита
        this.cardData.data.limits.push(this.newLimit);
        // this.newServices = null;
      } else { this.cardData.data.limits.unshift(this.newLimit); }
    },
    hide(index) {
      this.cardData.data.limits.splice(index, 1);
    },
    del(index) {
      this.count.splice(index, 1);
      // if (this.cardData.data.limits.length)
      this.cardData.data.limits.splice(index, 1);
    },

    selectedService(arrService) { // параметр функции у нас объект,
      if (arrService === null || arrService === undefined) {
        return '';
      }
      let label = '';
      // eslint-disable-next-line no-return-assign
      Object.values(arrService).forEach((el) => (label += `${this.labelService[el]}, `));
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < Object.values(arrService).length; i++) { // Здесь творится магия
        // eslint-disable-next-line no-unused-expressions
        this.allLabelService;
      }

      return label.split('').slice(0, -2).join('');
    },
    // Смена статуса карты
    getLockCard() {
      this.$bvModal
        .msgBoxConfirm(`Вы уверены что хотите заблокировать карту № ${this.cardData.data.number}?`, {
          cancelVariant: 'outline-secondary',
          okVariant: 'primary',
          okTitle: 'Да',
          cancelTitle: 'Нет',
          centered: true,
        })
        .then((value) => {
          if (value === true && this.cardData.data.card_status_id === 'ACTIVE') {
            const status = [{
              'card_number': this.cardData.data.number,
              'request_type_code': 'LOCK',
              'request_status_code': 'CREATED',
              'contract_id': this.contractID,
            }];
            useJwt.refreshDataUserLimits(status).then((response) => {
              if (response.data.status) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Направлена заявка на блокировку',
                    icon: 'LockIcon',
                    variant: 'success',
                  },
                });
                this.cardData.data.request_block_status = !this.cardData.data.request_block_status; // блокирование кнопки при смене статуса
              } else {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: '🙄 Ошибка. Попробуйте позже, а мы пока починим 👨‍🔧',
                    icon: 'AlertTriangleIcon',
                    variant: 'warning',
                  },
                });
              }
            });
          }
        });
    },
    getUnlockCard() {
      this.$bvModal
        .msgBoxConfirm(`Вы уверены что хотите разблокировать карту № ${this.cardData.data.number}?`, {
          cancelVariant: 'outline-secondary',
          okVariant: 'success',
          okTitle: 'Да',
          cancelTitle: 'Нет',
          centered: true,
        })
        .then((value) => {
          if (value === true && this.cardData.data.card_status_id === 'BLOCK') {
            const status = [{
              'card_number': this.cardData.data.number,
              'request_type_code': 'UNLOCK',
              'request_status_code': 'CREATED',
              'contract_id': this.contractID,
            }];
            useJwt.refreshDataUserLimits(status).then((response) => {
              if (response.data.status) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Направлена заявка на разблокировку',
                    icon: 'LockIcon',
                    variant: 'success',
                  },
                });
                this.cardData.data.request_block_status = !this.cardData.data.request_block_status;
              } else {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: '🙄 Ошибка. Попробуйте позже, а мы пока починим 👨‍🔧',
                    icon: 'AlertTriangleIcon',
                    variant: 'warning',
                  },
                });
              }
            });
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>

<style lang="scss" scoped>
@import "../assets/scss/components/cardDetails";
</style>

<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
    <div class="modal transaction-prog-modal" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box in-process-box">
          <div class="box-body">
            <div class="container-fluid">
              <nav class="row tabs nav bottom-border no-border-radius d-flex col-md-12 px-0">
                <a
                  class="nav-item col ps-y-24 px-0 text-center nav-link font-body-medium"
                  :class="{'active font-medium': activeTab === tab.id}"
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="changeTab(tab.id)"
                >{{tab.title}}</a>
              </nav>
              <div class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border">
                <div
                  class="col-md-12 px-0 font-heading-small font-semibold ps-b-8"
                >{{tabs[activeTab].subtitle}}</div>
                <div
                  class="col-md-12 px-0 ps-b-16 font-body-small text-gray-500"
                >{{tabs[activeTab].description}}</div>

                <div class="col-md-12 p-0">
                  <input-token :placeholder="'0.00'" :integer="true" :change="changeAmount" />
                </div>

                <div
                  class="col-md-12 font-body-small ps-t-12 text-gray-300"
                >0% commission of Matic Marketplace, you’ll get 0.00 Matic</div>
              </div>

              <div
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border d-flex"
                v-if="activeTab === 0"
              >
                <div class="d-flex align-self-center">
                  <div class="align-self-center font-heading-small font-semibold">Allow Negotiation?</div>
                  <svg-sprite-icon name="questionmark-black" class="icon ms-l-4" />
                </div>
                <div class="d-flex ml-auto align-self-center">
                  <label class="switch align-self-center">
                    <input type="checkbox" v-model="negotiation" />
                    <span class="slider round"></span>
                  </label>
                </div>
                <transition name="fade">
                  <div class="col-md-12 p-0" v-if="negotiation">
                    <div class="w-100 font-body-small ps-y-12 text-gray-500">Set minimum price</div>
                    <div class="w-100 p-0">
                      <input-token
                        :placeholder="'0.00'"
                        :integer="true"
                        :change="changeAmount"
                        :disableToken="true"
                      />
                    </div>
                  </div>
                </transition>
              </div>
              <div
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border d-flex"
                v-if="activeTab === 1"
              >
                <div class="d-flex align-self-center">
                  <div
                    class="align-self-center font-heading-small font-semibold"
                  >Set Expiration Date</div>
                  <svg-sprite-icon name="questionmark-black" class="icon ms-l-4" />
                </div>
                <div class="d-flex ml-auto align-self-center">
                  <span
                    class="time-pill font-body-small"
                    :class="{'active': duration === 0}"
                    @click="duration=0"
                  >1 week</span>
                  <span
                    class="time-pill font-body-small"
                    :class="{'active': duration === 1}"
                    @click="duration=1"
                  >1 month</span>
                  <span
                    class="time-pill font-body-small"
                    :class="{'active': duration === 2}"
                    @click="duration=2"
                  >custom</span>
                </div>
                <div class="col-md-12 ps-x-0 ps-t-24">
                  <input class="form-control form-control-inline float-left w-50" type="date" />
                  <input class="form-control form-control-inline float-right w-25" type="time" />
                </div>
              </div>
              <div class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 d-flex">
                <button-loader :text="$t('cancel')" :click="close" block lg color="light"></button-loader>
                <button-loader
                  class="ml-auto"
                  :loading="isLoading"
                  :loadingText="$t('submittingToMarketplace')"
                  :text="$t('submitToMarketplace')"
                  block
                  lg
                  color="primary"
                  :click="submitToMarketplace"
                ></button-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import moment from "moment";

import InputToken from "~/components/lego/input-token";

@Component({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  components: { InputToken },
  methods: {},
  mixins: []
})
export default class SellToken extends Vue {
  activeTab = 0;
  duration = 0;
  negotiation = false;
  isLoading = false;

  tabs = [
    {
      id: 0,
      title: "Fixed Price",
      subtitle: "Set price",
      description:
        "Your asset will be sell at this price. It will be available for sale in marketplace until you cancel it.",
      commission: "0% commission of Matic Marketplace, you’ll get 0.00 Matic",
      btnTitle: "Submit to Marketplace"
    },
    {
      id: 1,
      title: "Sell in Auction",
      subtitle: "Set minimum bid",
      description:
        "Your asset will be sell at this price. It will be available for sale in marketplace until you cancel it.",
      commission: "0% commission of Matic Marketplace, you’ll get 0.00 Matic",
      btnTitle: "Submit to Marketplace"
    }
  ];
  mounted() {}

  changeTab(num) {
    this.activeTab = num;
  }
  tokenImage(token) {
    return require("~/static/tokens/" + token.toUpperCase() + ".svg");
  }

  changeAmount(value) {
    console.log("Amount: ", value);
  }

  // action
  submitToMarketplace() {}
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.text-gray-500 {
  color: dark-color("500");
}
.text-gray-300 {
  color: dark-color("300");
}
.time-pill {
  background-color: light-color("500");
  color: dark-color("700");
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  border-radius: 20px;
  cursor: pointer;

  &.active {
    background-color: dark-color("700");
    color: light-color("700");
  }
}

.icon {
  width: 24px !important;
  height: 24px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.box {
  max-width: 570px;
  width: 570px;
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;
  }
}

@media (max-width: 570px) {
  .box {
    max-width: 100%;
  }
}
</style>
<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ 'show': show }" @click="close()"></div>
    <div class="modal transaction-prog-modal" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box in-process-box">
          <div class="box-body">
            <div class="container-fluid">
              <div class="row ps-y-32">
                <div class="feature-info d-flex flex-column ps-x-16 ps-x-sm-32 ps-x-lg-40">
                  <h3 class="font-heading-medium font-semibold">About {{order.token.name}}</h3>
                  <p
                    class="font-body-medium"
                    :class="{'show-less': showMore, 'show-more': !showMore}"
                    v-if="order.token.description"
                  >
                    {{order.token.description}}
                    <span class="dots">...</span>
                    <span class="more">{{order.token.description}}</span>
                    <a
                      class="font-body-small d-inline-flex ps-t-8 font-medium"
                      href="#more-info"
                      v-if="!showMore"
                      @click.prevent="showMore = true"
                    >More info</a>
                    <a
                      class="font-body-small d-inline-flex ps-t-8 font-medium"
                      href="#more-info"
                      v-if="showMore"
                      @click.prevent="showMore = false"
                    >Show less</a>
                  </p>
                  <div
                    class="mt-auto w-100 d-flex flex-column fixed-price"
                    v-if="order.type === orderTypes.FIXED"
                  >
                    <div class="font-body-small text-gray-300 mt-auto ps-y-4">Listed for</div>
                    <div
                      class="font-heading-large font-semibold ps-b-20"
                      v-if="erc20Token"
                    >{{order.price}} {{erc20Token.symbol}}</div>
                    <button class="btn btn-primary ps-y-20">Buy Now</button>
                  </div>
                  <div
                    class="mt-auto w-100 d-flex flex-column fixed-price-negotiation"
                    v-if="order.type === orderTypes.NEGOTIATION"
                  >
                    <div class="d-flex justify-content-between">
                      <div class="font-body-small text-gray-300 ps-y-4">Listed for</div>
                      <div class="font-body-small text-gray-300 ml-auto ps-y-4">Last offer</div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <div
                        class="font-heading-large font-semibold ps-b-20"
                        v-if="erc20Token"
                      >{{order.price}} {{erc20Token.symbol}}</div>
                      <div
                        class="font-heading-large font-semibold ps-b-20 ml-auto"
                        v-if="erc20Token"
                      >{{order.minprice}} {{erc20Token.symbol}}</div>
                    </div>
                    <div class="d-flex">
                      <div class="w-50 ps-r-12">
                        <button class="btn btn-primary btn-block ps-y-20">Buy Now</button>
                      </div>
                      <div class="w-50 ps-l-12">
                        <button class="btn btn-light btn-block ps-y-20">Make an offer</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="mt-auto w-100 d-flex flex-column auction ps-x-16 ps-x-sm-32 ps-x-lg-40 ps-y-40"
                  v-if="order.type === orderTypes.AUCTION"
                >
                  <div class="d-flex justify-content-between">
                    <div class="font-body-small text-gray-300 ps-y-4">Minimum bid</div>
                    <div class="font-body-small text-gray-300 ml-auto ps-y-4">Highest bid</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div
                      class="font-heading-large font-semibold ps-b-20"
                      v-if="erc20Token"
                    >{{order.price}} {{erc20Token.symbol}}</div>
                    <div
                      class="font-heading-large font-semibold ps-b-20 ml-auto"
                      v-if="erc20Token"
                    >{{order.minprice}} {{erc20Token.symbol}}</div>
                  </div>
                  <div class="d-flex time-wrapper ps-8 justify-content-between">
                    <div class="d-flex flex-column text-center align-self-center ps-x-8">
                      <div class="font-heading-small font-semibold">10</div>
                      <div class="font-caption">Days</div>
                    </div>
                    <div class="d-flex flex-column text-center align-self-center ps-x-8">
                      <div class="font-heading-small font-semibold">7</div>
                      <div class="font-caption">Hrs</div>
                    </div>
                    <div class="d-flex flex-column text-center align-self-center ps-x-8">
                      <div class="font-heading-small font-semibold">23</div>
                      <div class="font-caption">Mins</div>
                    </div>
                    <div class="d-flex flex-column text-center align-self-center ps-x-8">
                      <div class="font-heading-small font-semibold">32</div>
                      <div class="font-caption">Secs</div>
                    </div>

                    <div class="d-flex">
                      <button class="btn btn-light btn-block ps-x-24 ps-x-sm-40">Bid Now</button>
                    </div>
                  </div>
                  <div
                    class="font-body-small text-gray-500 ps-t-20 text-center"
                  >The highest bidder will automatically win in 7 days.</div>
                </div>
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
import { mapGetters } from "vuex";

import app from "~/plugins/app";

import moment from "moment";

import InputToken from "~/components/lego/input-token";

@Component({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    order: {
      type: Object,
      require: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  components: { InputToken },
  computed: {
    ...mapGetters("token", ["erc20Tokens"])
  },
  methods: {},
  mixins: []
})
export default class BuyToken extends Vue {
  activeTab = 0;
  duration = 0;
  negotiation = false;
  isLoading = false;
  showMore = false;

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

  // handler
  tokenImage(token) {
    return require("~/static/tokens/" + token.toUpperCase() + ".svg");
  }

  // get
  get erc20Token() {
    return this.erc20Tokens.filter(
      token => token.id === this.order.erc20tokens_id
    )[0];
  }

  get orderTypes() {
    return app.orderTypes;
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

.show-more {
  .dots {
    display: inline;
  }
  .more {
    display: none;
  }
}
.show-less {
  .dots {
    display: none;
  }
  .more {
    display: inline;
  }
}

.auction {
  background-color: light-color("600");
  margin-bottom: -32px;
  border-bottom-left-radius: $default-card-box-border-radius;
  border-bottom-right-radius: $default-card-box-border-radius;
}

.time-wrapper {
  background-color: primary-color("600");
  color: light-color("700");
  border-radius: $default-card-box-border-radius;

  .font-caption {
    opacity: 0.6;
    padding-top: 4px;
  }
}

.box {
  max-width: 446px;
  width: 446px;
  &,
  .box-body,
  .container-fluid,
  .row {
    min-height: 500px;
  }
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;
  }
}

@media (max-width: 446px) {
  .box {
    max-width: 100%;
  }
}
</style>
<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ show: show }"></div>
    <div class="modal add-token-modal-wrapper" v-bind:class="{ show: show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box accept-box">
          <div
            class="box-body"
            v-bind:style="{
              background:
                'linear-gradient( 180deg,' +
                bg +
                ' 0%, rgba(236, 235, 223, 0) 45%)',
            }"
          >
            <div class="close-wrapper" @click="close()">
              <svg-sprite-icon name="close-modal" class="close" />
            </div>
            <div class="container-fluid text-center">
              <div class="row" v-if="defaultSelectedToken">
                <div class="col-md-12 ps-y-32">
                  <img
                    class="asset-img mx-auto"
                    :src="order.token.img_url"
                    alt="order.token.name"
                    @load="onImageLoad"
                  />
                </div>
                <div class="col-md-12 ps-x-40">
                  <div class="font-heading-large title font-semibold">
                    {{ purchaseType.title }}
                  </div>
                  <div
                    class="font-body-medium text-gray-500 ps-t-4"
                    v-if="order"
                  >
                    {{ purchaseType.subtitle }} {{ order.price }}
                    {{ defaultSelectedToken.symbol }}
                  </div>
                  <div
                    class="font-body-medium text-gray-500 ps-t-4"
                    v-if="order && order.highest_bid"
                  >
                    {{ purchaseType.lastOffer }} {{ order.highest_bid }}
                    {{ defaultSelectedToken.symbol }}
                  </div>
                  <div
                    class="font-body-medium text-gray-500 ps-t-4"
                    v-else-if="order"
                  >
                    {{ purchaseType.minPrice }} {{ order.min_price }}
                    {{ defaultSelectedToken.symbol }}
                  </div>
                  <!-- <div
                    class="font-body-medium text-gray-500 ps-t-4"
                    v-if="order"
                  >{{purchaseType.subtitle}} {{order.getPrice().toString(10)}} {{defaultSelectedToken.symbol}}</div>-->
                </div>
                <div class="col-md-12 ps-t-32 ps-x-40">
                  <input-token
                    :placeholder="'0.00'"
                    :integer="true"
                    :change="changeAmount"
                    :disableToken="true"
                  />
                </div>

                <div class="col-md-12 ps-t-4 ps-x-40">
                  <div class="error font-caption text-left">
                    {{ validationMessage }}
                  </div>
                  <!-- <div class="ps-t-16" v-if="noEnoughBalance">
                    <NuxtLink
                      class="text-center font-semibold text-primary-600"
                      :to="{ name: 'account' }"
                      >Add funds to your account here</NuxtLink
                    >
                  </div> -->
                </div>

                <div
                  class="col-md-12 ps-x-40 ps-y-8 ps-b-20 font-caption text-gray-300"
                >
                  Account balance: {{
                    defaultSelectedToken.formattedFullUSDBalance
                  }}
                  = {{ defaultSelectedToken.formattedBalance }}
                  {{ defaultSelectedToken.symbol }}
                </div>

                <div class="col-md-12 ps-t-8 ps-x-40">
                  <button-loader
                    class
                    :loading="isLoading || inProcess"
                    :loadingText="purchaseType.loadingText"
                    :text="purchaseType.btn"
                    :disabled="submitOfferButtonDisabled"
                    block
                    primary
                    lg
                    color="primary"
                    :click="makeOfferOrBid"
                  ></button-loader>
                  <div
                    class="font-body-large font-semibold text-primary text-center cursor-pointer ps-t-12"
                    @click="executeDeposit"
                  >
                    Add Funds
                  </div>
                </div>

                <div
                  class="col-md-12 ps-x-40 ps-t-12 ps-b-40 font-body-small text-gray-500"
                >
                  {{ purchaseType.note }}
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

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

import { FormValidator } from "~/components/mixin";
import InputToken from "~/components/lego/input-token";
import BigNumber from "~/plugins/bignumber";

const ZERO = new BigNumber(0);
const TEN = new BigNumber(10);

@Component({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
    bid: {
      type: Boolean,
      required: false,
      default: false,
    },
    inProcess: {
      type: Boolean,
      required: false,
      default: false,
    },
    executeBidOrOffer: {
      type: Function,
      required: true,
    },
    executeDeposit: {
      type: Function,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  components: { InputToken },
  computed: {
    ...mapGetters("token", ["erc20Tokens", "selectedERC20Token"]),
    ...mapGetters("network", ["networks"]),
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
  },
  mixins: [FormValidator],
})
export default class PlaceBid extends Vue {
  bg = "#f3f4f7";
  inputAmount = "";
  isLoading = false;
  validationMessage = '';
  noEnoughBalance = false;
  submitOfferButtonDisabled = true;

  mounted() {}

  onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      let rgbColor = colorThief.getColor(img);
      if (rgbColor) {
        let hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2],
        });
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
      } else this.bg = "#f3f4f7";
    } catch (error) {}
  }

  changeAmount(value) {
    this.inputAmount = value;

    if (this.validatePrice()) {
      this.submitOfferButtonDisabled = true;
      return;
    }else{
      this.submitOfferButtonDisabled = false;
      return;
    }
  }

  async makeOfferOrBid() {
    this.isLoading = true;

    if (this.validatePrice()) {
      this.isLoading = false;
      return;
    }

    await this.executeBidOrOffer(this.inputAmount);

    this.isLoading = false;
  }

  validatePrice() {
    this.noEnoughBalance = false;

    if (!this.inputAmount){
      return this.validationMessage = ' ';
    }
    else if (!this.inputAmount || !this.inputAmount.gt(ZERO)) {
      return this.validationMessage = "Enter a valid amount";
    }
    else if (!this.defaultSelectedToken.fullBalance.gte(this.inputAmount || ZERO)) {
      this.noEnoughBalance = true;
      return this.validationMessage = "You don't have sufficient balance";
    }
    else if (!this.inputAmount.gte(this.order.getMinPriceInBN())) {
      return this.validationMessage = `Minimum ${this.order.min_price} ${this.defaultSelectedToken.symbol} required`;
    }
    else if (!this.inputAmount.lte(this.order.getPriceInBN())) {
      return this.validationMessage = `Maximum ${this.order.price} ${this.defaultSelectedToken.symbol} allowed`;
    }
    else {
      return this.validationMessage = '';
    }
  }

  // getters
  get purchaseType() {
    if (this.bid) {
      return {
        title: "Enter your bid",
        subtitle: "Starting from",
        note:
          "By bidding, you will automatically pay for this item if you're the highest bidder when the auction expires.",
        btn: "Place Bid",
        loadingText: "Placing bid",
      };
    }
    return {
      title: "Make an offer",
      subtitle: "Listed for",
      lastOffer: "Last Offer",
      minPrice: "Min Price",
      note:
        "By offering, you will automatically pay for this item if the owner accepts your offer, unless you cancel it.",
      btn: "Submit offer",
      loadingText: "Submitting offer",
    };
  }

  get defaultSelectedToken() {
    if (this.selectedERC20Token) {
      return this.selectedERC20Token;
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.asset-img {
  max-width: 112px;
  max-height: 112px;
}
.text-gray-500 {
  color: dark-color("500");
}
.text-gray-300 {
  color: dark-color("300");
}
.text-primary-600 {
  color: primary-color("600");
}
.error {
  color: red-color("400");
}

.box {
  max-width: 446px;
  width: 100%;
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;
    .close-wrapper {
      top: 20px;
      right: 20px;
      z-index: 1;
      position: absolute;
      cursor: pointer;
      .close {
        width: 38px !important;
        height: 38px !important;
      }
    }
  }
}
@media (max-width: 446px) {
  .box {
    max-width: 100%;
  }
}
</style>

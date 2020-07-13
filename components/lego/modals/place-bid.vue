<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
    <div class="modal add-token-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box accept-box">
          <div
            class="box-body"
            v-bind:style="{background: 'linear-gradient( 180deg,'+bg+' 0%, rgba(236, 235, 223, 0) 45%)'}"
          >
            <div class="close-wrapper" @click="close()">
              <svg-sprite-icon name="close-modal" class="close" />
            </div>
            <div class="container-fluid text-center">
              <div class="row" v-if="defaultSelectedToken">
                <div class="col-md-12 ps-y-32">
                  <img
                    class="asset-img mx-auto"
                    src="~/static/img/dummy-kitty.png"
                    alt="kitty"
                    @load="onImageLoad"
                  />
                </div>
                <div class="col-md-12 ps-x-40">
                  <div class="font-heading-large title font-semibold">{{pruchaseType.title}}</div>
                  <div
                    class="font-body-medium text-gray-500 ps-t-4"
                  >{{pruchaseType.subtitle}} 20 {{defaultSelectedToken.symbol}}</div>
                </div>
                <div class="col-md-12 ps-t-32 ps-x-40">
                  <input-token
                    :placeholder="'0.00'"
                    :integer="true"
                    :change="changeAmount"
                    :disableToken="true"
                  />
                </div>
                <div
                  class="col-md-12 ps-x-40 ps-y-8 ps-b-20 font-caption text-gray-300"
                >Account balance: $234 = 234421.3455 {{defaultSelectedToken.symbol}}</div>

                <div class="col-md-12 ps-t-8 ps-x-40">
                  <button class="btn btn-block btn-primary ps-20">{{pruchaseType.btn}}</button>
                </div>

                <div
                  class="col-md-12 ps-x-40 ps-t-12 ps-b-40 font-body-small text-gray-500"
                >{{pruchaseType.note}}</div>
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

import InputToken from "~/components/lego/input-token";

@Component({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    bid: {
      type: Boolean,
      required: false,
      default: false
    },
    close: {
      type: Function,
      required: true
    }
  },
  components: { InputToken },
  computed: {
    ...mapGetters("token", ["selectedERC20Token", "erc20Tokens"])
  }
})
export default class PlaceBid extends Vue {
  bg = "#000000";
  mounted() {}

  onImageLoad() {
    const img = this.$el.querySelector(".asset-img");
    let rgbColor = colorThief.getColor(img);
    if (rgbColor) {
      let hsl = rgbToHsl({
        r: rgbColor[0],
        g: rgbColor[1],
        b: rgbColor[2]
      });
      this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
    } else this.bg = "#ffffff";
  }

  changeAmount(value) {
    console.log("Amount: ", value);
  }

  // get

  get pruchaseType() {
    if (this.bid) {
      return {
        title: "Enter your bid",
        subtitle: "Highest bid is",
        note:
          "By bidding, you will automatically pay for this item if you're the highest bidder when the auction expires.",
        btn: "Place Bid"
      };
    }
    return {
      title: "Make an offer",
      subtitle: "Last offer is",
      note:
        "By offering, you will automatically pay for this item if the owner accepts your offer, unless you cancel it.",
      btn: "Submit offer"
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
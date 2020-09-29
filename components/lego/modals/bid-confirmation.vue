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
                ' 0%, rgba(236, 235, 223, 0) 80%)',
            }"
          >
            <div class="close-wrapper" @click="close()">
              <svg-sprite-icon name="close-modal" class="close" />
            </div>
            <div class="container-fluid text-center">
              <div class="row">
                <div class="col-md-12 ps-y-32">
                  <!-- Need an nft image -->
                  <!-- <img
                    class="asset-img mx-auto"
                    src="~/static/img/dummy-kitty.png"
                    alt="kitty"
                    @load="onImageLoad"
                  /> -->
                </div>
                <div class="col-md-12">
                  <div class="font-heading-large title font-semibold">
                    {{ bid.order.token.name }}
                  </div>
                  <div class="font-body-medium last-offer ps-t-4">
                    Highest offer is {{ bid.order.highest_bid }}
                    {{ bid.erc20Token.symbol }}
                  </div>
                </div>
                <div class="col-md-12 ps-y-32">
                  <div class="font-body-small short-descr">Offer received</div>
                  <div class="amount font-heading-large font-semibold ps-t-4">
                    {{ bid.price }} {{ bid.erc20Token.symbol }}
                  </div>
                </div>

                <div class="col-md-12 ps-t-8 ps-b-40 ps-x-40">
                  <button-loader
                    class="ml-auto"
                    :loading="isLoading"
                    :loadingText="btnTexts.loadingTitle"
                    :text="btnTexts.title"
                    block
                    lg
                    color="primary"
                    :click="accept"
                  ></button-loader>
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

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

@Component({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    bid: {
      type: Object,
      required: true,
    },
    btnTexts: {
      type: Object,
      required: false,
      default: () => {
        return { title: "Confirm", loadingTitle: "Accepting..." };
      },
    },
    accept: {
      type: Function,
      required: false,
      default: () => {},
    },
    close: {
      type: Function,
      required: true,
    },
  },
  components: {},
})
export default class BidConfirmationModal extends Vue {
  bg = "#000000";

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
      } else this.bg = "#ffffff";
    } catch (error) {}
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.asset-img {
  max-width: 112px;
  max-height: 112px;
}
.last-offer {
  color: dark-color("500");
}
.short-descr {
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
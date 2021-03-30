<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bsl="show" v-bind:class="{ show: show }"></div>
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
            <div class="container-fluid text-center" v-if="order">
              <div class="row">
                <div class="col-md-12 ps-y-32">
                  <img
                    class="asset-img mx-auto"
                    :src="order.token.img_url"
                    :alt="order.token.name"
                    @load="onImageLoad"
                    @error="imageLoadError"
                  />
                </div>
                <div class="col-md-12">
                  <div class="font-heading-large title font-semibold">
                    {{ order.token.name }}
                  </div>
                  <div
                    v-if="order.highest_bid"
                    class="font-body-medium last-offer ps-t-4"
                  >
                    Highest offer is {{ order.highest_bid }}
                    {{ order.erc20tokens.symbol }}
                  </div>
                </div>
                <div class="col-md-12 ps-y-32">
                  <div class="font-body-small short-descr">Listed for</div>
                  <div class="amount font-heading-large font-semibold ps-t-4">
                    {{ order.price }} {{ order.erc20tokens.symbol }}
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
    order: {
      type: Object,
      required: true,
    },
    category: {
      type: Object,
      required: true
    },
    btnTexts: {
      type: Object,
      required: false,
      default: () => {
        return { title: "Cancel", loadingTitle: "Canceling..." };
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
export default class CancelConfirm extends Vue {
  bg = "#f3f4f7";

  mounted() {
    console.log("mounted");
    console.log(this.order);
    console.log(this.order.erc20tokens);
  }

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

  imageLoadError (event) {
    event.target.src = this.category.img_url
    event.target.style.width = '50px';
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

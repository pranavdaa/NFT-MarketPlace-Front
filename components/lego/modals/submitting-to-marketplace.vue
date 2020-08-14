<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
    <div class="modal add-token-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box accept-box">
          <div
            class="box-body"
            v-bind:style="{background: 'linear-gradient( 180deg,'+bg+' 0%, rgba(236, 235, 223, 0) 80%)'}"
          >
            <div class="close-wrapper" @click="close()">
              <svg-sprite-icon name="close-modal" class="close" />
            </div>
            <div class="container-fluid text-center">
              <div class="row ps-x-20 ps-x-40">
                <div class="col-md-12 ps-y-32">
                  <img
                    class="asset-img mx-auto"
                    src="~/static/img/dummy-kitty.png"
                    alt="kitty"
                    @load="onImageLoad"
                  />
                </div>
                <div class="col-md-12 ps-b-32">
                  <div
                    class="font-heading-large title font-semibold"
                    v-if="!submitted"
                  >Submitting to Marketplace</div>
                  <div
                    class="font-heading-large title font-semibold"
                    v-if="submitted"
                  >Successfully Submited!</div>
                  <div
                    class="font-body-medium last-offer ps-t-4"
                  >No gas needed! Just accept the signature request and wait for us to process your listing.</div>
                </div>
                <div
                  class="col-md-12 ps-t-8 ps-b-40 ps-x-40"
                  v-if="!submitted"
                  @click="submitted = !submitted"
                >Matic loader</div>
                <div class="col-md-12 ps-t-8 ps-b-40 ps-x-0" v-if="submitted">
                  <button
                    class="btn btn-light btn-block"
                    @click="submitted = !submitted"
                  >View public profile</button>
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
      required: false,
      default: false,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  components: {},
  methods: {},
  mixins: [],
})
export default class SubmittingToMarketplace extends Vue {
  submitted = false;
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
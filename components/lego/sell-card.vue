<template>
  <div class="sell-card text-center cursor-pointer" v-bind:style="{background: bg}">
    <div class="time-left-pill d-flex" v-if="order.timeleft">
      <img
        src="~/assets/svg/clock-analog.svg"
        alt="Cryptokitty"
        class="icon ms-r-4 align-self-center"
      />
      <div class="font-caps font-medium caps align-self-center ps-r-6 ps-t-1">{{order.timeleft}}</div>
    </div>
    <img :src="order.img" class="asset-img" alt="kitty" @load="onImageLoad" />
    <div
      class="gradient"
      v-bind:style="{background: 'linear-gradient( 360deg,'+bg+'0%, rgba(236, 235, 223, 0) 100%)'}"
    ></div>
    <div class="category-pill d-flex mx-auto ms-t-20 ms-b-16">
      <img
        src="~/static/img/cryptokitty.svg"
        alt="Cryptokitty"
        class="icon ms-2 ms-r-4 align-self-center"
      />
      <div
        class="font-caps font-medium caps align-self-center ps-r-6 ps-t-1"
      >{{order.category.title}}</div>
    </div>
    <h3 class="w-100 title font-body-small font-medium ms-b-8">{{order.title}}</h3>
    <div class="price font-body-small">{{order.price}} {{order.erc20Token.symbol}}</div>
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
    order: {
      type: Object,
      required: true
    }
  },
  components: {},
  middleware: [],
  mixins: []
})
export default class SellCard extends Vue {
  bg = "#ffffff";

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
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.sell-card {
  width: 258px;
  height: 380px;
  margin: 0.625rem;
  position: relative;

  background: light-color("700");
  border-radius: $default-card-box-border-radius;

  .time-left-pill {
    position: absolute;
    top: 10px;
    right: 10px;
    background: light-color("700");
    border-radius: 19px;
    .icon {
      width: 24px;
      height: 24px;
    }
  }
  .asset-img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
  .gradient {
    width: 100%;
    height: 100px;
    margin-top: -92px;
    position: absolute;
    background: linear-gradient(
      360deg,
      light-color("700") 0%,
      rgba(236, 235, 223, 0) 100%
    );
  }

  .category-pill {
    width: fit-content;
    border-radius: 19px;
    background: light-color("700");
    .icon {
      width: 20px;
      height: 20px;
    }
  }
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    color: dark-color("400");
  }
}
.sell-card:hover {
  box-shadow: $default-card-box-shadow;
}
@media (max-width: 330px) {
  .sell-card {
    width: 100%;
    height: auto;
  }
}
</style>

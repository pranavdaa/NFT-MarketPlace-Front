<template>
  <a href="/tokens/1" class="sell-card text-center cursor-pointer" v-bind:style="{background: bg}">
    <on-sale-tag v-if="order.onSale" :time="order.timeleft" />

    <div class="img-wrapper d-flex justify-content-center">
      <img
        src="~/static/img/dummy-kitty.png"
        class="asset-img align-self-center"
        alt="kitty"
        @load="onImageLoad"
      />
      <!-- <img :src="order.img" class="asset-img" alt="kitty" @load="onImageLoad" /> -->
    </div>
    <div
      class="gradient"
      v-bind:style="{background: 'linear-gradient( 360deg,'+bg+'0%, rgba(236, 235, 223, 0) 100%)'}"
    ></div>
    <a href="/tokens/2" class="category-pill d-flex mx-auto ms-t-20 ms-b-16">
      <img
        src="~/static/img/cryptokitty.svg"
        alt="Cryptokitty"
        class="icon ms-2 ms-r-4 align-self-center"
      />
      <div
        class="font-caps font-medium caps align-self-center ps-r-6 ps-t-1"
      >{{order.category.title}}</div>
    </a>
    <h3 class="w-100 title font-body-small font-medium ms-b-8">{{order.title}}</h3>
    <div class="price font-body-small ms-b-20">{{order.price}} {{order.erc20Token.symbol}}</div>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="isMyAccount"
    >
      <a class="btn btn-transparent w-50 align-self-center" @click.prevent="sell()">Sell</a>
      <a class="btn btn-transparent w-50 align-self-center" @click.prevent="transfer()">Transfer</a>
    </div>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="isMyAccount"
    >
      <a
        class="btn btn-red btn-transparent w-100 align-self-center"
        @click.prevent="removeFromMarketplace()"
      >Remove from Marketplace</a>
    </div>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="isMyAccount"
    >
      <a
        class="btn btn-transparent w-100 align-self-center"
        @click.prevent="moveToMatic()"
      >Move to Matic</a>
    </div>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="isMyAccount"
    >
      <a
        class="btn btn-transparent w-100 align-self-center"
        @click.prevent="moveToEthereum()"
      >Move to Ethereum</a>
    </div>
  </a>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

import OnSaleTag from "~/components/lego/token/on-sale-tag";

@Component({
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  components: { OnSaleTag },
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

  get isMyAccount() {
    if (this.$route.name === "account") {
      return true;
    }
    return false;
  }

  sell() {
    console.log("sell");
  }
  transfer() {
    console.log("transfer");
  }
  moveToMatic() {
    console.log("moveToMatic");
  }
  moveToEthereum() {
    console.log("moveToEthereum");
  }
  transfer() {
    console.log("transfer");
  }
  removeFromMarketplace() {
    console.log("removeFromMarketplace");
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

a {
  color: inherit;
  text-decoration: inherit;
}

.sell-card {
  width: 258px;
  min-height: 380px;
  margin: 0.625rem;
  position: relative;

  background: light-color("700");
  border-radius: $default-card-box-border-radius;
  .img-wrapper {
    width: 100%;
    max-width: 258px;
    height: 100%;
    max-height: 258px;
    overflow: hidden;
    .asset-img {
      width: 100%;
    }
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
.actions {
  height: 45px;
  border-top: 1px solid rgba(dark-color("700"), 0.1);
  &.matic-chain {
    .btn-transparent {
      color: primary-color("600");
      border-radius: 0px;
    }

    .btn-red {
      color: red-color("600");
    }

    .btn:nth-child(2) {
      border-left: 1px solid rgba(dark-color("700"), 0.1);
    }
  }
}
@media (max-width: 330px) {
  .sell-card {
    width: 100%;
    height: auto;
  }
}
</style>

<template>
  <nuxt-link
    :to="{name:'account'}"
    class="nft-card text-center cursor-pointer"
    v-bind:style="{background: bg}"
  >
    <div
      class="check-container d-flex"
      v-if="!isAllCategories"
      @click="toggleSelection(!isSelected)"
    >
      <input type="checkbox" :name="token.name" id="token.id" :checked="isSelected" />
      <span class="checkmark align-self-center"></span>
    </div>
    <div class="img-wrapper d-flex ps-t-12 justify-content-center">
      <img
        :src="token.img_url"
        class="asset-img align-self-center"
        :alt="token.name"
        @load="onImageLoad"
      />
    </div>
    <div
      class="gradient"
      v-bind:style="{background: 'linear-gradient( 360deg,'+bg+'0%, rgba(236, 235, 223, 0) 100%)'}"
    ></div>
    <div class="category-pill d-flex mx-auto ms-t-20 ms-b-16" v-if="token.category">
      <img
        :src="token.category.img_url"
        :alt="token.category.name"
        class="icon ms-2 ms-l-4 ms-r-4 align-self-center"
      />
      <div class="font-caps font-medium caps align-self-center ps-r-6">{{token.category.name}}</div>
    </div>
    <h3
      class="w-100 title font-body-small font-medium ms-b-8 ps-x-12 ms-b-16"
      :title="token.name"
    >{{token.name}}</h3>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="!isMainToken"
    >
      <a class="btn btn-transparent w-50 align-self-center">Sell</a>
      <a class="btn btn-transparent w-50 align-self-center">Transfer</a>
    </div>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="isMainToken && isAllCategories"
    >
      <a class="btn btn-transparent w-100 align-self-center">Move to Matic</a>
    </div>
  </nuxt-link>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import app from "~/plugins/app";
import { mapGetters } from "vuex";

import { toDataURL } from "~/plugins/helpers/";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

@Component({
  props: {
    token: {
      type: Object,
      required: true,
    },
    isAllCategories: {
      type: Boolean,
      required: false,
      default: false,
    },
    onSelectToken: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  components: {},
  computed: {
    ...mapGetters("category", ["categories"]),
    ...mapGetters("network", ["networks"]),
  },
  middleware: [],
  mixins: [],
})
export default class NFTTokenCard extends Vue {
  bg = "#f3f4f7";
  isSelected = false;

  // Initial
  mounted() {}

  async onImageLoad() {
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
    } catch (error) {
      this.bg = "#f3f4f7";
    }
  }

  // Handlers
  toggleSelection(value) {
    this.isSelected = value;
    this.onSelectToken && this.onSelectToken(this.token);
  }

  // Get
  get category() {
    return this.token.category;
  }

  get isMainToken() {
    if (this.token.chainId) {
      return this.token.chainId === this.networks.main.chainId;
    }
    return false;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

a {
  color: inherit;
  text-decoration: inherit;
}

.nft-card {
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
      max-height: 100%;
      max-width: 100%;
    }
  }
  .gradient {
    width: 100%;
    height: 100px;
    margin-top: -92px;
    position: absolute;
    background: linear-gradient(
      360deg,
      light-color("500") 0%,
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
      border-radius: 50%;
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
.nft-card:hover {
  box-shadow: $default-card-box-shadow;
}
.check-container {
  position: absolute;
  top: 12px;
  left: 12px;
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
  .nft-card {
    width: 100%;
    height: auto;
  }
}
</style>

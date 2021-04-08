<template>
  <nuxt-link
    :to="{ name: 'account' }"
    class="nft-card text-center cursor-pointer"
    v-bind:style="{ background: bg }"
  >
    <div
      class="check-container"
      :class="{ checked: isSelected }"
      v-if="showCheckbox"
      @click="toggleSelection()"
    >
      <input
        type="checkbox"
        :name="token.name"
        :id="token.id"
        :checked="isSelected"
      />
      <span class="checkmark align-self-center"></span>
    </div>
    <NuxtLink
      :to="
        !order
          ? {
              name: 'token-tokenId',
              params: { tokenId: token.token_id },
              query: { chainId: token.chainId },
            }
          : { name: 'tokens-id', params: { id: order.id } }
      "
    >
      <div class="img-wrapper d-flex ps-t-12 justify-content-center">
        <video autoplay muted loop width="100%" v-if="isVideoFormat">
          <source :src="token.img_url" type="video/webm" @error="handleNotVideo" />
          <source :src="token.img_url" type="video/ogg" @error="handleNotVideo" />
          <source :src="token.img_url" type="video/mp4" @error="handleNotVideo" />
        </video>
        <img
          v-else
          :src="token.img_url"
          class="asset-img align-self-center ps-x-12"
          :alt="token.name"
          @load="onImageLoad"
          @error="imageLoadError"
        />
      </div>

      <div
        class="gradient"
        v-bind:style="{
          background:
            'linear-gradient( 360deg,' + bg + '0%, rgba(236, 235, 223, 0) 100%)',
        }"
      ></div>
    </NuxtLink>
    <div class="more-actions" v-if="!isAllCategories && !order">
      <MoreOptions :options="moreOptions" />
    </div>

    <div
      class="category-pill d-flex mx-auto ms-t-20 ms-b-16"
      v-if="token.category"
    >
      <img
        :src="token.category.img_url"
        class="icon ms-2 ms-l-4 ms-r-4 align-self-center"
      />
      <div class="font-caps font-medium caps align-self-center ps-r-6">
        {{ token.category.name }}
      </div>
    </div>
    <h3
      class="w-100 title font-body-small font-medium ms-b-8 ps-x-12 ms-b-16"
      :title="token.name"
    >
      {{ token.name }} {{ isErc1155 ? '( '+ token.amount +' )': '' }}
    </h3>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="!isMainToken && !order"
    >
      <a class="btn btn-transparent disabled w-100 align-self-center" @click="sell()">{{
        $t("sell")
      }}</a>
      <a
        class="btn btn-transparent w-100 align-self-center"
        @click="transfer()"

        >{{ $t("transfer") }}</a
      >
    </div>

    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="!isMainToken && order"
    >
      <NuxtLink
        class="btn btn-transparent w-100 align-self-center"
        :to="{ name: 'tokens-id', params: { id: order.id } }"
        >View Order</NuxtLink
      >
    </div>
    <div
      class="actions matic-chain d-flex justify-content-between text-center w-100 d-flex"
      v-if="isMainToken && isAllCategories"
      @click="deposit(token)"
    >
      <a class="btn btn-transparent w-100 align-self-center">{{
        $t("moveToMatic")
      }}</a>
    </div>
  </nuxt-link>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import app from "~/plugins/app";
import { mapGetters } from "vuex";
import { toDataURL } from "~/plugins/helpers/";

import MoreOptions from "~/components/lego/more-options";

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
    isSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
    totalSelected: {
      type: Number,
      required: false,
      default: 0,
    },
    onSell: {
      type: Function,
      required: false,
      default: () => {},
    },
    onSend: {
      type: Function,
      required: false,
      default: () => {},
    },
    onDeposit: {
      type: Function,
      required: false,
      default: () => {},
    },
    onWithdraw: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  components: { MoreOptions },
  computed: {
    ...mapGetters("category", ["categories"]),
    ...mapGetters("network", ["networks"]),
    ...mapGetters("account", ["userOrders"]),
  },
  middleware: [],
  mixins: [],
})
export default class NFTTokenCard extends Vue {
  bg = "#f3f4f7";
  maxTokenSelection = app.uiconfig.maxBulkDeposit;
  isVideoFormat = true;

  // Initial
  mounted() {}

  async onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      // img.crossOrigin = "Anonymous";

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

  get isErc1155() {
    return this.token.type ==='ERC1155'
  }

  get isErc721() {
    return this.token.type ==='ERC721'
  }

  // Handlers
  toggleSelection(value) {
    if (this.totalSelected !== this.maxTokenSelection) {
      this.onSelectToken && this.onSelectToken(this.token);
    } else if (!value) {
      this.onSelectToken && this.onSelectToken(this.token);
    }
  }

  deposit() {
    // Withdraw Action
    this.onDeposit && this.onDeposit(this.token);
  }

  withdraw() {
    // Withdraw Action
    this.onWithdraw && this.onWithdraw(this.token);
  }

  transfer() {
    // Send to friends
    this.onSend && this.onSend(this.token);
  }

  sell() {
    // sell token
    this.onSell && this.onSell(this.token);
  }

  viewOrder() {
    if (this.order) {
      this.$router.push({ name: "tokens", parms: { id: this.order.id } });
    }
  }

  imageLoadError (event) {
    event.target.src = this.category.img_url
    event.target.style.width = '100px';
  }

  handleNotVideo() {
    this.isVideoFormat = false;
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

  get isOpenseaCompatible() {
    return this.token.category.isOpenseaCompatible;
  }

  get showCheckbox() {
    if (!this.isMainToken) {
      return !this.isAllCategories && !this.order && (this.isOpenseaCompatible)
    } else {
      return !this.isAllCategories && !this.order
    }
  }

  get order() {
    if (
      !this.isMainToken &&
      this.token.active_order &&
      this.userOrders &&
      this.userOrders.length > 0
    ) {
      let order = this.userOrders.find(
        (t) => t.tokens_id == this.token.token_id
      );
      return order;
    }
    return null;
  }

  get moreOptions() {
    if (this.isMainToken) {
      return [
        {
          title: this.$t("moreOptions.deposit"),
          action: this.deposit,
        },
      ];
    }

    if (this.isOpenseaCompatible) {
      return [
        {
          title: this.$t("moreOptions.withdraw"),
          action: this.withdraw,
        },
        {
          title: this.$t("moreOptions.sell"),
          action: this.sell,
        },
        // {
        //   title: this.$t("moreOptions.send"),
        //   action: this.transfer,
        // },
      ];
    }

    return [
      {
        title: this.$t("moreOptions.sell"),
        action: this.sell,
      },
    ];
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
  width: 240px;
  min-height: 378px;
  margin: 0.625rem;
  position: relative;

  background: light-color("700");
  border-radius: $default-card-box-border-radius;
  .img-wrapper {
    width: 100%;
    max-width: 240px;
    height: 100%;
    max-height: 240px;
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
.nft-card:hover .check-container,
.nft-card:hover .more-actions {
  display: flex !important;
}
.check-container {
  position: absolute;
  top: 12px;
  left: 12px;
  display: none;
  &.checked {
    display: flex !important;
  }
}
.more-actions {
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
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

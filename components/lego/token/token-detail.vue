<template>
  <div class="container-fluid ps-y-16" v-if="order.id">
    <div class="row ps-y-16 ps-x-md-16">
      <div class="col-md-7 d-flex">
        <token-short-info
          class="align-self-center"
          :order="order"
          :category="category"
          v-if="category"
        />
      </div>
      <div class="col-md d-flex justify-content-start ps-t-16 ps-t-md-0 justify-content-md-end">
        <wishlist-button :wishlisted="isFavorite" :onClick="addToWishlist" />
        <a class="btn btn-light align-self-center action ms-l-16">
          <img
            src="~/static/icons/active/share.svg"
            alt="favorited"
            class="icon option-icon active"
          />
          <span>Share</span>
        </a>
      </div>
    </div>
    <div class="row ps-y-16 ps-x-md-16 justify-content-center">
      <div class="col-md-8">
        <div
          class="feature-image d-flex d-lg-flex justify-content-center"
          v-bind:style="{background: bg}"
        >
          <img
            class="asset-img align-self-center"
            :src="order.token.img_url"
            alt="Kitty"
            @load="onImageLoad"
          />
        </div>
        <div class="feature-info mobile d-flex d-lg-none flex-column ps-16 ps-lg-40 ms-y-16">
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
              class="font-body-small d-flex ps-t-8 font-medium"
              href="#more-info"
              v-if="!showMore"
              @click.prevent="showMore = true"
            >More info</a>
            <a
              class="font-body-small d-flex ps-t-8 font-medium"
              href="#more-info"
              v-if="showMore"
              @click.prevent="showMore = false"
            >Show less</a>
          </p>

          <div class="font-body-small text-gray-300 ms-t-16 ps-y-4">Listed for</div>
          <div
            class="font-heading-large font-semibold ps-b-20"
            v-if="erc20Token"
          >{{order.price}} {{erc20Token.symbol}}</div>
          <!-- <div
            class="font-heading-large font-semibold ps-b-20"
            v-if="erc20Token"
          >{{order.getPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
          <button class="btn btn-primary" v-if="!isOwnersToken" @click="buyOrder()">Buy Now</button>
          <button class="btn btn-light" v-if="isOwnersToken" @click="cancelOrder()">Cancel</button>
        </div>
        <div class="d-flex flex-column ps-y-16 ps-y-md-32" v-if="category">
          <h3 class="font-heading-medium font-semibold category">
            About {{category.name}}
            <a
              class="ps-l-12"
              :href="category.url"
              target="_blank"
              rel="noopener noreferrer"
            >Visit Website</a>

            <span
              class="float-right cursor-pointer right-arrow"
              :class="{'down-icon':showCategoryInfo}"
              @click="showCategoryInfo = !showCategoryInfo"
              v-if="category.description"
            >
              <svg-sprite-icon name="right-arrow" />
            </span>
          </h3>
          <p
            class="font-body-medium ps-t-20"
            v-if="showCategoryInfo && category.description"
          >{{category.description}}</p>
        </div>
        <div class="d-flex flex-column ps-y-16 ps-y-md-32" v-if="order.token.properties">
          <h3 class="font-heading-medium font-semibold category">
            Properties
            <span
              class="float-right cursor-pointer right-arrow"
              :class="{'down-icon':showProperties}"
              @click="showProperties = !showProperties"
            >
              <svg-sprite-icon name="right-arrow" />
            </span>
          </h3>
          <p class="font-body-medium ps-t-20" v-if="showProperties">{{order.token.properties}}</p>
        </div>
        <div
          class="d-flex flex-column ps-y-16 ps-y-md-32 bids"
          v-if="isOwnersToken && order.type !== app.orderTypes.FIXED"
        >
          <h3 class="font-heading-medium font-semibold category">Bidding history</h3>
          <p class="font-body-medium ps-t-20">
            <bidder-row
              v-for="bid in bidsFullList"
              :key="bid.id"
              :bid="bid"
              :refreshBids="refreshBids"
            />
          </p>
        </div>
      </div>
      <div class="col-md-4 d-none d-lg-flex">
        <div class="feature-info d-flex flex-column ps-16 ps-lg-40">
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
              class="font-body-small d-flex ps-t-8 font-medium"
              href="#more-info"
              v-if="!showMore"
              @click.prevent="showMore = true"
            >More info</a>
            <a
              class="font-body-small d-flex ps-t-8 font-medium"
              href="#more-info"
              v-if="showMore"
              @click.prevent="showMore = false"
            >Show less</a>
          </p>

          <div class="font-body-small text-gray-300 mt-auto ps-y-4">Listed for</div>
          <div
            class="font-heading-large font-semibold ps-b-20"
            v-if="erc20Token"
          >{{order.price}} {{erc20Token.symbol}}</div>
          <!-- <div
            class="font-heading-large font-semibold ps-b-20"
            v-if="erc20Token"
          >{{order.getPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
          <button class="btn btn-primary" v-if="!isOwnersToken" @click="buyOrder()">Buy Now</button>
          <button class="btn btn-light" v-if="isOwnersToken" @click="cancelOrder()">Cancel</button>
        </div>
      </div>
    </div>
    <buy-token :show="showBuyToken" :order="order" :close="onBuyTokenClose" v-if="showBuyToken" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import getAxios from "~/plugins/axios";
import app from "~/plugins/app";
import { mapGetters } from "vuex";

import OrderModel from "~/components/model/order";
import BidModel from "~/components/model/bid";

import TokenShortInfo from "~/components/lego/token/token-short-info";
import WishlistButton from "~/components/lego/wishlist-button";
import BidderRow from "~/components/lego/bidder-row";
import BuyToken from "~/components/lego/modals/buy-token";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

@Component({
  props: {
    tokenId: {
      type: [Number, String],
      required: false,
    },
  },
  components: { TokenShortInfo, WishlistButton, BidderRow, BuyToken },
  computed: {
    ...mapGetters("category", ["categories"]),
    ...mapGetters("token", ["erc20Tokens"]),
    ...mapGetters("account", ["account", "favouriteOrders"]),
    ...mapGetters("auth", ["user"]),
  },
  middleware: [],
  mixins: [],
})
export default class TokenDetail extends Vue {
  bg = "#ffffff";
  showMore = false;
  showCategoryInfo = true;
  showProperties = true;
  showBuyToken = false;

  limit = app.uiconfig.defaultPageSize;
  bidsFullList = [];
  hasNextPage = true;
  isLoadingBids = false;
  isLoadingDetails = false;

  order = {};

  // initialize
  async mounted() {
    await this.fetchOrder();
  }

  onImageLoad() {
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
  }

  // Get
  get category() {
    return this.categories.filter(
      (item) => item.id === this.order.categories_id
    )[0];
  }

  get app() {
    return app;
  }

  get erc20Token() {
    return this.erc20Tokens.filter(
      (token) => token.id === this.order.erc20tokens_id
    )[0];
  }

  get isFavorite() {
    if (this.user && this.favouriteOrders) {
      const order = this.favouriteOrders.filter(
        (order) => order.order_id === this.order.id
      );
      return order.length !== 0;
    }
    return false;
  }

  get isOwnersToken() {
    if (this.user && this.order.type === app.orderTypes.FIXED) {
      return this.user.id === this.order.maker_address;
    } else {
      return this.user.id === this.order.taker_address;
    }
    return false;
  }

  // async
  async fetchOrder() {
    if (!this.tokenId || this.isLoadingDetails) {
      return;
    }
    this.isLoadingDetails = true;
    try {
      let response = await getAxios().get(`orders/${this.tokenId}`);
      if (response.status === 200 && response.data.data) {
        let data = new OrderModel(response.data.data);
        this.order = data;
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoadingDetails = false;
    if (this.isOwnersToken && this.order.type !== app.orderTypes.FIXED) {
      await this.fetchBidders();
    }
  }

  // actions
  buyOrder() {
    this.showBuyToken = true;
  }
  onBuyTokenClose() {
    this.showBuyToken = false;
  }

  async cancelOrder() {
    console.log("cancelOrder");
    try {
      if (this.order.type === app.orderTypes.FIXED) {
        // contractWrappers, orderTemplate
        // const txHashCancel = await contractWrappers.exchange
        //   .cancelOrder(orderTemplate)
        //   .awaitTransactionSuccessAsync({ from: maker, gasPrice: 0, gas: 8000000 });
        // console.log("Order canceled", txHashCancel);
      }
      let data = {
        tx_hash: "",
      };
      let response = await getAxios().patch(
        `order/${this.order.id}/cancel`,
        data
      );
      if (response.status === 200) {
        app.addToast("Order cancelled", "");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async addToWishlist() {
    // Add current order to users wishlist if not wishlisted or if it is then remove it
    try {
      if (this.isFavorite) {
        const response = await getAxios().delete("users/favourites", {
          orderId: this.order.id,
        });
      } else {
        const response = await getAxios().post("users/favourites", {
          orderId: this.order.id,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        app.addToast(
          "Need Login",
          "You need to login to add token to wishlist",
          {
            type: "info",
          }
        );
      }
    }
  }

  async refreshBids() {
    await this.fetchBidders();
  }

  async fetchBidders() {
    if (this.isOwnersToken) {
      if (this.isLoadingBids || this.order.type === app.orderTypes.FIXED) {
        return;
      }
      try {
        let response;
        response = await getAxios().get(`orders/bids/${this.order.id}`);
        if (response.status === 200 && response.data.data.order) {
          let bids = [];
          response.data.data.order.forEach(function (bid) {
            bid.erc20Token = this.erc20Token;
            bid.order = this.order;
            if (bid.status === 0) {
              // if bid is active
              bids.push(new BidModel(bid));
            }
          }, this);
          this.hasNextPage = response.data.data.has_next_page;
          this.bidsFullList = bids;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.feature-image {
  width: 100%;
  padding-top: 3.75rem;
  padding-bottom: 3.75rem;
  min-height: 500px;
  border-radius: $default-card-box-border-radius;
  .asset-img {
    min-width: 34%;
    max-height: 380px;
  }
}
.feature-info {
  &.mobile {
    min-height: auto;
  }
  width: 100%;
  max-height: 500px;
  border: 1px solid #f3f4f7;
  border-radius: $default-card-box-border-radius;
}
.action {
  .option-icon {
    margin-top: -3px;
    margin-right: 4px;
  }
}
.right-arrow {
  width: 24px;
  height: 24px;
  .svg-sprite-icon {
    width: 10px;
    height: 14px;
    fill: rgba(dark-color("700"), 0.4);
  }
  &.down-icon {
    .svg-sprite-icon {
      transform: rotate(90deg);
    }
  }
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

.text-gray-300 {
  color: dark-color("300");
}

@media (max-width: 768px) {
  .feature-image {
    min-height: auto;
  }
}
</style>

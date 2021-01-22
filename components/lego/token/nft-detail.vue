<template>
  <div>
    <div
      class="container-fluid ps-y-16"
      v-if="token.token_id && !isLoadingDetails"
    >
      <div class="row ps-y-16 ps-x-md-16">
        <div class="col-md-7 d-flex">
          <token-short-info
            class="align-self-center"
            :order="token"
            :category="category"
            v-if="category"
          />
        </div>
      </div>
      <div class="row ps-y-16 ps-x-md-16 justify-content-center">
        <div class="col-md-8">
          <div
            class="feature-image d-flex d-lg-flex justify-content-center mb-4"
            v-bind:style="{ background: bg }"
          >
            <img
              class="asset-img align-self-center"
              :src="token.img_url"
              alt="Kitty"
              @load="onImageLoad"
            />
          </div>
          <div class="details-section">
            <div
              class="feature-info mobile d-flex d-lg-none flex-column ps-16 ps-lg-40 ms-y-16"
            >
              <h2>{{ token.description }}</h2>
              <h3 class="font-heading-medium font-semibold">
                About {{ token.name }}
              </h3>
              <p
                class="font-body-medium"
                :class="{ 'show-less': showMore, 'show-more': !showMore }"
                v-if="token.description"
              >
                {{ token.description }}
                <span class="dots">...</span>
                <span class="more">{{ token.description }}</span>
                <a
                  class="font-body-small d-flex ps-t-8 font-medium"
                  href="#more-info"
                  v-if="!showMore"
                  @click.prevent="showMore = true"
                  >More info</a
                >
                <a
                  class="font-body-small d-flex ps-t-8 font-medium"
                  href="#more-info"
                  v-if="showMore"
                  @click.prevent="showMore = false"
                  >Show less</a
                >
              </p>
            </div>
            <div class="d-flex flex-column py-4" v-if="category">
              <h3 class="font-heading-medium font-semibold category">
                About {{ category.name }}
                <a
                  class="ps-l-12"
                  :href="category.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Visit Website</a
                >

                <span
                  class="float-right cursor-pointer right-arrow"
                  :class="{ 'down-icon': showCategoryInfo }"
                  @click="showCategoryInfo = !showCategoryInfo"
                  v-if="category.description"
                >
                  <svg-sprite-icon name="right-arrow" />
                </span>
              </h3>
              <p
                class="font-body-medium ps-t-20"
                v-if="showCategoryInfo && category.description"
              >
                {{ category.description }}
              </p>
            </div>

            <div class="properties py-4" v-if="token.token.attributes_metadata">
              <h3 class="font-heading-medium font-semibold mb-4">
                Properties
                <span
                  class="float-right cursor-pointer right-arrow"
                  :class="{ 'down-icon': showProperties }"
                  @click="showProperties = !showProperties"
                >
                  <svg-sprite-icon name="right-arrow" />
                </span>
              </h3>
              <div class="d-flex flex-row flex-wrap" v-if="showProperties">
                <div
                  class="col-md-4 p-0 pr-4 justify-content-between"
                  v-bind:key="`${attribute.trait_type}-${attribute.value}`"
                  v-for="attribute in token.token.attributes_metadata"
                >
                  <div class="d-flex flex-column properties-pill p-3 mb-4">
                    <p class="property-title m-0 p-0 text-truncate">
                      {{ attribute.trait_type }}
                    </p>
                    <p class="property-detail m-0 pt-1 text-truncate">
                      {{ attribute.value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-none d-lg-flex">
          <div class="feature-info d-flex flex-column ps-16 ps-lg-40">
            <h3 class="font-heading-medium font-semibold">
              About {{ token.name }}
            </h3>
            <p
              class="font-body-medium"
              :class="{ 'show-less': showMore, 'show-more': !showMore }"
              v-if="token.description"
            >
              {{ token.description }}
              <span class="dots">...</span>
              <span class="more">{{ token.description }}</span>
              <a
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                v-if="!showMore"
                @click.prevent="showMore = true"
                >More info</a
              >
              <a
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                v-if="showMore"
                @click.prevent="showMore = false"
                >Show less</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row ps-x-16 ps-y-120 d-flex justify-content-center text-center">
      <button-loader
        class="mx-auto"
        :loading="isLoadingDetails"
        :loadingText="$t('loading')"
        :text="$t('loadMore')"
        block
        lg
        color="light"
        v-if="isLoadingDetails"
      ></button-loader>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import getAxios from "~/plugins/axios";
import app from "~/plugins/app";
import { mapGetters } from "vuex";

import NFTTokenModel from "~/components/model/nft-token";

import TokenShortInfo from "~/components/lego/token/token-short-info";
import WishlistButton from "~/components/lego/wishlist-button";
import BuyToken from "~/components/lego/modals/buy-token";
import CancelConfirm from "~/components/lego/modals/cancel-confirm";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

import { providerEngine } from "~/plugins/helpers/provider-engine";

@Component({
  props: {
    tokenId: {
      type: [Number, String],
      required: false,
    },
    chainId: {
      type: [Number, String],
      required: false,
    },
  },
  components: {
    TokenShortInfo,
    WishlistButton,
    BuyToken,
    CancelConfirm,
  },
  computed: {
    ...mapGetters("category", ["categories"]),
    ...mapGetters("token", ["erc20Tokens"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"]),
  },
  middleware: [],
  mixins: [],
})
export default class NftDetail extends Vue {
  bg = "#ffffff";
  showMore = false;
  showCategoryInfo = false;
  showProperties = false;

  isLoadingDetails = false;
  isLoading = false;

  token = {};

  // initialize
  async mounted() {
    await this.fetchNFTTokens();
  }

  onImageLoad() {
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
      } else this.bg = "#ffffff";
    } catch (error) {}
  }

  // Get
  get category() {
    return this.categories.filter(
      (item) => item.id === this.token.categories_id
    )[0];
  }

  get app() {
    return app;
  }

  // async
  async fetchNFTTokens() {
    if (!this.tokenId || this.isLoadingDetails) {
      return;
    }
    this.isLoadingDetails = true;
    try {
      let response = await getAxios().get(
        `tokens/balance?userId=${this.user.id}&chainId=${this.chainId}`
      );

      if (response.status === 200 && response.data.data) {
        // should use a endpoint that returns detail for just one token
        let currentToken = response.data.data.filter((token) => {
          return token.token_id == this.tokenId;
        });

        if (currentToken.length > 0) currentToken = currentToken[0];
        else return;

        currentToken.chainId = this.chainId;
        let data = new NFTTokenModel(currentToken);
        this.token = data;
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoadingDetails = false;
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
    max-width: 90%;
    max-height: 380px;
  }
}
.feature-info {
  &.mobile {
    min-height: auto;
    position: relative;
  }
  position: fixed;
  // width: 100%;
  margin-right: 1rem;
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
.details-section {
  > :not(:last-child) {
    border-bottom: 1px solid light-color("400");
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

.properties {
  .properties-pill {
    background: primary-color("100");
    border: 1px solid primary-color("300");
    border-radius: 8px;
  }
  .property-title {
    @include font-setting("body-medium", "700");
  }
  .property-detail {
    @include font-setting("body-large", "500");
    color: dark-color("500");
  }
}

@media (max-width: 768px) {
  .feature-image {
    min-height: auto;
  }
}
</style>

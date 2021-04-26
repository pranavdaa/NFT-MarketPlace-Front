<template>
  <div>
    <div
      v-if="token.token_id && !isLoadingDetails"
      class="container-fluid ps-y-16"
    >
      <div class="row ps-y-16 ps-x-md-16 justify-content-between">
        <div class="col-md-7 d-flex">
          <token-short-info
            v-if="category"
            class="align-self-center"
            :order="token"
            :category="category"
          />
        </div>
        <a :href="openseaUrl" v-tooltip.left="'View on OpenSea'" rel="noopener noreferrer" target="_blank" class="align-self-center ps-x-16 ps-x-md-0">
          <img src="~/static/icons/opensea.svg" class="opensea-icon ps-r-16" alt="OS">
        </a>
      </div>
      <div class="row ps-y-16 ps-x-md-16 justify-content-center">
        <div class="col-md-8 h-100">
          <div
            class="feature-image d-flex d-lg-flex justify-content-center mb-4"
            :style="{ background: bg }"
          >
            <img
              v-if="checkImageFormat(token.img_url) || isNotVideoFormat"
              class="asset-img align-self-center"
              :src="token.img_url"
              alt="Token Image"
              @load="onImageLoad"
              @error="imageLoadError"
            >
            <video
              v-else
              autoplay
              muted
              loop
              height="500px"
              :poster="token.img_url"
            >
              <source
                :src="token.img_url"
                type="video/webm"
              >
              <source
                :src="token.img_url"
                type="video/ogg"
              >
              <source
                :src="token.img_url"
                type="video/mp4"
                @error="handleNotVideo"
              >
            </video>
          </div>
          <div class="details-section">
            <div
              class="feature-info mobile d-flex d-lg-none flex-column ps-16 ps-lg-40 ms-y-16"
            >
              <h3 class="font-heading-medium font-semibold">
                About {{ token.name }}
              </h3>
              <p
                v-if="tokenDescription && tokenDescription.length > 200"
                class="font-body-medium"
                :class="{ 'show-less': showMore, 'show-more': !showMore }"
              >
                {{ tokenDescription.slice(0, tokenDescription.length / 2) }}
                <span class="dots">...</span>
                <span class="more">{{
                  tokenDescription.slice(
                    tokenDescription.length / 2,
                    tokenDescription.length
                  )
                }}</span>
                <a
                  v-if="!showMore"
                  class="font-body-small d-flex ps-t-8 font-medium"
                  href="#more-info"
                  @click.prevent="showMore = true"
                >More info</a>
                <a
                  v-if="showMore"
                  class="font-body-small d-flex ps-t-8 font-medium"
                  href="#more-info"
                  @click.prevent="showMore = false"
                >Show less</a>
              </p>
              <p
                v-else
                class="font-body-medium"
              >
                {{ tokenDescription }}
              </p>

              <button
                class="btn btn-primary ms-t-32"
                @click="onSellToken"
              >
                {{ $t("sell") }}
              </button>

              <button
                class="btn btn-primary ms-t-16"
                @click="onTransferToken"
              >
                {{ $t("transfer") }}
              </button>
            </div>

            <div
              v-if="category"
              class="d-flex flex-column details-section--dropdown"
            >
              <div
                class="header-wrapper cursor-pointer py-4 ps-l-16"
                @click="showCategoryInfo = !showCategoryInfo"
              >
                <h3 class="font-heading-medium font-semibold category m-0">
                  About {{ category.name }}
                  <a
                    class="ps-l-12"
                    :href="category.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Visit Website</a>

                  <span
                    v-if="category.description"
                    class="float-right right-arrow"
                    :class="{ 'down-icon': showCategoryInfo }"
                  >
                    <svg-sprite-icon name="right-arrow" />
                  </span>
                </h3>
              </div>
              <p
                v-if="showCategoryInfo && category.description"
                class="font-body-medium ps-t-20 ps-l-16"
              >
                {{ category.description }}
              </p>
            </div>

            <div
              v-if="token.token.attributes_metadata"
              class="properties details-section--dropdown"
            >
              <div
                class="header-wrapper cursor-pointer py-4 ps-l-16"
                @click="showProperties = !showProperties"
              >
                <h3 class="font-heading-medium font-semibold m-0">
                  Properties
                  <span
                    class="float-right right-arrow"
                    :class="{ 'down-icon': showProperties }"
                  >
                    <svg-sprite-icon name="right-arrow" />
                  </span>
                </h3>
              </div>
              <div
                v-if="showProperties"
                class="d-flex flex-row flex-wrap ps-t-16 ps-l-16"
              >
                <div
                  v-for="attribute in token.token.attributes_metadata"
                  :key="`${attribute.trait_type}-${attribute.value}`"
                  class="col-md-3 p-0 pr-4 justify-content-between"
                >
                  <div
                    class="d-flex flex-column text-center properties-pill p-3 mb-4"
                  >
                    <p
                      class="property-title m-0 p-0 text-truncate"
                    >
                      {{ attribute.trait_type | pascal }}
                    </p>
                    <p class="property-detail m-0 pt-1 text-truncate">
                      <template v-if="attribute.trait_type === 'birthday'">
                        {{  attribute.value | date-human }}
                      </template>
                      <template v-else>
                        {{  attribute.value | pascal }}
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-none d-lg-flex h-100">
          <div class="feature-info d-flex flex-column ps-16 ps-lg-40 w-100">
            <h3 class="font-heading-medium font-semibold">
              About {{ token.name }}
            </h3>
            <p
              v-if="tokenDescription && tokenDescription.length > 200"
              class="font-body-medium"
              :class="{ 'show-less': showMore, 'show-more': !showMore }"
            >
              {{ tokenDescriptionFirstHalf }}
              <span class="dots">...</span>
              <span class="more">{{ tokenDescriptionSecondHalf }}</span>
              <a
                v-if="!showMore"
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                @click.prevent="showMore = true"
              >More info</a>
              <a
                v-if="showMore"
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                @click.prevent="showMore = false"
              >Show less</a>
            </p>
            <p
              v-else
              class="font-body-medium"
            >
              {{ tokenDescription }}
            </p>

            <button
              class="btn btn-primary ms-t-32"
              @click="onSellToken"
            >
              {{ $t("sell") }}
            </button>

            <button
              class="btn btn-primary ms-t-16"
              @click="onTransferToken"
            >
              {{ $t("transfer") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row ps-x-16 ps-y-120 d-flex justify-content-center text-center">
      <button-loader
        v-if="isLoadingDetails"
        class="mx-auto"
        :loading="isLoadingDetails"
        :loadingText="$t('loading')"
        :text="$t('loadMore')"
        block
        lg
        color="light"
      />

      <sell-token
        v-if="showSellModal"
        class="text-left"
        :close="onCloseSellModal"
        :nftToken="token"
        :refreshNFTTokens="refreshNFTTokens"
      />

      <send-token
        v-if="showSendModal"
        class="text-left"
        :close="onCloseSendModal"
        :nftToken="token"
        :refreshNFTTokens="refreshNFTTokens"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import getAxios from '~/plugins/axios'
import app from '~/plugins/app'
import { mapGetters } from 'vuex'

import NFTTokenModel from '~/components/model/nft-token'

import TokenShortInfo from '~/components/lego/token/token-short-info'
import WishlistButton from '~/components/lego/wishlist-button'
import BuyToken from '~/components/lego/modals/buy-token'
import SellToken from '~/components/lego/modals/sell-token'
import SendToken from '~/components/lego/modals/send-token'
import CancelConfirm from '~/components/lego/modals/cancel-confirm'

import rgbToHsl from '~/plugins/helpers/color-algorithm'
import ColorThief from 'color-thief'

import { providerEngine } from '~/plugins/helpers/provider-engine'
const colorThief = new ColorThief()

const imageExtensions = ['gif', 'png', 'svg', 'jpg', 'jpeg']

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
    contractAddress: {
      type: [Number, String],
      required: false,
    },
  },
  components: {
    TokenShortInfo,
    WishlistButton,
    BuyToken,
    SellToken,
    SendToken,
    CancelConfirm,
  },
  computed: {
    ...mapGetters('category', ['categories']),
    ...mapGetters('token', ['erc20Tokens']),
    ...mapGetters('auth', ['user']),
    ...mapGetters('network', ['networks']),
  },
  middleware: [],
  mixins: [],
})
export default class NftDetail extends Vue {
  bg = '#ffffff';
  showMore = false;
  showCategoryInfo = true;
  showProperties = true;

  isLoadingDetails = false;
  isLoading = false;
  showSellModal = false;
  showSendModal = false;
  isNotVideoFormat = false;

  token = {};

  // initialize
  async mounted() {
    await this.fetchNFTTokens()
  }

  onImageLoad() {
    try {
      const img = this.$el.querySelector('.asset-img')
      // img.crossOrigin = "Anonymous";

      const rgbColor = colorThief.getColor(img)
      if (rgbColor) {
        const hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2],
        })
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`
      } else {
        this.bg = '#ffffff'
      }
    } catch (error) {}
  }

  imageLoadError(event) {
    event.target.src = this.category.img_url
    event.target.style.width = '100px'
  }

  onCloseSellModal() {
    this.showSellModal = false
  }

  onCloseSendModal() {
    this.showSendModal = false
  }

  onSellToken() {
    this.showSellModal = true
  }

  onTransferToken() {
    this.showSendModal = true
  }

  async refreshNFTTokens() {
    this.$router.push({ name: 'account' })
  }

  checkImageFormat(imgUrl) {
    let imgExt = imgUrl.substr((imgUrl.lastIndexOf('.') + 1))
    if (imageExtensions.includes(imgExt)) {
      return true
    }

    return false
  }

  handleNotVideo() {
    const image = new Image()
    image.src = this.token.img_url
    image.onload = () => { this.isNotVideoFormat = true }
    image.onerror = () => {
      const image = document.createElement('img')
      image.src = this.category.img_url;
      document.querySelector('.feature-image').appendChild(image)
      image.style.width = '200px'
      image.style.height = '200px'
      image.classList.add("asset-img", "align-self-center")
      document.getElementsByTagName("VIDEO")[0].style.display = "none"
    }
  }

  // Get
  get category() {
    return this.categories.filter(
      (item) => item.id === this.token.categories_id,
    )[0]
  }

  get app() {
    return app
  }

  get tokenDescription() {
    return this.token.description
  }

  get tokenDescriptionFirstHalf() {
    return this.tokenDescription.slice(0, this.tokenDescription.length / 2)
  }

  get tokenDescriptionSecondHalf() {
    return this.tokenDescription.slice(
      this.tokenDescription.length / 2,
      this.tokenDescription.length,
    )
  }

  get openseaUrl() {
    return `https://opensea.io/assets/matic/${this.category.address}/${this.token.token_id}`
  }

  // async
  async fetchNFTTokens() {
    if (!this.tokenId || this.isLoadingDetails) {
      return
    }
    this.isLoadingDetails = true
    try {
      const response = await getAxios().get(
        `tokens/balance?userId=${this.user.id}&chainId=${this.chainId}`,
      )

      if (response.status === 200 && response.data.data) {
        // should use a endpoint that returns detail for just one token
        let currentToken = response.data.data.filter((token) => {
          return (
            token.token_id === this.tokenId &&
            token.contract.match(new RegExp(this.contractAddress, 'i'))
          )
        })

        if (currentToken.length > 0) {
          currentToken = currentToken[0]
        } else {
          return
        }

        currentToken.chainId = this.chainId
        const data = new NFTTokenModel(currentToken)
        this.token = data
      }
    } catch (error) {
      console.log(error)
    }
    this.isLoadingDetails = false
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
.opensea-icon {
  height: 64px;
  width: 64px;
}
.feature-info {
  &.mobile {
    min-height: auto;
  }

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
  &--dropdown {
    border: 1px solid light-color("500");
    border-radius: 6px;
    margin-bottom: 20px;

    .header-wrapper {
      background-color: light-color("500");
    }
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
    font-weight: 600;
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

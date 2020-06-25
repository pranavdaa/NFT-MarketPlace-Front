<template>
  <div class="container-fluid ps-y-16">
    <div class="row ps-y-16 ps-x-md-16">
      <div class="col-md-7 d-flex">
        <token-short-info class="align-self-center" />
      </div>
      <div class="col-md d-flex justify-content-start ps-t-16 ps-t-md-0 justify-content-md-end">
        <wishlist-button :onClick="(val) => val" />
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
            src="~/assets/img/navbar-logo.svg"
            alt="Kitty"
            @load="onImageLoad"
          />
        </div>
        <div class="feature-info mobile d-flex d-lg-none flex-column ps-16 ps-lg-40 ms-y-16">
          <h3 class="font-heading-medium font-semibold">About Magic Cat Lottery Ticket</h3>
          <p class="font-body-medium" :class="{'show-less': showMore, 'show-more': !showMore}">
            Meet 3,186 Emojis Published on the Blockchain with on-chain Power & Luck Scores Generated Dynamically
            <span
              class="dots"
            >...</span>
            <span
              class="more"
            >Meet 3,186 Emojis Published on the Blockchain with on-chain Power & Luck Scores Generated Dynamically</span>
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
          <div class="font-heading-large font-semibold ps-b-20">23.234 ETH</div>
          <button class="btn btn-primary">Buy Now</button>
        </div>
        <div class="d-flex flex-column ps-y-16 ps-y-md-32">
          <h3 class="font-heading-medium font-semibold category">
            About Cryptokitty
            <a
              class="ps-l-12"
              href
              target="_blank"
              rel="noopener noreferrer"
            >Visit Website</a>

            <span
              class="float-right cursor-pointer right-arrow"
              :class="{'down-icon':showCategoryInfo}"
              @click="showCategoryInfo = !showCategoryInfo"
            >
              <svg-sprite-icon name="right-arrow" />
            </span>
          </h3>
          <p
            class="font-body-medium ps-t-20"
            v-if="showCategoryInfo"
          >Dolore consequat id cupidatat reprehenderit aliquip velit in consectetur aliquip voluptate anim dolor cillum magna. Enim cupidatat laborum aute aliqua Lorem magna ut labore ex non do. Aliqua quis irure ut incididunt labore magna labore culpa et enim.</p>
        </div>
        <div class="d-flex flex-column ps-y-16 ps-y-md-32">
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
          <p
            class="font-body-medium ps-t-20"
            v-if="showProperties"
          >Dolore consequat id cupidatat reprehenderit aliquip velit in consectetur aliquip voluptate anim dolor cillum magna. Enim cupidatat laborum aute aliqua Lorem magna ut labore ex non do. Aliqua quis irure ut incididunt labore magna labore culpa et enim.</p>
        </div>
      </div>
      <div class="col-md-4 d-none d-lg-flex">
        <div class="feature-info d-flex flex-column ps-16 ps-lg-40">
          <h3 class="font-heading-medium font-semibold">About Magic Cat Lottery Ticket</h3>
          <p class="font-body-medium" :class="{'show-less': showMore, 'show-more': !showMore}">
            Meet 3,186 Emojis Published on the Blockchain with on-chain Power & Luck Scores Generated Dynamically
            <span
              class="dots"
            >...</span>
            <span
              class="more"
            >Meet 3,186 Emojis Published on the Blockchain with on-chain Power & Luck Scores Generated Dynamically</span>
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
          <div class="font-heading-large font-semibold ps-b-20">23.234 ETH</div>
          <button class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import TokenShortInfo from "~/components/lego/token/token-short-info";
import WishlistButton from "~/components/lego/wishlist-button";

import rgbToHsl from "~/plugins/helpers/color-algorithm";

import ColorThief from "color-thief";
const colorThief = new ColorThief();

@Component({
  props: {
    tokenId: {
      type: Number,
      required: false
    }
  },
  components: { TokenShortInfo, WishlistButton },
  middleware: [],
  mixins: []
})
export default class TokenDetail extends Vue {
  bg = "#ffffff";
  showMore = false;
  showCategoryInfo = true;
  showProperties = true;
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

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.feature-image {
  width: 100%;
  padding-top: 3.75rem;
  padding-bottom: 3.75rem;
  min-height: 500px;
  border-radius: $default-card-box-border-radius;
  .asset-img {
    min-width: 65%;
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

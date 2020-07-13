<template>
  <div class="col-md-12 d-flex ps-l-16 ms-y-8">
    <!-- <svg
      class="unread-mark align-self-center"
      width="5"
      height="5"
      viewBox="0 0 5 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="5" height="5" rx="2.5" fill="#003CB2" />
    </svg>-->
    <div class="d-flex align-self-center activity-wrapper">
      <div class="img-wrapper justify-content-center" v-bind:style="{background: bg}">
        <img
          class="asset-img align-self-center"
          src="~/static/img/dummy-kitty.png"
          alt="kitty"
          @load="onImageLoad"
        />
      </div>
      <svg-sprite-icon name="profile" class="profile-logo d-none d-md-block align-self-center"></svg-sprite-icon>
      <div class="d-flex message flex-column align-self-center ps-x-16 ps-l-md-0 ps-r-md-16">
        <div class="font-body-small">
          <a class="account-name">Account 84d</a> transferred
          <a class="nft-token">golden kitty</a> to you
        </div>
        <div class="font-caption text-gray-300">2 days ago</div>
      </div>
      <div class="d-flex ml-auto ms-r-16" v-if="false">
        <button class="btn btn-light align-self-center">View details</button>
      </div>
      <div class="d-flex ml-auto ms-r-16" v-if="true">
        <button class="btn btn-light btn-deny align-self-center ms-r-12" @click="onDeny()">Deny</button>
        <button class="btn btn-light align-self-center" @click="onAccept()">Accept</button>
      </div>
    </div>

    <accept-bid :show="showAcceptBid" :close="onAcceptClose" />
    <!-- <in-process :show="showInProcess" :close="onDenyClose" /> -->
    <!-- <token-list :show="showTokenList" :close="onDenyClose" /> -->
    <sell-token :show="showTokenList" :close="onDenyClose" />
    <!-- <submitting-to-marketplace :show="showTokenList" :close="onDenyClose" /> -->
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import AcceptBid from "~/components/lego/modals/accept-bid";
import InProcess from "~/components/lego/modals/in-process";
import TokenList from "~/components/lego/modals/token-list";
import SellToken from "~/components/lego/modals/sell-token";
import SubmittingToMarketplace from "~/components/lego/modals/submitting-to-marketplace";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

@Component({
  props: {},
  components: {
    AcceptBid,
    InProcess,
    TokenList,
    SellToken,
    SubmittingToMarketplace
  }
})
export default class ActivityRow extends Vue {
  bg = "#ffffff";
  showAcceptBid = false;
  showInProcess = false;
  showTokenList = false;

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

  onAccept() {
    this.showAcceptBid = true;
    console.log("On accept");
  }
  onAcceptClose() {
    this.showAcceptBid = false;
  }

  onDeny() {
    this.showTokenList = true;
  }

  onDenyClose() {
    this.showTokenList = false;
  }
}
</script>


<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
a {
  color: primary-color("600");
}
.unread-mark {
  margin-left: -14px;
  margin-right: 8px;
}

.activity-wrapper {
  width: 100%;
  background-color: light-color("600");
  border-radius: $default-card-box-border-radius;
  .img-wrapper {
    display: flex;
    width: 80px;
    min-height: 80px;
    padding: 0.5rem;
    border-radius: $default-card-box-border-radius;
    .asset-img {
      width: 100%;
    }
  }
  .profile-logo {
    width: 44px !important;
    height: 44px !important;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
.btn {
  height: fit-content !important;
  white-space: nowrap;
}
.btn-deny {
  color: red-color("600");
}
.text-gray-300 {
  color: dark-color("300");
}

@media (max-width: 768px) {
  .img-wrapper {
    width: 70px !important;
    min-height: 70px !important;
  }
}
@media (max-width: 580px) {
  .activity-wrapper {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .img-wrapper {
    display: none !important;
  }
}
@media (max-width: 440px) {
  .activity-wrapper {
    flex-direction: column;
    .message {
      margin-right: auto;
    }
  }
}
</style>
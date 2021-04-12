<template>
  <div class="col-md-12 d-flex ps-l-16 ms-y-8">
    <!-- <svg
      class="unread-mark align-self-center"
      width="5"
      height="5"
      viewBox="0 0 5 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      v-if="!activity.read"
    >
      <rect width="5" height="5" rx="2.5" fill="#003CB2" />
    </svg> -->
    <div class="d-flex align-self-center activity-wrapper ps-y-16">
      <div
        class="img-wrapper justify-content-center d-none"
        v-bind:style="{ background: bg }"
      ></div>
      <img
        :src="imgUrl"
        class="asset-img align-self-center profile-logo"
        :alt="activity.categories.img_url"
      />
      <div
        class="d-flex message flex-column align-self-center ps-x-16 ps-l-md-0 ps-r-md-16"
      >
        <div class="font-body-small" v-if="true">
          {{ activity.message }}
        </div>
        <div class="font-caption text-gray-300">
          {{ remainingTimeinWords }} ago
        </div>
      </div>
      <div class="d-flex ml-auto ms-r-16" v-if="true">
        <a
          :href="explorerLink"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-light align-self-center"
          >View details
        </a>
      </div>
      <div class="d-flex ml-auto ms-r-16" v-if="false">
        <button
          class="btn btn-light btn-deny align-self-center ms-r-12"
          @click="onDeny()"
        >
          Deny
        </button>
        <button class="btn btn-light align-self-center" @click="onAccept()">
          Accept
        </button>
      </div>
    </div>

    <!-- <accept-bid :show="showAcceptBid" :close="onAcceptClose" /> -->
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import moment from "moment";
import getAxios from "~/plugins/axios";

import AcceptBid from "~/components/lego/modals/bid-confirmation";
import OrderModel from "~/components/model/order";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
import app from "~/plugins/app";

const colorThief = new ColorThief();

@Component({
  props: {
    activity: {
      type: Object,
      required: true,
    },
  },
  components: {
    AcceptBid,
  },
})
export default class ActivityDepositWithdrawRow extends Vue {
  bg = "#ffffff";
  showAcceptBid = false;
  showInProcess = false;
  showTokenList = false;
  explorerLink = "";

  async mounted() {
    if (this.activity.type === 'DEPOSIT') {
      this.explorerLink =
        app.uiconfig.mainExplorer + "tx/" + this.activity.txhash;
    } else if (this.activity.type === "WITHDRAW") {
      if (this.activity.status === 0 || this.activity.status === 1) {
        this.explorerLink =
          app.uiconfig.maticExplorer + "tx/" + this.activity.txhash;
      } else if (this.activity.status === 2 || this.activity.status === 3) {
        this.explorerLink =
          app.uiconfig.mainExplorer + "tx/" + this.activity.exit_txhash;
      }
    }
  }

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
      } else {
        this.bg = "#ffffff";
      }
    } catch (error) {}
  }

  get imgUrl() {
    return `${app.uiconfig.apis.FILE_HOST}${this.activity.categories.img_url}`;
  }

  get timeRemaining() {
    const expiry = moment(this.activity.created);
    const current = moment();
    const diff = moment.duration(expiry.diff(current));

    return {
      days: Math.abs(diff.days()),
      hours: Math.abs(diff.hours()),
      mins: Math.abs(diff.minutes()),
      secs: Math.abs(diff.seconds()),
    };
  }

  get remainingTimeinWords() {
    let wordings = "";
    if (this.timeRemaining) {
      if (this.timeRemaining.days > 0) {
        wordings = `${this.timeRemaining.days} days`;
      } else if (this.timeRemaining.hours > 0) {
        wordings = `${this.timeRemaining.hours} hours`;
      } else if (this.timeRemaining.mins > 0) {
        wordings = `${this.timeRemaining.mins} mins`;
      } else if (this.timeRemaining.secs > 0) {
        wordings = `${this.timeRemaining.secs} seconds`;
      }
    }
    return wordings;
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

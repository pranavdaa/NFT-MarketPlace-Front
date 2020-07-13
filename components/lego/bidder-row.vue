<template>
  <div class="col-md-12 d-flex ps-x-0 ms-y-8">
    <div class="d-flex align-self-center bidder-wrapper ps-y-24">
      <svg-sprite-icon name="profile" class="profile-logo align-self-center"></svg-sprite-icon>
      <div class="d-flex message flex-column align-self-center ps-x-16 ps-l-md-0 ps-r-md-16">
        <div class="font-body-small">
          Bid by
          <a
            class="account-name"
            href
            @click.prevent
            :title="account.address"
          >{{account.shortChecksumAddress}}</a>
        </div>
        <div class="font-caption text-gray-300">2 days ago</div>
      </div>
      <div class="d-flex ml-auto ms-r-16 ps-t-16 ps-t-sm-0">
        <div class="ps-y-12 ps-x-16">
          <span class="ps-y-8 ps-x-16 font-body-small font-medium price-pill text-nowrap">22.4 ETH</span>
        </div>
        <button
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          @click="onDeny()"
        >Deny</button>
        <button class="btn btn-light align-self-center ps-x-16" @click="onAccept()">Accept</button>
      </div>
    </div>

    <accept-bid :show="showAcceptBid" :close="onAcceptClose" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

import AcceptBid from "~/components/lego/modals/accept-bid";

@Component({
  props: {},
  components: { AcceptBid },
  computed: {
    ...mapGetters("account", ["account"])
  }
})
export default class BidderRow extends Vue {
  showAcceptBid = false;
  mounted() {}

  onAccept() {
    this.showAcceptBid = true;
  }
  onAcceptClose() {
    this.showAcceptBid = false;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.bidder-wrapper {
  width: 100%;
  border: 1px solid light-color("500");
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
}
.price-pill {
  background-color: light-color("500");
  border-radius: 18px;
}
.profile-logo {
  width: 32px !important;
  height: 32px !important;
  margin-left: 1rem;
  margin-right: 1rem;
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
  .bidder-wrapper {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .profile-logo {
    display: none !important;
  }
}
@media (max-width: 440px) {
  .bidder-wrapper {
    flex-direction: column;
    .message {
      margin-right: auto;
    }
  }
}
</style>

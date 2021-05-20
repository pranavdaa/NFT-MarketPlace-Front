<template>
  <section>
    <div class="modal notification-wrapper show">
      <div class="align-self-center">
        <div class="modal-dialog w-sm-100" role="document">
          <div class="box info-box">
            <div class="box-body">
              <div class="container ps-x-20">
                <span
                  class="position-absolute modal-close cursor-pointer"
                  @click="closeModal"
                >
                  <svg-sprite-icon
                    name="close"
                    class="align-self-center float-left cursor-pointer"
                  />
                </span>
                <div class="banner-img text-center ps-t-40">
                  <img
                    src="~/assets/svg/swap.svg"
                    alt="notification banner"
                  />
                </div>
                <div class="banner-info ps-y-24">
                  <div class="banner-info__title text-center" v-if="false">
                  </div>
                  <div class="banner-info__desc text-center ps-x-4 ps-t-12">
                    <span class="text-highlight">WETH &lt;&gt; PoS-ETH Swap</span> is now available at <a href="https://wallet.matic.network/" target="_blank" rel="noopener noreferrer">wallet.matic.network</a>. Those who incorrectly deposited WETH from Ethereum to Matic can use this to get the PoS-ETH. PoS-ETH is needed for trading on <a href="https://matic.opensea.io/" rel="noopener noreferrer">matic.opensea.io</a>.
                    <br/> <br/>
                    <span class="text-highlight">Please Note:</span> Depositing Ether from Ethereum to Matic using <a href="https://wallet.matic.network/" target="_blank" rel="noopener noreferrer">wallet.matic.network</a> will give you PoS-ETH on Matic.
                  </div>
                  <div
                    class="banner-info__action text-center ps-t-32"
                  >
                    <button class="btn text-white" @click="closeModal">Okay</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop show" />
  </section>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  props: {}
})
export default class NotificationBanner extends Vue {
  closeModal() {
    this.$emit('close');
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.box-body {
  font-family: Graphik;
}

.modal-close {
  right: 0;
  padding: 1rem 1rem 0 0;
}

.modal-dialog {
  @media #{$md-devices} {
    margin: 0.5rem;
    width: 500px;
  }

  .info-box {
    @media #{$md-devices} {
      height: 400px;
    }
  }

  .banner-img {
    img {
      width: 50px;
    }
  }
}

.banner-info {
  &__title {
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: -0.02em;
    color: dark-color("700");
  }

  &__desc {
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: -0.02em;
    color: dark-color("500");
  }

  &__action {
    button {
      background: primary-color("500");
      border-radius: 5px;
      font-family: $font-family-base;
      font-size: 1rem;
      font-weight: 500;
      line-height: 19px;
      height: 50px;
      width: 136px;
    }
  }
}

.notification-wrapper {
  z-index: 1030;
}

.modal-backdrop {
  z-index: 1025;
}

.text-highlight {
  font-weight: 500;
}

img {
  width: 100%;
}
</style>

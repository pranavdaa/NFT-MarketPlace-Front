<template>
  <section>
    <div
      class="deposit-weth modal fade show"
      v-if="show"
      :class="{ 'hide-modal': showReceiveModal }"
    >
      <div class="modal-dialog">
        <div class="box">
          <div class="box-body">
            <div class="ps-16 ps-md-32 box-header">
              <span
                class="heading-title text-center font-heading-medium font-semibold col"
                >{{ $t("account.deposit.title") }}</span
              >
              <div class="align-self-center cursor-pointer" @click="close()">
                <svg-sprite-icon
                  name="close"
                  class="close align-self-center cursor-pointer"
                />
              </div>
            </div>

            <div class="container">
              <div
                class="row ps-x-md-32 ps-y-md-32 ps-y-32 ps-x-16 d-flex justify-content-center"
              >
                <a
                  class="option-box d-flex flex-row my-2"
                  href="https://transak.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div><img src="~assets/svg/buy-from-transak.svg" /></div>
                  <div class="option-right d-flex flex-column">
                    <div class="title">
                      {{ $t("account.deposit.options.buy.title") }}
                    </div>
                    <div class="description pt-2">
                      {{ $t("account.deposit.options.buy.description") }}
                    </div>
                  </div>
                </a>
                <a
                  class="option-box d-flex flex-row my-2"
                  href="http://wallet.matic.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div><img src="~assets/svg/deposit-from-mainnet.svg" /></div>
                  <div class="option-right d-flex flex-column">
                    <div class="title">
                      {{ $t("account.deposit.options.deposit.title") }}
                    </div>
                    <div class="description pt-2">
                      {{ $t("account.deposit.options.deposit.description") }}
                    </div>
                  </div>
                </a>
                <div
                  class="option-box d-flex flex-row my-2"
                  @click="showReceiveModal = true"
                >
                  <div><img src="~assets/svg/transfer-from-wallet.svg" /></div>
                  <div class="option-right d-flex flex-column">
                    <div class="title">
                      {{ $t("account.deposit.options.transfer.title") }}
                    </div>
                    <div class="description pt-2">
                      {{ $t("account.deposit.options.transfer.description") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-bind:class="{ show: show }"></div>

    <receive-qr-code
      :show="showReceiveModal"
      :close="closeReceiveModal"
      :uri="account.address"
    ></receive-qr-code>
  </section>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

import Component from "nuxt-class-component";
import ReceiveQrCode from "~/components/lego/receive-qr-code";

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
    close: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      showReceiveModal: false,
    };
  },
  components: { ReceiveQrCode },
  computed: {
    ...mapGetters("account", ["account"]),
  },
  methods: {
    closeReceiveModal() {
      this.showReceiveModal = false;
    },
  },
})
export default class DepositWeth extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.hide-modal {
  opacity: 0;
}

.box {
  max-width: 552px;
  width: 100%;
}

.modal-dialog {
  max-width: 552px;
}

.option-box {
  border: 1px solid light-color("400");
  border-radius: 8px;
  cursor: pointer;
  padding: 32px;

  .option-right {
    margin-left: 32px;
    .title {
      @include font-setting("heading-medium", "semibold");
      color: dark-color("700");
    }
    .description {
      @include font-setting("body-small", "regular");
      color: dark-color("500");
    }
  }
}
</style>

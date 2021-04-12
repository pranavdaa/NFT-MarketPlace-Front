<template>
  <section>
    <div
      v-if="show"
      class="modal fade show"
    >
      <div class="modal-dialog align-self-center">
        <div class="box">
          <div class="box-body">
            <div class="ps-16 ps-md-32 box-header">
              <span
                class="font-heading-medium font-semibold col"
              >My QR Code</span>
              <div
                class="align-self-center cursor-pointer"
                @click="close()"
              >
                <svg-sprite-icon
                  name="close"
                  class="close align-self-center cursor-pointer"
                />
              </div>
            </div>

            <div class="container">
              <div
                class="row ps-x-md-32 ps-y-md-60 ps-y-32 ps-x-16 d-flex justify-content-center"
              >
                <div
                  v-if="qrValue"
                  class="qrcode-container align-self-center mt-4"
                >
                  <Qrcode
                    class="d-flex"
                    :value="qrValue"
                    :options="{ size: 200 }"
                  />
                </div>
                <div
                  class="col-12 font-body-small text-center text-muted ps-t-8"
                >
                  Wallet address
                </div>
                <div
                  class="col-12 font-body-small text-center font-medium ps-t-8"
                >
                  {{ qrValue }}
                </div>
              </div>

              <div class="row justify-content-center wallet-download-info p-0">
                <div class="col-12 text-gray font-caption text-center ps-b-20">
                  Only send ethereum and your ERC20 tokens to this address.
                  sending other token will result in permanent loss.
                </div>
                <div
                  class="col-12 p-0"
                  @click="copyAddress()"
                >
                  <button
                    v-if="copyAnim === false"
                    class="btn btn-primary ps-20 btn-block no-border no-top-border-radius"
                  >
                    Copy Address
                  </button>

                  <button
                    v-if="copyAnim === true"
                    class="btn btn-block no-border no-top-border-radius"
                  >
                    <lottie
                      class="copy-anim align-self-center"
                      :options="defaultOptions"
                      :width="45"
                      :height="45"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop"
      :class="{ show: show }"
    />
  </section>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode'
import Vue from 'vue'
import copy from 'copy-to-clipboard'
import Lottie from 'vue-lottie'

import * as animationData from '~/static/lottie-animations/green-check.json'

import Component from 'nuxt-class-component'

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
    uri: {
      type: String,
      required: true,
    },
    close: {
      type: Function,
      required: false,
      default: function() {
        this.show = false
      },
    },
  },
  data() {
    return {
      defaultOptions: { animationData: animationData.default, loop: false },
      animationSpeed: 2,
    }
  },
  components: {
    Qrcode: VueQrcode,
    Lottie,
  },

  computed: {},
  methods: {},
})
export default class ReceiveQrCode extends Vue {
  copyAnim = false;
  mounted() {}

  copyAnimation(show) {
    this.copyAnim = show
  }

  copyAddress() {
    this.copyAnimation(true)
    copy(this.qrValue)
    setTimeout(() => {
      this.copyAnimation(false)
    }, 3000)
  }

  get qrValue() {
    if (this.uri) {
      return this.uri
    }
    return null
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.box {
  max-width: 446px;
  width: 100%;
}

.qrcode-container {
  border-radius: 5px;
}

.modal-dialog {
  max-width: 446px;
}

.wallet-download-info {
  padding: 32px 10px;
  color: dark-color("100");
}
.btn-block {
  border: 12px;
}
</style>

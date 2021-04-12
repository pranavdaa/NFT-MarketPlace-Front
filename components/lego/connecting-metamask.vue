<template>
  <section>
    <div
      v-if="loaded"
      class="modal fade show"
    >
      <div class="modal-dialog">
        <div class="box">
          <div class="box-body">
            <div class="ps-16 ps-md-32 box-header">
              <span
                class="font-heading-medium font-semibold col text-center"
              >Metamask</span>
            </div>

            <div class="container">
              <div class="row ps-x-32 ps-y-60 d-flex justify-content-center">
                <div class="qrcode-container align-self-center m-4">
                  <img
                    height="96"
                    width="96"
                    src="~/assets/img/metamask-big.svg"
                    alt="Connecting to metamask"
                  >
                </div>
                <div
                  class="col-12 font-body-small text-center text-muted ps-t-8"
                >
                  Waiting for confirmation from Metamask
                </div>
              </div>

              <!-- <div class="row justify-content-center wallet-download-info">
                Don't have wallet?
                <a
                  href="https://matic.network/wallet"
                  class="link-color ps-l-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >Download here</a>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop"
      :class="{ show: loaded }"
    />
  </section>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    loaded: { type: Boolean, required: true },
  },
  components: {},
  middleware: [],
  mixins: [],
})
export default class ConnectingMetamask extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.modal-dialog {
  max-width: 446px;
}

// .wallet-download-info {
//   border-top: 1px solid light-color("400");
//   padding: 32px 10px;
//   color: dark-color("100");
//   @include font-setting("body-medium", "medium");
// }
</style>

<template>
  <div class="section position-absolute">
    <div
      class="modal-backdrop"
      :class="{ show: show }"
    />
    <div
      class="modal transaction-prog-modal"
      :class="{ show: show }"
    >
      <div
        class="modal-dialog w-sm-100 align-self-center"
        role="document"
      >
        <div class="box in-process-box">
          <div class="box-body">
            <div class="container-fluid">
              <div class="row ps-y-60 ps-y-sm-80">
                <div class="col-md-12 d-flex justify-content-center">
                  <lottie
                    :options="defaultOptions"
                    :width="264"
                    :height="264"
                    class="process"
                  />
                </div>
                <div class="col-md-12 text-center">
                  <div class="font-heading-medium font-semibold ps-t-28">
                    Transaction in process
                  </div>
                  <div class="font-body-small ps-t-4 message">
                    Wait for your transaction to complete.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import Lottie from 'vue-lottie'
import * as animationData from '~/static/lottie-animations/ripple-loader.json'

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { Lottie },
  data() {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
    }
  },
  methods: {},
  mixins: [],
})
export default class InProcess extends Vue {
  transactions = [];

  mounted() {}
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.message {
  color: dark-color("500");
}

.box {
  max-width: 446px;
  width: 100%;
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;
  }
}
@media (max-width: 446px) {
  .box {
    max-width: 100%;
  }
}
</style>

<template>
  <div class="section position-absolute">
    <div class="modal receive-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box deposit-box">
          <div class="box-header justify-content-center">
            <div
              class="font-heading-medium font-semibold align-self-center w-100 text-center"
            >{{$t('withdraw.title')}}</div>
            <span
              @click="onCancel()"
              class="left-arrow align-self-center float-right cursor-pointer"
            >
              <svg-sprite-icon
                name="close"
                class="close align-self-center float-left cursor-pointer"
              ></svg-sprite-icon>
            </span>
          </div>
          <div class="box-body">
            <div class="container p-0">
              <div class="col-12 ps-x-40 ps-b-20 ps-t-16 container-wrapper font-body-small">
                <div
                  class="ps-b-20 ps-t-18 text-white"
                >{{selectedTokens.length || 0}} Collectibles selected</div>
                <div class="container card-list hide-scrollbar d-flex p-0">
                  <div
                    class="token-img d-flex ms-x-6 ps-4 justify-content-center"
                    v-for="token in selectedTokens"
                    :key="token.token_id"
                  >
                    <img class="align-self-center" :src="token.img_url" :alt="token.name" />
                  </div>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row ps-x-40 ps-b-60">
                <div class="col-12 p-0">
                  <div class="mark-wrapper check float-left">
                    <img src="~/static/img/green-check.svg" alt="Green Check" />
                  </div>
                  <div class="float-left body-medium ps-2 ms-l-12">{{$t('withdraw.steps.init')}}</div>
                </div>
                <div class="col-12 p-0">
                  <div class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24"></div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{'check': transactionStatus >= initiated}"
                  >
                    <img
                      v-if="transactionStatus >= inCheckpoint"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    />
                    <img
                      v-if="transactionStatus === initiated && transactionStatus !== inCheckpoint"
                      src="~/static/img/yellow-check.svg"
                      alt="Green Check"
                    />
                  </div>
                  <div
                    class="float-left body-medium ps-2 ms-l-12"
                  >{{$t('withdraw.steps.checkpoint')}}</div>
                  <!--  -->
                </div>
                <div class="col-12 p-0" v-if="transactionStatus === initiated">
                  <div
                    class="float-left process-msg text-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24 ps-b-16 ps-t-4"
                  >{{$t('withdraw.process.checkpointWait')}}</div>
                </div>
                <div class="col-12 p-0" v-if="transactionStatus === inCheckpoint && !isPoS">
                  <div
                    class="float-left process-msg text-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24 ps-b-16 ps-t-4"
                  >{{$t('withdraw.process.checkpointed')}}</div>
                </div>
                <div class="col-12 p-0" v-if="transactionStatus >= inCheckpoint && isPoS">
                  <div
                    class="float-left process-msg text-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24 ps-b-16 ps-t-4"
                  >{{$t('withdraw.process.posCheckpointed')}}</div>
                </div>
                <div class="col-12 p-0" v-if="transactionStatus > inCheckpoint && !isPoS">
                  <div class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24"></div>
                </div>
                <div class="col-12 p-0" v-if="!isPoS">
                  <div
                    class="mark-wrapper float-left"
                    :class="{'check': transactionStatus >= confirmed}"
                  >
                    <img
                      v-if="transactionStatus === confirmed"
                      src="~/static/img/yellow-check.svg"
                      alt="yellow Check"
                    />
                    <img
                      v-if="transactionStatus === challengePeriodEnded"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    />
                  </div>
                  <div
                    class="float-left body-medium ps-2 ms-l-12"
                  >{{$t('withdraw.steps.challengePeriod')}}</div>
                </div>
                <div class="col-12 p-0" v-if="!isPoS">
                  <div
                    class="float-left process-msg text-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24 ps-b-16 ps-t-4"
                    v-if="transactionStatus < challengePeriodEnded"
                  >{{$t('withdraw.process.challengeWait', {challengePeriod:challengePeriodInWords})}}.</div>
                  <div
                    class="float-left process-msg text-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24 ps-b-16 ps-t-4"
                    v-if="transactionStatus === challengePeriodEnded"
                  >{{$t('withdraw.process.challengeEnd')}}</div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{'check': transactionStatus === challengePeriodEnded && (isLoading || isExited ) }"
                  >
                    <img
                      v-if="isLoading && transactionStatus === challengePeriodEnded && !isExited"
                      src="~/static/img/yellow-check.svg"
                      alt="yellow Check"
                    />
                    <img
                      v-if="transactionStatus === challengePeriodEnded && !isLoading && isExited"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    />
                  </div>
                  <div class="float-left body-medium ps-2 ms-l-12">{{$t('withdraw.steps.finished')}}</div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 ps-x-32 text-center text-red">
                  <div class="font-body-small text-red text-center mx-auto" v-html="error"></div>
                </div>
              </div>
              <div class="row p-0">
                <div class="col-12 p-0 d-flex justify-content-space-between">
                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    :text="'Confirm Withdraw'"
                    color="primary"
                    :loadingText="'Confirming withdraw'"
                    :loading="isLoading"
                    :click="confirmWithdraw"
                    v-if="(transactionStatus === 2 || transactionStatus === 1)  && !isPoS"
                    :disabled="(transactionStatus === 1 || transactionStatus === 0)  && !isPoS"
                  ></button-loader>

                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    :text="'Finish Withdraw'"
                    color="primary"
                    :loading="isLoading"
                    :click="processExits"
                    :loadingText="'Finishing withdraw'"
                    v-if="transactionStatus >= 3 && !isExited && !isPoS"
                    :disabled="transactionStatus === 3 && !isPoS"
                  ></button-loader>

                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    :text="'Finish Withdraw'"
                    color="primary"
                    :loading="isLoading"
                    :click="PoSProcessExit"
                    :loadingText="'Finishing withdraw'"
                    v-if="transactionStatus >= initiated && isPoS"
                    :disabled="transactionStatus <= inCheckpoint"
                  ></button-loader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import app from "~/plugins/app";

const status = {
  INITIATED: 1,
  CHECKPOINTED: 2,
  EXITED: 3,
};

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
    selectedTokens: {
      type: Array,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
  },
  components: {},
  methods: {},
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
  },
})
export default class WithdrawConfirmationModal extends Vue {
  selectToken = false;
  isLoading = false;
  isExited = false;
  error = null;
  initiated = 1;
  inCheckpoint = 3;
  challengePeriodEnded = 5;
  confirmed = 7;
  transactionStatus = 7;
  isPoS = true;

  async mounted() {}

  async confirmWithdraw() {
    try {
    } catch (error) {}
  }

  async PoSProcessExit() {
    try {
    } catch (error) {}
  }

  // Getter
  get status() {
    return status;
  }

  onCancel() {
    this.cancel();
  }

  get parentNetwork() {
    return this.networks.main;
  }

  get childNetwork() {
    return this.networks.matic;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.deposit-box {
  width: 446px;
}

@media (max-width: 446px) {
  .deposit-box {
    width: 100%;
  }
}
.label {
  color: dark-color("500");
}
.amount {
  color: dark-color("700");
}

.bottom-border {
  border-bottom: 1px solid light-color("500");
}

.mark-wrapper:not(.check) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid light-color("400");
  margin: 2px;
}
.mark-wrapper.check {
  width: 24px;
  height: 24px;
}

.process-msg {
  border-left: 1px solid light-color("400");
  min-height: 18px;
}
.text-gray {
  color: dark-color("300");
}
.text-red {
  color: red-color("600");
}

.btn-pay {
  border-radius: 12px;
}

.container-wrapper {
  background: dark-color("300");
  text-align: left;
  margin-bottom: 24px;

  .card-list {
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.token-img {
  min-width: 76px;
  min-height: 76px;
  width: 76px;
  height: 76px;
  background: white;
  border-radius: 10px;

  img {
    max-height: 76px;
    max-width: 76px;
    height: 100%;
    width: auto;
  }
}
</style>
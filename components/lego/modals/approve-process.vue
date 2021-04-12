<template>
  <section>
    <div class="modal fade show">
      <div class="modal-dialog align-self-center">
        <div class="box">
          <div class="box-body">
            <div class="ps-16 ps-md-32 box-header">
              <span
                class="font-heading-medium font-semibold col"
              >Transactions</span>
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
              <div class="ps-x-20 ps-y-32">
                <div class="row">
                  <div class="col-2">
                    <div class="status-check">
                      <svg-sprite-icon
                        v-if="isApprovedStatus === false"
                        name="status-undone"
                        class="icon"
                      />
                      <svg-sprite-icon
                        v-else
                        name="status-done"
                        class="icon"
                      />
                    </div>
                  </div>
                  <div class="col-10">
                    <div class="status-title font-heading-medium">
                      {{ modalTexts.approve.title }}
                    </div>
                    <div class="status-desc font-body-small ps-t-6">
                      {{ modalTexts.approve.subText }}
                    </div>

                    <button-loader
                      class="ps-t-20"
                      :text="'Approve'"
                      :loadingText="'Approving...'"
                      block
                      primary
                      lg
                      color="primary"
                      :loading="approveLoading"
                      :disabled="approveLoading || isApproved === true"
                      :click="approveConfirm"
                    />
                    <div
                      v-if="networkChangeNeeded === true"
                      class="text-danger mx-auto text-center font-body-small"
                    >
                      Please select Matic Mainnet in Metamask <br>
                      <a
                        href="https://docs.matic.network/docs/develop/metamask/config-matic/#matic-mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        (guide)
                      </a>
                    </div>
                  </div>
                </div>

                <div class="row ps-t-32">
                  <div class="col-2">
                    <div class="status-check">
                      <svg-sprite-icon
                        v-if="isSignedStatus === false"
                        name="status-undone"
                        class="icon"
                      />
                      <svg-sprite-icon
                        v-else
                        name="status-done"
                        class="icon"
                      />
                    </div>
                  </div>
                  <div class="col-10">
                    <div class="status-title font-heading-medium">
                      {{ modalTexts.sign.title }}
                    </div>
                    <div class="status-desc font-body-small ps-t-6">
                      {{ modalTexts.sign.subText }}
                    </div>

                    <button-loader
                      class="ps-t-20"
                      :text="'Sign'"
                      :loadingText="'Signing...'"
                      block
                      primary
                      lg
                      color="primary"
                      :loading="signLoading"
                      :disabled="
                        isApproved === false ||
                          signLoading === true ||
                          isSigned === true
                      "
                      :click="signConfirm"
                    />
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
import Vue from 'vue'

import Component from 'nuxt-class-component'

@Component({
  props: {
    close: {
      type: Function,
      required: false,
    },
    approveClicked: {
      type: Function,
      required: false,
    },
    signClicked: {
      type: Function,
      required: false,
    },
    isApprovedStatus: {
      type: Boolean,
      required: false,
    },
    isSignedStatus: {
      type: Boolean,
      required: false,
    },
    approveLoading: {
      type: Boolean,
      required: false,
    },
    signLoading: {
      type: Boolean,
      required: false,
    },
    modalTexts: {
      type: Object,
      required: false,
    },
    networkChangeNeeded: {
      type: Boolean,
      required: false,
    },
  },
})
export default class ApproveProcess extends Vue {
  mounted() {}

  approveConfirm() {
    this.approveClicked()
  }

  signConfirm() {
    this.signClicked()
  }

  get isApproved() {
    return this.isApprovedStatus
  }

  get isSigned() {
    return this.isSignedStatus
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.modal-dialog {
  max-width: 446px;
}

.box {
  max-width: 446px;
  width: 446px;
}

.status-check {
  height: 55px;
  width: 55px;

  .icon {
    height: 100%;
    width: 100%;
  }
}

.status-title {
  color: dark-color("700");
  font-weight: 600;
}

.status-desc {
  color: dark-color("500");
}

@media (max-width: 446px) {
  .box {
    max-width: 100%;
  }
}
</style>

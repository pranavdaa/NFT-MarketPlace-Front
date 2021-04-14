<template>
  <section>
    <div
      v-if="show"
      class="modal fade show"
    >
      <div class="modal-dialog">
        <div class="box">
          <div class="box-body">
            <div class="ps-16 ps-md-32">
              <div
                class="align-self-center cursor-pointer ml-auto"
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
                class="row ps-16 w-100 mx-auto ps-md-32 pt-0 d-flex justify-content-center"
              >
                <div class="align-self-center mt-4">
                  <img
                    src="~/assets/svg/logout.svg"
                    alt="Matic Marketplace"
                  >
                </div>
                <div
                  class="col-12 font-heading-medium font-semibold text-center ps-t-32"
                >
                  {{ $t("logout.logoutQuestion") }}
                </div>
              </div>
              <div class="row w-100 mx-auto ps-x-md-32 ps-x-16 ps-b-32">
                <div class="col-6">
                  <button
                    class="btn btn-light btn-block"
                    @click="close()"
                  >
                    {{ $t("cancel") }}
                  </button>
                </div>
                <div class="col-6">
                  <button
                    class="btn btn-primary btn-block"
                    @click="logout()"
                  >
                    {{ $t("logout.okay") }}
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
import Vue from 'vue'

import Component from 'nuxt-class-component'

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
    logout: {
      type: Function,
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
})
export default class LogoutConfirm extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.box {
  max-width: 446px;
  width: 100%;
}
</style>

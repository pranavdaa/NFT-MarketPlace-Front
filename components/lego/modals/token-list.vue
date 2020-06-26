<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
    <div class="modal add-token-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box token-list-box">
          <div class="box-header text-center font-heading-medium font-semibold">
            Choose token
            <div class="close-wrapper" @click="close()">
              <svg-sprite-icon name="close-modal" class="close" />
            </div>
          </div>
          <div class="box-body">
            <div class="container-fluid p-0">
              <div class="table table-wrapper no-border selectable">
                <div class="table">
                  <div class="table-body">
                    <div class="d-flex justify-content-center" v-if="userERC20Tokens.length == 0">
                      <span class="ps-32">No Tokens</span>
                    </div>
                    <div
                      class="table-row no-border p-0"
                      v-for="token in userERC20Tokens"
                      :key="token.id"
                    >
                      <div
                        class="table-row-in-row bottom-separator ps-l-0 ps-r-md-20 ps-r-4 ms-l-lg-32 ms-l-16 w-100"
                      >
                        <div class="table-column col ps-l-0 d-flex">
                          <div class="token-img d-flex justify-content-center align-self-center">
                            <img
                              class="align-self-center"
                              v-bind:src="tokenImage(token.symbol)"
                              :alt="token.name"
                            />
                          </div>
                          <div class="align-self-center d-flex flex-column ps-l-16">
                            <span class="font-body-medium font-medium">{{token.name}}</span>
                            <span class="font-body-medium text-gray">{{token.symbol}}</span>
                          </div>
                        </div>
                        <div class="table-column col ml-auto ms-r-md-8 ms-r-0 justify-content-end">
                          <div class="text-right d-flex flex-column">
                            <span class="font-body-medium font-medium">${{"120.4"}}</span>
                            <span class="text-gray font-body-medium mt-1">{{"2.2"}} {{token.symbol}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  components: {}
})
export default class TokenList extends Vue {
  userERC20Tokens = [
    {
      id: 0,
      name: "Matic",
      symbol: "MATIC"
    },
    {
      id: 1,
      name: "Matic",
      symbol: "MATIC"
    },
    {
      id: 2,
      name: "Matic",
      symbol: "MATIC"
    },
    {
      id: 3,
      name: "Matic",
      symbol: "MATIC"
    },
    {
      id: 4,
      name: "Matic",
      symbol: "MATIC"
    },
    {
      id: 5,
      name: "Matic",
      symbol: "MATIC"
    }
  ];
  mounted() {}

  tokenImage(token) {
    return require("~/static/tokens/" + token.toUpperCase() + ".svg");
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.token-img {
  height: 48px;
  width: 48px;
  border: 1px solid light-color("500");
  box-sizing: border-box;
  border-radius: 50%;
  img {
    height: 32px;
    width: 32px;
  }
}

.table-body .table-row:last-child {
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}

.box {
  max-width: 446px;
  width: 446px;
  .box-header {
    position: relative;
  }
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;

    max-height: 500px;
    height: 100%;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  .close-wrapper {
    top: 20px;
    right: 20px;
    z-index: 1;
    position: absolute;
    cursor: pointer;
    .close {
      width: 38px !important;
      height: 38px !important;
    }
  }
}
@media (max-width: 446px) {
  .box {
    max-width: 100%;
  }
}
</style>
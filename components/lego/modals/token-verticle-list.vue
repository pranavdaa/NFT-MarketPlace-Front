<template>
  <div class="row ps-y-10">
    <div class="col-12 d-flex ps-y-16 font-body-small">
      <div class="left d-flex col align-self-center">
        <img
          class="cate-icon align-self-center ms-r-8"
          :src="category.img_url"
          :alt="category.name"
        />
        <span
          class="align-self-center ps-t-2"
        >{{tokens && tokens.length || 0}} {{category.name}} Collectibles</span>
      </div>
      <div
        class="right ms-x-16 check-container"
        :class="{'checked': isAllSelected}"
        @click="selectAll()"
      >
        <input type="checkbox" name="all" id="all" :checked="isAllSelected" />
        <span class="checkmark align-self-center"></span>
        <label class="form-check-label cursor-pointer align-self-center ps-l-28 ps-t-2">Select all</label>
      </div>
    </div>
    <div class="col-12 card-wrapper hide-scrollbar">
      <div
        class="row no-gutters card-container mt-1 mb-2"
        v-for="token in allTokens"
        :key="token.id"
        :class="{ 'active': token.isSelected}"
      >
        <div class="col-3">
          <div class="token-img d-flex justify-content-center">
            <img :src="token.img_url" :alt="token.name" class="asset-img align-self-center" />
          </div>
        </div>
        <div class="col-7 d-flex flex-column justify-content-center text-left">
          <div class="card-name font-medium">{{ token.name }}</div>
          <div class="card-category">{{ token.category.name }}</div>
        </div>
        <div class="col-2 d-flex justify-content-center">
          <div
            class="check-container align-self-center"
            :class="{'checked': token.isSelected}"
            @click="onChangeSelection(token)"
          >
            <input type="checkbox" :checked="token.isSelected" />
            <span class="checkmark align-self-center"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 p-0 transaction-details">
      <div class="top ps-t-12 ps-b-12 border-top">
        <div class="transaction-details__inner d-flex">
          <div class="left col-8">
            <img
              class="cate-icon align-self-center ms-r-8"
              :src="category.img_url"
              :alt="category.name"
            />
            <span class="align-self-center ps-t-2">Collectibles selected</span>
          </div>
          <div class="right count col-4">{{selectedTokenIds.length || 0}}</div>
        </div>
      </div>
      <div class="bottom d-none ps-t-12 ps-b-12 border-top">
        <div class="transaction-details__inner d-flex">
          <div class="left col-8">
            <img src="~/static/img/est-bolt.svg" alt="Bolt" />
            Estimated Transacton fee
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import { VueWatch } from "~/components/decorator";

@Component({
  props: {
    tokens: {
      type: Array,
      required: true,
    },
    category: {
      type: Object,
      required: true,
    },
    preSelectedTokens: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
    onSelectionChange: {
      type: Function,
      required: true,
    },
  },
  components: {},
  computed: {
    ...mapGetters("token", ["erc20Tokens", "selectedERC20Token"]),
    isSelected() {
      return this.isSelectedAll;
    },
  },
  methods: {},
})
export default class TokenVerticleList extends Vue {
  isAllSelected = false;
  allSelected = false;
  selectedTokens = [];

  async mounted() {}

  @VueWatch("preSelectedTokens", { immediate: true, deep: true })
  onPreselectedTokens(val) {
    this.selectedTokens = this.preSelectedTokens;
  }

  notifyChange() {
    if (this.onSelectionChange) this.onSelectionChange(this.selectedTokens);
  }

  // Getters
  get selectedTokenIds() {
    let token_ids = [];
    if (this.selectedTokens && this.selectedTokens.length > 0) {
      this.selectedTokens.forEach((token) => token_ids.push(token.token_id));
    }
    return token_ids;
  }
  get allTokens() {
    let tokens = [];
    if (this.tokens) {
      this.tokens.forEach((token) => {
        token.isSelected = this.selectedTokenIds.includes(token.token_id);
        tokens.push(token);
      });
      return tokens;
    }
  }

  // Handlers
  onChangeSelection(token) {
    if (
      this.selectedTokenIds &&
      this.selectedTokenIds.length > 0 &&
      this.selectedTokenIds.includes(token.token_id)
    ) {
      this.selectedTokens = this.selectedTokens.filter(
        (t) => t.token_id != token.token_id
      );
    } else {
      this.selectedTokens.push(token);
    }

    if (this.selectedTokens.length === this.tokens.length) {
      this.isAllSelected = true;
    } else {
      this.isAllSelected = false;
    }
    this.notifyChange();
  }
  selectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.tokens && this.isAllSelected) {
      this.selectedTokens = this.tokens;
    } else {
      this.selectedTokens = [];
    }
    this.notifyChange();
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.asset-img {
  max-width: 76px;
  max-height: 76px;
  height: auto;
  width: auto;
}
.cate-icon {
  height: 24px;
  width: 24px;
}

.left {
  color: dark-color("500");
  line-height: 22px;
  text-align: left;
}
.right {
  color: dark-color("500");
  line-height: 22px;
  text-align: right;
}
.count {
  color: dark-color("700");
}
.border-top,
.box-header {
  border-color: light-color("500") !important;
}

.check-container {
  min-height: 22px;
  min-width: 22px;
}

.card {
  &-wrapper {
    max-height: 350px;
    overflow: scroll;
  }

  &-container {
    background: light-color("600");
    border-radius: 12px;
    margin-left: 15px;
    margin-right: 15px;

    &.active {
      background: primary-color("100");
    }

    .token-img {
      width: 76px;
      height: 76px;
      margin: 2px;
      border-radius: 10px;
      background: light-color("700");

      @media (max-width: 446px) {
        width: 55px;
        height: 55px;
      }

      img {
        height: 100%;
        width: auto;
        padding: 5px;
        margin: 0;
      }
    }
  }

  &-name {
    color: dark-color("700");
  }

  &-category {
    color: dark-color("300");
  }
}
</style>
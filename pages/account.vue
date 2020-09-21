<template>
  <div class="container-fluid">
    <account-banner />
    <tab-switcher class="sticky-top" :tabs="tabs" :activeTab="activeTab" :onChangeTab="changeTab" />
    <div class="row">
      <matic-new-tab v-if="activeTab === 0" />
      <ethereum-new-tab v-if="activeTab === 1" />
      <favorite-tab v-if="activeTab === 2" />
      <activity-tab v-if="activeTab === 3" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import getAxios from "~/plugins/axios";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import AccountBanner from "~/components/lego/account/account-banner";
import TabSwitcher from "~/components/lego/tab-switcher";
import MaticNewTab from "~/components/lego/account/matic-new-tab";
import EthereumNewTab from "~/components/lego/account/ethereum-new-tab";
import FavoriteTab from "~/components/lego/account/favorite-tab";
import ActivityTab from "~/components/lego/account/activity-tab";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    AccountBanner,
    TabSwitcher,
    MaticNewTab,
    EthereumNewTab,
    FavoriteTab,
    ActivityTab,
  },
  middleware: ["auth"],
  mixins: [],
  computed: {
    ...mapGetters("account", [
      "favouriteOrders",
      "totalMaticNft",
      "totalMainNft",
    ]),
    ...mapGetters("network", ["networks"]),
    ...mapGetters("auth", ["user"]),
  },
})
export default class Index extends Vue {
  activeTab = 0;

  allOrSale = true;

  async mounted() {
    this.fetchTotalTokens();
  }

  async fetchTotalTokens() {
    try {
      let mainNftResponse = await getAxios().get(
        `tokens/balance?userId=${this.user.id}&chainId=${this.mainChainId}&offset=0&limit=1`
      );

      let maticNftResponse = await getAxios().get(
        `tokens/balance?userId=${this.user.id}&chainId=${this.maticChainId}&offset=0&limit=1`
      );

      if (mainNftResponse.status === 200 && mainNftResponse.data.data) {
        this.$store.commit("account/totalMainNft", mainNftResponse.data.count);
      }

      if (maticNftResponse.status === 200 && maticNftResponse.data.data) {
        this.$store.commit(
          "account/totalMaticNft",
          maticNftResponse.data.count
        );
      }

      this.$store.dispatch("token/fetchBalances");
    } catch (error) {
      console.log(error);
    }
  }

  get mainChainId() {
    return this.networks.main.chainId;
  }

  get maticChainId() {
    return this.networks.matic.chainId;
  }

  changeTab(num) {
    this.activeTab = num;
  }
  // Get
  get tabs() {
    return [
      { id: 0, title: "Items on Matic", count: this.totalMaticNft },
      { id: 1, title: "Items on Ethereum", count: this.totalMainNft },
      { id: 2, title: "Favorites", count: this.favCount },
      { id: 3, title: "Activities" },
    ];
  }
  get favCount() {
    if (this.favouriteOrders) {
      return this.favouriteOrders.length;
    }
    return 0;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.sticky-top {
  top: $navbar-local-height !important;
}
.search-box {
  max-width: 264px;
  width: 100%;
}

.switch-wrapper {
  position: relative;
  background-color: light-color("500");
  border-radius: $default-card-box-border-radius;

  .top {
    z-index: 1;
    cursor: pointer;
    height: 100%;
  }

  .switch {
    left: 4px;
    position: absolute;
    height: 83%;
    width: 50%;
    background-color: light-color("700");
    border-radius: 4px;
    transition: left 0.2s linear;
  }
  &.active {
    .switch {
      left: 48%;
    }
  }
}
.count-wrapper {
  height: 24px;
  width: 24px;
  background-color: primary-color("600");
  color: light-color("700");
  border-radius: 50%;
}

@media (max-width: 520px) {
  .search-sort,
  .cat-switch {
    justify-content: center;
    flex-direction: column;
  }
}
</style>

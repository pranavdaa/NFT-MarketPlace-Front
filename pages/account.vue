<template>
  <div class="container-fluid">
    <account-banner />
    <tab-switcher :tabs="tabs" :activeTab="activeTab" :onChangeTab="changeTab" />
    <div class="row">
      <matic-tab v-if="activeTab === 0" />
      <ethereum-tab v-if="activeTab === 1" />
      <favorite-tab v-if="activeTab === 2" />
      <activity-tab v-if="activeTab === 3" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import AccountBanner from "~/components/lego/account/account-banner";
import TabSwitcher from "~/components/lego/tab-switcher";
import MaticTab from "~/components/lego/account/matic-tab";
import EthereumTab from "~/components/lego/account/ethereum-tab";
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
    MaticTab,
    EthereumTab,
    FavoriteTab,
    ActivityTab
  },
  middleware: ["auth"],
  mixins: []
})
export default class Index extends Vue {
  tabs = [
    { id: 0, title: "Items on Matic", count: 12 },
    { id: 1, title: "Items on Ethereum", count: 4 },
    { id: 2, title: "Favorites", count: 6 },
    { id: 3, title: "Activities" }
  ];

  activeTab = 3;

  allOrSale = true;

  mounted() {}

  changeTab(num) {
    this.activeTab = num;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

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

<template>
  <div class="container-fluid">
    <account-banner />
    <account-tabs :activeTab="activeTab" :onChangeTab="changeTab" />
    <div class="row">
      <matic-tab v-if="activeTab === 0" />
      <ethereum-tab v-if="activeTab === 1" />
      <favorite-tab v-if="activeTab === 2" />
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
import AccountTabs from "~/components/lego/account/account-tabs";
import MaticTab from "~/components/lego/account/matic-tab";
import EthereumTab from "~/components/lego/account/ethereum-tab";
import FavoriteTab from "~/components/lego/account/favorite-tab";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    AccountBanner,
    AccountTabs,
    MaticTab,
    EthereumTab,
    FavoriteTab
  },
  middleware: [],
  mixins: []
})
export default class Index extends Vue {
  orders = [
    {
      id: 0,
      title: "Kitty Kitten cat",
      timeleft: "",
      img: "/_nuxt/static/img/dummy-kitty.png",
      price: "0.113",
      category: {
        title: "Cryptokitty",
        img: "~/static/img/cryptokitty.svg"
      },
      erc20Token: {
        symbol: "ETH"
      }
    },
    {
      id: 0,
      title: "Kitty Kitten cat",
      timeleft: "2 days",
      onSale: true,
      img: "/_nuxt/static/img/dummy-kitty.png",
      price: "0.113",
      category: {
        title: "Cryptokitty",
        img: "~/static/img/cryptokitty.svg"
      },
      erc20Token: {
        symbol: "ETH"
      }
    },
    {
      id: 0,
      title: "Kitty Kitten cat",
      timeleft: "2 days",
      img: "/_nuxt/static/img/dummy-kitty.png",
      price: "0.113",
      category: {
        title: "Cryptokitty",
        img: "~/static/img/cryptokitty.svg"
      },
      erc20Token: {
        symbol: "ETH"
      }
    }
  ];

  sortItems = [
    {
      id: 0,
      name: "Popular"
    },
    {
      id: 1,
      name: "Newest"
    },
    {
      id: 2,
      name: "Oldest"
    },
    {
      id: 3,
      name: "Price low to high"
    },
    {
      id: 4,
      name: "Price high to low"
    }
  ];

  activeTab = 0;

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

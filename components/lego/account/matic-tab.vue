<template>
  <div class="container-fluid">
    <div class="row ps-y-32 ps-x-16" v-if="true">
      <div
        class="col-12 col-lg cat-switch d-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
      >
        <categories-selector class="ms-r-16 category-wrapper" />
        <slide-switch :options="switchItems" :onChange="onSwitched" />
      </div>
      <div class="col-12 col-lg search-sort d-flex justify-content-between justify-content-lg-end">
        <search-box class="search-box ms-r-16" placeholder="Search NFT..." :change="(val) => val" />
        <sort-dropdown class="dropdown-filter" :sortItems="sortItems" :change="(val) => val" />
      </div>
    </div>
    <div class="row ps-x-16 d-flex justify-content-center text-center" v-if="true">
      <sell-card
        v-for="order in orders"
        :key="order.title"
        :order="order"
        @click="orderDetails(order.id)"
      />
    </div>

    <no-item :message="exmptyMsg" v-if="!orders" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import SlideSwitch from "~/components/lego/slide-switch";
import NoItem from "~/components/lego/no-item";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    SlideSwitch,
    NoItem
  },
  middleware: [],
  mixins: []
})
export default class MaticTab extends Vue {
  orders = [
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

  exmptyMsg = {
    title: "Oops! No item found on Matic chain.",
    description: "We didn’t found any item on Matic chain.",
    img: true
  };

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

  switchItems = [
    {
      title: "All items",
      count: false,
      selected: true
    },
    {
      title: "On sale",
      count: 12,
      selected: false
    }
  ];

  mounted() {}

  onSwitched(value) {
    this.switchItems[1].selected = value;
    this.switchItems[0].selected = !value;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.search-box {
  max-width: 264px;
  width: 100%;
}

.count-wrapper {
  height: 24px;
  width: 24px;
  background-color: primary-color("600");
  color: light-color("700");
  border-radius: 50%;
}

@media (max-width: 768px) {
  .category-wrapper {
    width: 100% !important;
    // margin: 0 !important;
  }
  .search-box {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 520px) {
  .search-sort,
  .cat-switch {
    justify-content: center;
    flex-direction: column;
  }

  .dropdown-filter {
    margin-top: 16px;
  }
}
</style>

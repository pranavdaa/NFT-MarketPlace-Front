<template>
  <div class="container">
    <div class="row ps-y-32 ps-x-16 ps-x-lg-32">
      <div class="col-md d-flex ms-b-16 ms-b-md-0 justify-content-center justify-content-md-start">
        <categories-selector />
      </div>
      <div class="col-md d-flex ms-b-16 ms-b-md-0 justify-content-center">
        <search-box class="search-box" placeholder="Search NFT..." :change="(val) => val" />
      </div>
      <div class="col-md d-flex justify-content-center justify-content-md-end">
        <sort-dropdown class="dropdown-filter" :sortItems="sortItems" :change="(val) => val" />
      </div>
    </div>
    <div class="row ps-x-16 ps-x-lg-32 d-flex justify-content-center text-center">
      <sell-card v-for="order in orders" :key="order.title" :order="order" />
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

const getImage = url => {
  return require(url);
};

@Component({
  props: {},
  components: { SellCard, CategoriesSelector, SearchBox, SortDropdown },
  middleware: [],
  mixins: []
})
export default class Index extends Vue {
  orders = [
    {
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
  mounted() {}
}
</script>

<style>
.search-box {
  max-width: 264px;
  width: 100%;
}
</style>

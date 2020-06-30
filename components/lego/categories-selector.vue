<template>
  <div v-if="categories && categories.length > 0">
    <div
      class="category d-flex ps-x-16 ps-y-12 cursor-pointer w-100"
      @click="showCategory = !showCategory"
    >
      <img
        :src="selectedCategory.img_url"
        :alt="selectedCategory.name"
        class="icon align-self-center ms-r-12"
      />
      <div class="font-body-small align-self-center font-medium">{{selectedCategory.name}}</div>
      <span class="down-icon align-self-center d-flex justify-content-center ps-l-12 ml-auto">
        <svg-sprite-icon class="align-self-center" name="right-arrow"></svg-sprite-icon>
      </span>
    </div>
    <div class="modal fade show" v-if="showCategory" @click="showCategory=false">
      <div class="container-fluid ms-l-16 ms-l-lg-32 ms-t-32">
        <div class="row categories d-flex flex-column ps-12">
          <div
            class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
            v-for="category in categories"
            :key="category.name"
            @click="selectCategory(category)"
          >
            <img
              :src="img_url(category.img_url)"
              :alt="category.name"
              class="icon align-self-center ms-r-12"
            />
            <div class="font-body-small align-self-center font-medium">{{category.name}}</div>
            <div class="count ps-l-12 font-body-medium ml-auto">{{category.count}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-bind:class="{ 'show': showCategory }"></div>
  </div>
</template>

<script>
import Vue from "vue";

import Component from "nuxt-class-component";

import getAxios from "~/plugins/axios";

@Component({
  props: {}
})
export default class CategoriesSelector extends Vue {
  categories = [];
  showCategory = false;
  selectedCategory = null;
  limit = 4;

  async mounted() {
    await this.fethCategory();
  }

  async fethCategory() {
    const response = await getAxios().get(
      `http://localhost:3000/api/v1/categories/?limit=${this.limit}`,
      { data }
    );

    if (response.status === 200 && response.data.data) {
      this.categories = [...this.categories, ...response.data.data.categories];
    }

    this.selectedCategory = this.categories[0];
  }

  img_url(postfix) {
    return `http://localhost:3000/${postfix}`;
  }

  selectCategory(category) {
    this.selectedCategory = category;
    this.showCategory = false;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.category {
  width: fit-content;
  background-color: light-color("700");
  border-radius: $border-radius-xl;
  border: 1px solid light-color("400");
  box-sizing: border-box;

  .icon {
    width: 20px;
    height: 20px;
  }

  .down-icon {
    width: 24px;
    height: 24px;
    .svg-sprite-icon {
      width: 10px;
      height: 14px;
      fill: rgba(dark-color("700"), 0.4);
      transform: rotate(90deg);
    }
  }
  .count {
    color: dark-color("300");
  }
}

.modal.show {
  padding: 0px !important;
}
.container-fluid {
  padding-top: $navbar-local-height;

  .categories {
    max-width: 348px;
    width: 100%;
    border-radius: $border-radius-xl;
    background-color: light-color("700");
    .category {
      border: none;
      width: 100%;
      &:hover {
        background: light-color("600");
      }
    }
  }
}

@media (max-width: 768px) {
  .container-fluid {
    margin-left: auto;
    margin-right: auto;
    .row {
      margin: 0px !important;
    }
    .categories {
      max-width: 100%;
      width: 100%;
    }
  }
}
</style>

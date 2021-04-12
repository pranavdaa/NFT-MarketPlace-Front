<template>
  <a
    class="btn btn-light align-self-center action"
    :class="{ listed: wishlisted }"
    @click="addToWishList()"
  >
    <img
      src="~/static/icons/heart.svg"
      alt="favorite"
      class="icon option-icon inactive"
    >
    <img
      src="~/static/icons/active/heart.svg"
      alt="favorited"
      class="icon option-icon active"
    >
    <span v-if="!wishlisted">Wishlist</span>
    <span v-if="wishlisted">Wishlisted</span>
  </a>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    wishlisted: {
      type: Boolean,
      required: false,
      default: false,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
  components: {},
  middleware: [],
  mixins: [],
})
export default class WishlistButton extends Vue {
  mounted() {}

  addToWishList() {
    this.onClick()
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.action {
  .option-icon {
    margin-top: -3px;
    margin-right: 4px;
    transition: all 0.3s ease-in-out;
  }
  .option-icon.active {
    display: none;
  }
  .option-icon.inactive {
    display: inline-block;
  }

  &:hover,
  &.listed {
    .option-icon.inactive {
      display: none;
    }
    .option-icon.active {
      display: inline-block;
    }
  }
}
</style>

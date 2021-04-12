<template>
  <div class="container-fluid">
    <div class="row banner-wrapper ps-16 ps-md-24 d-flex">
      <img
        src="~/assets/svg/colored-dummy-item.svg"
        class="img align-self-center"
        alt="marketplace"
      >
      <div class="ps-x-16 ps-x-md-24">
        <div class="font-body-medium message align-self-center">
          Here's a list of your item on Ethereum mainnet. Remember, You need to
          move your items on Matic network to sell on Matic Marketplace.
        </div>
      </div>
      <a
        class="btn btn-purple ml-auto align-self-center"
      >Move all items to Matic</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {},
  components: {},
})
export default class ItemBanner extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.banner-wrapper {
  background-color: supportive-color("100");
  border-radius: $default-card-box-border-radius;
  .message {
    color: supportive-color("500");
    max-width: 666px;
  }

  .btn-purple {
    background-color: supportive-color("500");
    color: light-color("700");
  }
}

@media (max-width: 855px) {
  .img {
    display: none;
  }
  .message {
    text-align: center;
    padding-bottom: 1rem;
  }

  .btn-purple {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

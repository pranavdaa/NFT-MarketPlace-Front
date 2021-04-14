<template>
  <div class="container-fluid">
    <div
      class="row ps-b-32"
      :class="{ 'ps-t-32': !message.img }"
    >
      <div
        v-if="message.img"
        class="col-md-12 d-flex justify-content-center ps-t-80 ps-b-32"
      >
        <img
          src="~/assets/svg/dummy-item.svg"
          alt="Marketplace"
        >
      </div>
      <div
        class="col-md-12 text-center font-heading-large font-semibold ps-b-4"
      >
        {{ message.title }}
      </div>
      <div class="col-md-12 text-center font-body-medium">
        {{ message.description }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
@Component({
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  components: {},
})
export default class NoItem extends Vue {
  mounted() {}
}
</script>

<style lang="css" scoped>
img {
  max-width: 235px;
  width: 100%;
}
</style>

<template>
  <div class="wrapper py-5 d-flex justify-content-center">
    <span class="spinner my-5"></span>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  props: {},
  components: {}
})
export default class Loader extends Vue {}
</script>

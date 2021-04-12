<template>
  <div class="container-fluid p-0">
    <div class="nuxt-section">
      <nuxt />
    </div>
    <toast />
  </div>
</template>
<script>
import Toast from '~/components/toast'

export default {
  components: {
    Toast,
  },
}
</script>

<template>
  <div class="container-fluid p-0">
    <navbar-section />
    <div class="content-container">
      <div class="nuxt-section">
        <nuxt />
      </div>
    </div>
    <toast />
  </div>
</template>

<script>
import NavbarSection from '~/components/navbar'
import Toast from '~/components/toast'

export default {
  components: {
    NavbarSection,
    Toast,
  },

  created() {
    this.isMobileDevice = window.innerWidth < 768
  },
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.nuxt-section {
  margin-top: $navbar-local-height;
}

.logo-container {
  height: 100px;
  background-color: theme-color("primary");
}

.logo {
  height: 26px;
}

.logo-name {
  height: 24px;
}
.content-container {
  margin-top: $navbar-local-height;
}

@media (max-width: 768px) {
  .logo-container {
    height: 60px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.05);
  }
}
</style>

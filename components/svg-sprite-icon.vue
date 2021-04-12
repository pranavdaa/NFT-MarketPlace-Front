<template>
  <svg class="svg-sprite-icon">
    <use :href="'#' + name" />
  </svg>
</template>

<script>
const svgSprite = (svgs) => {
  const svgContent = svgs
    .map((s) => {
      return `<g id="${s.id}">${s.content}</g>`
    })
    .join('')

  return `<svg><defs>${svgContent}</defs></svg>`
}

const context = require.context('~/assets/sprite-svgs', false, /.*\.svg$/)
const svgContent = svgSprite(
  context.keys().map((filename) => {
    return {
      id: filename.replace('./', '').replace('.svg', ''),
      content: atob(
        context(filename).replace(/data:image\/svg\+xml;base64,/, ''),
      ),
    }
  }),
)
document.body.innerHTML += svgContent

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import "~assets/css/theme/_theme";

.svg-sprite-icon {
  height: $svg-icon-size;
  width: $svg-icon-size;
}
</style>

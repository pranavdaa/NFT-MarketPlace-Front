<template>
  <div class="row no-gutters card-container mt-1 mb-2">
    <div class="col-3">
      <div class="token-img">
        <img
          :src="token.category.img_url"
          :alt="token.category.name"
          class="asset-img mx-auto"
          @load="onImageLoad"
        />
      </div>
    </div>
    <div class="col-7 d-flex flex-column justify-content-center text-left">
      <div class="card-name">{{ token.name }}</div>
      <div class="card-category">{{ token.category.name }}</div>
    </div>
    <div class="col-2 d-flex justify-content-center align-items-center">
      <div class="check-box">
        <td>
          <div
            class="check-container"
            :class="{'checked': isSelected}"
            @click="toggleSelection(!isSelected)"
          >
            <input type="checkbox" :checked="isSelected" />
            <span class="checkmark align-self-center"></span>
          </div>
        </td>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

@Component({
  props: {
    token: {
      type: Object,
      required: true,
    },
    onSelectNft: {
      type: Function,
      required: false,
      default: () => {},
    },
    isSelectedAll: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      selectedTokens: [],
      allSelected: false,
    }
  },
  watch: {
    isSelectedAll: function(newVal, oldVal) {
      this.isSelected = newVal;
    },
  },
  components: {
  },
  computed: {
    ...mapGetters("token", ["erc20Tokens", "selectedERC20Token"]),
    isSelected() {
      return this.isSelectedAll;
    }
  },
  methods: {
  }
})
export default class TokenVerticleList extends Vue {
  isSelected = false;

  async mounted() {}

  onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      let rgbColor = colorThief.getColor(img);
      if (rgbColor) {
        let hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2]
        });
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
      } else this.bg = "#f3f4f7";
    } catch (error) {}
  }
  
  // Handlers
  toggleSelection(value) {
    this.isSelected = value;
    this.onSelectNft && this.onSelectNft(this.token, this.isSelected);
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.asset-img {
  max-width: 112px;
  max-height: 160px;
}

.left {
  color: #6e798f;
  line-height: 22px;
  text-align: left;
}
.right {
  color: #6e798f;
  line-height: 22px;
  text-align: right;
}

.check-container {
  display: flex !important;
  display: none;
  justify-content: flex-end;
  &.checked {
    display: flex !important;
  }

  .checkmark {
    position: relative;
    margin-right: 6px;
  }
}

.wrapper-top {
  font-size: 14px;
  line-height: 20px;
}

.card {
  &-wrapper {
    max-height: 350px;
    overflow: scroll;
  }

  &-container {
    background: #f8f9fa;
    border-radius: 12px;
    margin-left: 15px;
    margin-right: 15px;

    .token-img {
      width: 76px;
      height: 76px;
      margin: 2px;
      border-radius: 10px;
      background: white;

      @media (max-width: 446px) {
        width: 55px;
        height: 55px;
      }
      
      img {
        height: 100%;
        width: 100%;
        padding: 5px;
        margin: 0	;
      }
    }
  }
  
  &-name {
    color: #061024;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
  
  &-category {
    color: #6e798f;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
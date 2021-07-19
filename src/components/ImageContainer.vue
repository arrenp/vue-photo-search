<template>
  <div class="container mt-5 h-100">
    <div class="row">
      <div
        class="col-lg-3 col-sm-6 px-1 my-2 justify-content-center"
        v-for="(col, colIndex) in images"
        :key="colIndex"
      >
        <ImageCard
          v-for="(image, cardIndex) in col"
          :key="cardIndex"
          @mouseenter="mouseOn = image.id"
          @mouseleave="mouseOn = ''"
          @click="handleClick(image)"
          :image="image"
          :mouseOn="mouseOn"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ImageCard from "./ImageCard.vue";
import { ref } from "vue";

export default {
  name: "ImageContainer",
  components: {
    ImageCard,
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    push: {
      type: Boolean,
      default: false,
    },
    preload: {
      type: Number,
      default: 5
    }
  },
  emits: ["handleClick"],
  setup(props, { emit }) {
    //detect mouseover
    const mouseOn = ref("");

    const handleClick = (image) => {
      emit("handleClick", image);
    };

    return {
      mouseOn,
      handleClick,
    };
  },
};
</script>
<style lang="css">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
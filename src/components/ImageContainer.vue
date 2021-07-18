<template>
  <div class="container mt-5 h-100">
    <div class="row">
      <div
        class="col-md-3 my-2 justify-content-center"
        v-for="(col, i) in images"
        :key="i"
      >

        <ImageCard
          v-for="(image, index) in col"
          :key="index"
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
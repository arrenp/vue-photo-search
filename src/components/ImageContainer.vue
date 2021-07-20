<template>
  <div class="container mt-5 h-100">
    <div class="row">
      <div
        class="col-lg-3 col-sm-6 px-1 my-2 justify-content-center"
        v-for="(col, colIndex) in images"
        :key="colIndex"
      >
        <div v-for="(image, cardIndex) in col" class="h-0" :key="cardIndex">
          <ImageCard
            @mouseenter="mouseOn = image.id"
            @mouseleave="mouseOn = ''"
            @click="handleClick(image)"
            :image="image"
            :mouseOn="mouseOn"
          />
        </div>
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
  },
  emits: ["handleClick"],
  setup(props, { emit }) {
    //detect mouseover
    const mouseOn = ref("");

    //emit click, sends image
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
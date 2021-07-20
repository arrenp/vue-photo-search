<template>
  <div
    v-if="image.image.link || image.image.type === 'video/mp4'"
    class="card my-4 overflow-hidden rounded-3"
    ref="imgCard"
    :class="{
      'grow shadow': mouseOn === image.id,
      'modal-container flex-row': isModalCard,
      'cursor-pointer': !isModalCard,
    }"
  >
    <!-- moved to own component to prevent lazy flow -->
    <LazyLoader
      :isModalCard="isModalCard"
      :link="compressedImg"
      v-if="compressedImg !== ''"
      :alt="image.title"
    />
    <!-- fallback lazy loader -->
    <img
      v-if="compressedImg === '' && !isModalCard"
      :src="placeholder"
      alt="Loading"
    />
    <div class="card-body bg-white text-start" v-if="!isModalCard">
      <div class="d-flex flex-wrap mb-2">
        <div class="me-2" v-for="(tag, index) in image.tags" :key="index">
          <span class="badge rounded-pill bg-secondary shadow-sm">
            {{ tag.display_name }}
          </span>
        </div>
      </div>

      <h6 class="card-title overflow-hidden ellipsis">
        {{ image.title }}
      </h6>

      <p class="mb-0">
        <small>{{ image.author }}</small>
      </p>
      <p class="mb-0">
        <small>
          views:
          {{ vueNumberFormat(image.views) }}
        </small>
      </p>
    </div>
  </div>
</template>
<script>
import LazyLoader from "./LazyLoader.vue";
import ImageComposable from "../composables/Image";
export default {
  components: { LazyLoader },
  name: "ImageCard",
  props: {
    image: {
      type: Object,
      default: () => ({}),
    },
    mouseOn: {
      type: String,
      default: "",
    },
    isModalCard: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    //fallback
    const placeholder = require("../assets/loading.jpg");
    // Fetch factory
    const { compressedImg, getCompressedImage } = ImageComposable();

    getCompressedImage(props.image.image.link, props.isModalCard);

    return {
      compressedImg,
      placeholder,
    };
  },
};
</script>
<style lang="css" scoped>
.card {
  width: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: all 0.3s ease-in-out;
}

.cursor-pointer {
  cursor: pointer;
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grow {
  transform: scale(1.009);
}

.card.modal-container {
  max-height: 90vh;
  max-width: 90%;
  background-color: rgba(0, 0, 0, 0);
}
</style>
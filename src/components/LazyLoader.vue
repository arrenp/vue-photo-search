<template>
  <!-- If mp4 show video -->
  <video
    v-if="isVideo"
    autoplay="autoplay"
    muted
    :class="{ 'w-100 h-100 mb-4 object-fit-contain': isModalCard }"
  >
    <source :src="link" type="video/mp4" />
    Video not found
  </video>
  <!-- else show img-->
  <img
    v-lazy="link ?? defaultImg"
    v-else
    class="card-img"
    :alt="alt"
    :class="{ 'w-100 h-100 mb-4 object-fit-contain': isModalCard }"
  />
</template>
<script>
export default {
  name: "LazyLoader",
  props: {
    isVideo: {
      type: Boolean,
      default: false,
    },
    isModalCard: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
    alt: {
      type: String,
      default: "",
    },
  },
  setup() {
    const defaultImg = require("../assets/image-not-found.png");

    return {
      defaultImg,
    };
  },
};
</script>
<style lang="css">
.object-fit-contain {
  object-fit: contain;
}
</style>
<template>
  <img
    v-lazy="link ?? defaultImg"
    class="card-img"
    :alt="alt"
    :class="{ 'h-100 w-100 m-auto modal-max object-fit-contain': isModalCard }"
  />
</template>
<script>
export default {
  name: "LazyLoader",
  props: {
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

.modal-max {
  max-height: 90vh;
}
</style>
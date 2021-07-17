<template>
  <div class="card img-card bg-dark text-white h-100 overflow-hidden">
    <img
      :src="image.url_n ?? defaultImg"
      class="card-img h-100 object-fit-cover"
      :alt="image.title"
      :class="{'grow': mouseOn === image.id}"
    />
    <transition v-if="mouseOn === image.id" name="fade">
      <div class="card-img-overlay d-flex flex-column justify-content-end">
        <h3 class="card-title text-white text-start overflow-hidden ellipsis">
          {{ image.title }}
        </h3>
        <div class="row justify-content-between">
          <p class="col-sm-7 text-white text-start mb-0 overflow-hidden ellipsis">
            {{ image.ownername }}
          </p>
          <p class="col-sm-5 text-white text-end mb-0">views: {{ image.views }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
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
  },
  setup() {
    const defaultImg = require("../assets/image-not-found.png");

    return {
      defaultImg,
    };
  },
};
</script>
<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.img-card {
  max-height: 200px;
}

.card-img {
  object-fit: cover;
  transform: scale(1);
  transition: all 0.3s ease-in-out;
}

.card-img-overlay {
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grow {
  transform: scale(1.05);
}
</style>
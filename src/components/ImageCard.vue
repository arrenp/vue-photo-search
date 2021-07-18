<template>
  <div
    v-if="link"
    class="card my-4 overflow-hidden rounded-3"
    :class="{
      grow: mouseOn === image.id,
      'modal-container': isModalCard,
      'cursor-pointer': !isModalCard,
    }"
  >
    <LazyLoader
      :isVideo="contentType === 'video/mp4'"
      :isModalCard="isModalCard"
      :link="link"
      :alt="image.title"
    />

    <div class="card-body text-start" :class="{ 'rounded-3': isModalCard }">
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
      <p v-if="isModalCard" class="mb-0 overflow-hidden ellipsis">
        {{ image.description }}
      </p>
      <p class="mb-0">
        <small>{{ image.account_url }}</small>
      </p>
      <p class="mb-0">
        <small>
          views:
          {{
            vueNumberFormat(image.views, {
              prefix: "",
              suffix: "",
              decimal: ".",
              thousand: ",",
              precision: 0,
              acceptNegative: false,
              isInteger: true,
            })
          }}
        </small>
      </p>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import LazyLoader from "./LazyLoader.vue";
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
    const link = ref(getNestedOrRootProperty(props.image, "link"));
    const contentType = ref(getNestedOrRootProperty(props.image, "type"));

    function getNestedOrRootProperty(image, property) {
      if (image.images) return image.images[0][property];
      else return image[property];
    }

    return {
      link,
      contentType,
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

.card {
  width: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: all 0.3s ease-in-out;
}

.cursor-pointer {
  cursor: pointer;
}

.card-body {
  background-color: #fff;
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grow {
  transform: scale(1.02);
}

.card.modal-container {
  max-height: 90vh;
  max-width: 90%;
  background-color: rgba(0, 0, 0, 0);
}
</style>
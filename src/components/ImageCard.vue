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
    <LazyLoader
      :isModalCard="isModalCard"
      :link="useLink ? image.image.link : compressedImg"
      v-if="compressedImg !== ''"
      :alt="image.title"
    />
    <img
      v-if="compressedImg === '' && !isModalCard"
      :src="placeholder"
      alt="Loading"
      style="height: ${}image.image.width"
    />
    <div class="card-body text-start" v-if="!isModalCard">
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
    //fallback
    const placeholder = require("../assets/loading.jpg");
    //compressed image
    const compressedImg = ref("");

    //max for scale calculation
    const max = ref({
      width: 320,
      height: window.innerHeight - window.innerHeight * 0.1,
    });

    //fallback to regular link if edge case
    const useLink = ref(
      props.isModal &&
        (window.innerWidth > 2650 ||
          window.innerHeight > 1440 ||
          props.image.image.height < max.value.height)
    );

    if(useLink.value !== true){
      getCompressed(props.image.image.link)
    }

    function getCompressed(link) {
      Promise.resolve(
        fetch(link)
          .then(processImageResponse)
          .then(ResizeImage)
      );
    }

    async function processImageResponse(response) {
      const blob = await response.blob();
      return blob;
    }

    async function ResizeImage(response) {
      const reader = new FileReader();
      reader.readAsDataURL(response);

      reader.onload = function (event) {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;

        imgElement.onload = function (e) {
          const canvas = document.createElement("canvas");

          // if mobile or modal card, scale by height, else scale by width
          let isMobile = window.innerWidth < 600;
          if (!props.isModalCard || isMobile) {
            scaleDimensions(canvas, e.target)
          } else {
            scaleDimensions(canvas, e.target, "height", "width")
          }

          const ctx = canvas.getContext("2d");

          ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

          const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
          compressedImg.value = srcEncoded;
        };
      };
    }

    function scaleDimensions(canvas, target, dim ="width", otherDim="height"){
      let scaleSize = max.value[dim] / target[dim];
      canvas[dim] = max.value[dim];
      canvas[otherDim] = target[otherDim] * scaleSize;
      return canvas
    }

    return {
      compressedImg,
      placeholder,
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
  transform: scale(1.009);
}

.card.modal-container {
  max-height: 90vh;
  max-width: 90%;
  background-color: rgba(0, 0, 0, 0);
}
</style>
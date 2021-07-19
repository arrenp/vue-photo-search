<template>
  <div
    v-if="link"
    class="card my-4 overflow-hidden rounded-3"
    :class="{
      'grow shadow': mouseOn === image.id,
      'modal-container flex-row': isModalCard,
      'cursor-pointer': !isModalCard,
    }"
  >
    <LazyLoader
      :isVideo="imgObj.type === 'video/mp4'"
      :isModalCard="isModalCard"
      :link="isNotCompressed ? link : thumbnailLink"
      v-if="isNotCompressed ? link.value !== '' : thumbnailLink !== ''"
      :alt="image.title"
    />
    <img v-if="isNotCompressed ? link === '': thumbnailLink === ''" :src="placeholder" />
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
            vueNumberFormat(image.views)
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
    const placeholder = require('../assets/loading.jpg');
    const imgObj = ref(getNestedOrRoot(props.image))
    const link = ref(imgObj.value.link);
    const thumbnailLink = ref("");
    const isNotCompressed = ref(imgObj.value.type === 'video/mp4' || props.isModalCard )


    function getNestedOrRoot(image) {
      if (image.images) return image.images[0];
      else return image;
    }

    
    const newBlob = ref({});
    Promise.resolve(
      fetch(link.value).then(processImageResponse).then(ResizeImage)
    );

    async function processImageResponse(response) {
      if (isNotCompressed.value) return;

      const blob = await response.blob();
      newBlob.value = blob;
    }

    function ResizeImage() {
      if (isNotCompressed.value) return;

      const reader = new FileReader();
      reader.readAsDataURL(newBlob.value);

      reader.onload = function (event) {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;

        imgElement.onload = function (e) {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 320;

          const scaleSize = MAX_WIDTH / e.target.width;
          canvas.width = MAX_WIDTH;
          canvas.height = e.target.height * scaleSize;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

          const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
          thumbnailLink.value = srcEncoded;
        };
      };
    }

    return {
      isNotCompressed,
      link,
      thumbnailLink,
      placeholder,
      imgObj
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
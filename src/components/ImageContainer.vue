<template>
    <div class="container mt-4 h-100">
        <div class="row">
            <div 
                class="col-md-3 my-2  justify-content-center"
                v-for="(image, index) in images"
                :key="index"
                @mouseenter="mouseOn = image.id"
                @mouseleave="mouseOn = ''"
                @click="handleClick(image)"
            >
                <ImageCard 
                    :image="image"
                    :mouseOn="mouseOn"
                />
            </div>
        </div>
    </div>
</template>
<script>
import ImageCard from "./ImageCard.vue"
import { ref } from "vue";

export default {
    name: "ImageContainer",
    components: {
        ImageCard
    },
    props: {
      images: {
          type: Array,
          default: () => ([])
      }
    },
    emits: ['handleClick'],
    setup(props, { emit }) {
        const mouseOn = ref("")

        const handleClick = (image) => {
            emit('handleClick', image)
        }

        return {
            mouseOn,
            handleClick
        }
    }
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
<template>
  <div class="modal-mask">
    <div class="modal-wrapper p-0" @click="$emit('close')">
      <button
        class="
          btn btn-link btn-lg
          text-decoration-none
          position-absolute
          text-white
        "
      >
        &#x2715;
      </button>

      <ImageCard :image="image" :isModalCard="true" />
    </div>
  </div>
</template>
<script>
import ImageCard from "./ImageCard.vue";
export default {
  components: { ImageCard },
  name: "Modal",
  props: {
    image: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["close"],
  setup(props) {

    console.log(props.image)
  }
};
</script>
<style lang="css" scoped>
.btn-link {
  top: 16px;
  right: 16px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 80%;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}
</style>
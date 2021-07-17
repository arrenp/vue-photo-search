<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click="$emit('close')">
      <div
        class="modal-container p-0 card my-4 img-bg position-relative"
        @click.stop=""
      >
        <button class="btn btn-link position-absolute text-white h1" @click="$emit('close')">&#x2715;</button>
        <img
          :src="image.url_b ?? image.url_z ?? defaultImg"
          :alt="image.title"
          class="card-img"
        />
        <div class="card-body white-bg">
          <h5 class="card-title"></h5>
          <p class="card-text">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
          <p class="card-text">
            <small class="text-muted">Last updated 3 mins ago</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Modal",
  props: {
    image: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props) {
    const defaultImg = require("../assets/image-not-found.png");
    console.log(props.image);

    return {
      defaultImg,
    };
  },
};
</script>
<style lang="css" scoped>
.card-body {
  background-color: #fff;
  border-top: 1px solid grey;
}

.btn-link {
    top: 16px;
    right: 16px
}

.card-img {
  max-height: 70vh;
  object-fit: contain;
}

.img-bg {
  background-color: #e3e3e6;
}

#app {
  padding: 1rem;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  padding: 20px 30px;
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

.modal-default-button {
  display: block;
  margin-top: 1rem;
}
</style>
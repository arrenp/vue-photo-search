<template>
  <div
    ref="scrollContainer"
    class="overflow-scroll overflow-x-hidden text-center pb-5 bg-off-white h-100"
    @scroll="onScroll"
  >
    <Header @search="searchImgs" :loading="loading" />

    <main class="px-3">
      <transition name="fade">
        <ImageContainer
          v-if="inputView && !loading"
          :images="images"
          @handle-click="handleCardClick"
        />
      </transition>
      <transition name="fade">
        <MainBodyMessage v-if="!inputView || appendMain" :message="message" />
      </transition>
      <transition name="fade">
        <div
          v-if="scrollLoading"
          class="spinner-border spinner text-secondary"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </transition>
      <transition name="modal">
        <Modal v-if="showModal" :image="soloImg" @close="showModal = false" />
      </transition>
    </main>
  </div>
  <Footer />
</template>

<script>
import MainBodyMessage from "./components/MainBodyMessage.vue";
import ImageContainer from "./components/ImageContainer.vue";
import ImageComposable from './composables/Images'
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Modal from "./components/Modal.vue";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    MainBodyMessage,
    ImageContainer,
    Header,
    Footer,
    Modal,
  },
  setup() {
    const showModal = ref(false);
    const inputValue = ref("");
    const soloImg = ref({});
    const page = ref(1);

    // Fetch factory
    const { search, loading, message, images, inputView, appendMain, scrollLoading} = ImageComposable();

    //scroll listener
    const onScroll = ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading.value && !scrollLoading.value) {
        page.value = page.value + 1;
        search(inputValue.value, true, page.value);
      }
    };

    function searchImgs(term){
      inputValue.value = term;
      inputView.value = false;
      search(term, false, 1)
    }

    const handleCardClick = (image) => {
      soloImg.value = image;
      showModal.value = true;
    };

    return {
      handleCardClick,
      scrollLoading,
      appendMain,
      searchImgs,
      inputView,
      showModal,
      onScroll,
      message,
      soloImg,
      loading,
      images,
      search,
    };
  },
};
</script>

<style lag="css">
html,
body,
#app {
  margin: 0;
  height: 100%;
  overflow: hidden;
  background-color: #f5f6f7;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.overflow-scroll {
  scroll-behavior: smooth;
}

.overflow-x-hidden {
  overflow-x: hidden;
}

.spinner {
  margin-top: 100px;
  height: 50px;
  width: 50px;
}
</style>

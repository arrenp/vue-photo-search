<template>
  <div
    ref="scrollContainer"
    class="overflow-scroll text-center bg-off-white h-100"
    @scroll="onScroll"
  >
    <Header @search="search" :loading="loading || scrollLoading" />

    <main class="px-3">
      <transition name="fade">
        <ImageContainer
          v-if="inputView && !loading"
          :images="images"
          :push="page != 1"
          @handle-click="handleCardClick"
        />
      </transition>
      <transition name="fade">
        <MainBodyMessage v-if="!inputView || appendMain" :message="message" />
      </transition>

      <transition name="modal">
        <Modal v-if="show" :image="soloImg" @close="show = false" />
      </transition>
    </main>
  </div>
  <Footer />
</template>

<script>
import MainBodyMessage from "./components/MainBodyMessage.vue";
import ImageContainer from "./components/ImageContainer.vue";
import Header from "./components/Header.vue";
import Footer from './components/Footer.vue';
import Modal from "./components/Modal.vue";
import config from "./config";
import axios from "axios";
import { ref } from "vue";

//set amount of columns
const colSize = 4;

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
    const scrollLoading = ref(false);
    const appendMain = ref(false);
    const inputView = ref(false);
    const inputValue = ref("");
    const loading = ref(false);
    const message = ref('WT');
    const soloImg = ref({});
    const show = ref(false);
    const images = ref([]);
    const page = ref(1);
    let cancelToken;

    //scroll listener
    const onScroll = ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (scrollTop + clientHeight >= scrollHeight && !loading.value) {
        page.value = page.value + 1;
        search(inputValue.value, true);
      }
    };

    const search = (term = "", scrollLoad = false) => {
      appendMain.value = false;
      // re-init page, set loading state, and cancel previous request(s) if not scroll
      if (scrollLoad === false) {
        page.value = 1;
        loading.value = true;
        //Check if there are any previous pending requests
        if (typeof cancelToken != typeof undefined) {
          cancelToken.cancel("Operation canceled due to new request.");
        }

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();
      } else {
        scrollLoading.value = true;
      }

      //call api if search term, else clear image array and show default
      if (term != "") {
        fetchImages(term).then(() => {
          //disable loading and scrollLoading
          loading.value = false;
          scrollLoading.value = false;
        });
      } else {
        //clear images arr
        images.value = [];
        //hide gallery
        inputView.value = false;
        //disable loading and scrollloading
        loading.value = false;
        scrollLoading.value = false;
        //set message to no text
        message.value = 'NT';
      }
    };

    //call api
    const fetchImages = (term) => {
      //set headers
      const instance = axios.create({
        headers: { Authorization: `Client-ID ${config.client_id}` },
        cancelToken: cancelToken.token,
      });

      return instance
        .get(`https://api.imgur.com/3/gallery/search/${page.value}?q_any=${term}&q_size_px=med`)
        .then((response) => {
          //hide message
          inputView.value = true;
          //set input value for scroll handler
          inputValue.value = term;

          // if scroll query, add new results to old results. Else set new results
          let newArr = chunkArray(
            response.data.data,
            Math.floor(response.data.data.length / colSize)
          );
          

          if (page.value != 1) {
            images.value = iterateAndPushToArr(images.value, newArr);
          } else {
            images.value = newArr;
          }

          // if no results, set and append no results message, else if results < max (-10 for api error handling), show end message
          if (response.data.data.length < 1 && !scrollLoading.value) {
            message.value = "NR";
            appendMain.value = true;
          } else if (response.data.data.length < 50 && scrollLoading.value) {
            message.value = "ER";
            appendMain.value = true;
          }
        })
        .catch(function (error) {
          // handle error
          console.log("api", error);
        });
    };

    function chunkArray(array, size) {
      let result = [];
      //balances columns via jettisoning remainder. If needed, can add iteration to add them to start columns.
      for (let i = 0; i < array.length - (array.length % colSize); i += size) {
        let chunk = array.slice(i, i + size);
        result.push(chunk);
      }
      return result;
    }

    function iterateAndPushToArr(oldArr, newArr) {
      for (let i = 0; i < oldArr.length; i++) {
        oldArr[i] = oldArr[i].concat(newArr[i]);
      }
      return oldArr;
    }

    const handleCardClick = (image) => {
      soloImg.value = image;
      show.value = true;
    };

    return {
      handleCardClick,
      scrollLoading,
      fetchImages,
      appendMain,
      inputValue,
      inputView,
      onScroll,
      message,
      soloImg,
      loading,
      images,
      search,
      show,
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
</style>

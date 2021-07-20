<template>
  <div
    ref="scrollContainer"
    class="overflow-scroll text-center pb-5 bg-off-white h-100"
    @scroll="onScroll"
  >
    <Header @search="search" :loading="loading || scrollLoading" />

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
import Footer from "./components/Footer.vue";
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
    const message = ref("WT");
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
        console.log(page.value, Math.floor(images.value[0].length/ page.value) + Math.floor(images.value[0].length/ 2));
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
        message.value = "NT";
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
        .get(
          `https://api.imgur.com/3/gallery/search/${page.value}?q_any=${term}&q_size_px=med`
        )
        .then((response) => {
          //hide message
          inputView.value = true;
          //set input value for scroll handler
          inputValue.value = term;

          // excludes videos and solves nested problem for albums 
          let newArr = filterArr(response.data.data);

          // if scroll query, add new results to old results. Else set new results
          newArr = chunkArray(newArr, Math.floor(newArr.length / colSize));

          if (page.value != 1) {
            images.value = iterateAndPushToArr(images.value, newArr);
          } else {
            images.value = newArr;
          }

          // if no results and not scrolling, set and append no results message, else if no results and scrolling, show end message
          if (newArr.length < 1 && !scrollLoading.value) {
            message.value = scrollLoading.value ? "ER" : "NR";
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

    function filterArr(data) {
      let newArr = [];

      for (let i = 0; i < data.length; i++) {
        let image = getNestedOrRoot(data[i]);

        if (image.type !== "video/mp4") {
          let node = {
            title: data[i].title,
            author: data[i].account_url,
            views: data[i].views,
            id: image.id,
            image: image,
          };
          newArr.push(node);
        }
      }
      return newArr;
    }

    function getNestedOrRoot(image) {
      if (image.images) return image.images[0];
      else return image;
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

.spinner {
  margin-top: 100px;
  height: 50px;
  width: 50px;
}
</style>

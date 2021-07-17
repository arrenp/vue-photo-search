<template>
  <div class="overflow-scroll text-center" @scroll="onScroll">
    <Header />
    <main class="px-3">
      <transition name="fade">
        <Welcome v-if="!inputView" />
      </transition>

      <LookupSearchField @search="search" :inputValue="inputValue" />
      <transition name="fade">
        <ImageContainer
          v-if="inputView"
          :images="images"
          @handle-click="handleCardClick"
        />
      </transition>
      <transition name="modal">
        <Modal v-if="show" :image="soloImg" @close="show = false" />
      </transition>
    </main>
  </div>
</template>

<script>
import LookupSearchField from "./components/LookupSearchField.vue";
import ImageContainer from "./components/ImageContainer.vue";
import Modal from "./components/Modal.vue";
import Welcome from "./components/Welcome.vue";
import Header from "./components/Header.vue";
import config from "./config";
import axios from "axios";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    Header,
    LookupSearchField,
    ImageContainer,
    Welcome,
    Modal,
  },
  setup() {
    const images = ref([]);
    const inputView = ref(false);
    const soloImg = ref({});
    const inputValue = ref("");
    const show = ref(false);
    const page = ref(1);

    const onScroll = ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (scrollTop + clientHeight >= scrollHeight) {
        page.value = page.value + 1;
        search(inputValue.value, true);
      }
    };

    const fetchImages = (term) => {
      // term = term.split(" ").join(", ")
      // console.log(page.value)
      // return axios({
      //   method: 'get',
      //   url: 'https://api.flickr.com/services/rest',
      //   params: {
      //     method: 'flickr.photos.search',
      //     api_key: config.api_key,
      //     tags: term,
      //     extras: 'url_n, url_b, url_z, owner_name, date_taken, views, tags, description',
      //     pages: 6,
      //     page: page.value,
      //     format: 'json',
      //     nojsoncallback: 1,
      //     per_page: 40,
      //   }
      // })
      const instance = axios.create({
        headers: { Authorization: `Client-ID ${config.client_id}`}
      });
      // let callConfig = {
      //   headers: {
      //     Authorization: `Client-ID ${config.client_id}`,
      //   },
      //   baseURL: "https://7464411a14ce.ngrok.io",
      // };
      
      return instance
        .get(`https://api.imgur.com/3/gallery/search/?q=${term}`)
        .then((response) => {
          console.log(response);
          inputView.value = true;
          images.value = response.data.photos.photo;
        })
        .catch(function (error) {
          // handle error
          console.log("api", error);
        });
    };

    const search = (term, scrollLoad = false) => {
      if (scrollLoad === false) page.value = 1;
      if (term.length > 0) {
        console.log(fetchImages());
        fetchImages(term).then((response) => {
          inputView.value = true;
          inputValue.value = term;
          if (page.value != 1) {
            images.value = images.value.concat(response.data.photos.photo);
          } else {
            images.value = response.data.photos.photo;
          }
        });
      } else {
        images.value = [];
        inputView.value = false;
      }
    };

    // let callConfig = {
    //     headers: {
    //       Authorization: `Client-ID ${config.api_key}`,
    //     },
    //   };
    //   axios.get(
    //     `https://api.imgur.com/3/gallery/search/top/page/?q=${term}`,
    //     callConfig
    //   )
    //   .then((response) => {
    //       console.log(response)
    //       inputView.value = true;
    //       images.value = response.data.photos.photo;
    //     });
    //   } else {
    //     images.value = [];
    //     inputView.value = false;
    //   }
    const handleCardClick = (image) => {
      soloImg.value = image;
      show.value = true;
    };

    return {
      search,
      fetchImages,
      handleCardClick,
      onScroll,
      inputValue,
      images,
      inputView,
      soloImg,
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
</style>

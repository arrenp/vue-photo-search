<template>
  <nav class="navbar navbar-light fixed-top bg-white shadow-sm border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand">Propstr</a>
      
      <SearchField @search="search" :loading="loading" />

      <img :src="jon" class="rounded-circle jon" alt="Jon" />
    </div>
  </nav>
</template>
<script>
import SearchField from "./SearchField";

export default {
  name: "Header",
  components: { SearchField },
  emits: ["search"],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // jon
    const jon = require("../assets/jon.png");

    // emit search to parent
    function search(val) {
      emit("search", val);
    }

    return {
      search,
      jon,
    };
  },
};
</script>
<style lang="css" scoped>
.rounded-circle {
  height: 36px;
  width: 36px;
  object-fit: cover;
}
@media only screen and (max-width: 600px) {
  .navbar-brand {
    display: none;
  }
}
@media only screen and (max-width: 400px) {
  .jon {
    display: none;
  }
}
</style>
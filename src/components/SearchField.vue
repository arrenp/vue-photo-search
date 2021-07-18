<template>
  <div class="me-4 d-flex justify-content-between">
    <div class="position-relative">
      <input
        class="form-control"
        type="text"
        placeholder="Search for images"
        aria-label="Search for images"
        v-model="inputValue"
        tabindex="1"
        @keydown.enter="search"
        ref="input"
      />
      <!-- loading spinner -->
      <div
        v-if="loading"
        class="spinner-border text-primary position-absolute"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <button @click.stop="search" class="btn btn-outline-primary ms-4">Search</button>
  </div>
</template>
<script>
import { onMounted, ref } from "vue";

export default {
  name: "SearchField",
  emits: ["search"],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const inputValue = ref("");
    const input = ref(null);

    const search = () => {
      emit("search", inputValue.value);
    };

    //focus input on load
    onMounted(() => {
      input.value.focus();
    });

    return {
      inputValue,
      search,
      input,
    };
  },
};
</script>

<style>
.spinner-border {
  width: 1.5rem;
  height: 1.5rem;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.3rem;
}
</style>
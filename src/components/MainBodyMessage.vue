<template>
  <div class="message">
    <h1>{{ messages[message].title }}</h1>
    <h6>{{ messages[message].subtitle }}</h6>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  name: "MainBodyMessage",
  props: {
    message: {
      type: String,
      default: "NT",
    },
  },
  setup() {
    const messages = ref({
      ER: {
        title: "",
        subtitle: "End of results",
      },
      NR: {
        title: "No results found",
        subtitle: "Enter a new search in the field above",
      },
      NT: {
        title: "",
        subtitle: "What images are you looking for today?",
      },
      WT: {
        title: "Welcome, Jon!",
        subtitle: "What images are you looking for today?",
      },
    });

    return {
      messages,
    };
  },
};
</script>
<style lang="css">
.message {
  padding-top: 100px;
}
</style>
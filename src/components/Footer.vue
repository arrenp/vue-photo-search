<template>
<footer class="footer mt-auto py-1 bg-light border-top">
  <div class="container d-flex justify-content-between">
    <div class="text-muted">
        <small class="me-2">Arren Propster</small>
        <small><a href="mailto: arrenpropster@gmail.com" class="text-muted">arrenpropster@gmail.com</a></small>
    </div>
    <div>
        <a href="https://www.linkedin.com/in/arrenpropster" target="_blank" class="me-2">
          <small><img :src="linkedin" class="rounded" height="25"/></small>
        </a>
        <a href="https://github.com/arrenp/vue-photo-search" target="_blank">
          <small><img :src="github" class="rounded" height="25"/></small>
        </a>
    </div>
  </div>
</footer>
</template>
<script>
export default {
  name: "Footer",
  setup() {
    const linkedin = require("../assets/LI-In-Bug.png");
    const github = require("../assets/GitHub_Logo.png");

    return {
      linkedin,
      github,
    };
  },
};
</script>
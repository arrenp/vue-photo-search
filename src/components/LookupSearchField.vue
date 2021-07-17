<template>
  <div class="container">
    <input
      class="form-control form-control-lg"
      type="text"
      placeholder="Search for images"
      aria-label=".form-control-lg example"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @input="search"
    />
  </div>
</template>
<script>

export default {
  name: "LookupSearchField",
  props: {
      inputValue: {
          type: String,
          default: ""
      }
  },
  emits: ['search', 'focus', ],
  setup(props, {emit}) {
    const search = (evt) => {
        emit('search', evt.target.value)
    }

    return {
        search
    }
  },
};

</script>
<style lang="">
</style>
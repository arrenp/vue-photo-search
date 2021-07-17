<template>
    <div class="d-flex flex-start">
        <button 
            type="button" 
            class="btn btn-outline-light btn-sm"
            @click="$emit('back')"
        >
            Back To Photos
        </button>
    </div>
</template>
<script>
export default {
    name: 'SoloHeader',
    emits: ['back']
}
</script>
<style lang="">
    
</style>
<script setup>
import {useRoute} from "vue-router";

const route = useRoute()
</script>

<template>
{{route.path}}
</template>

<style scoped lang="less">

</style>

<script setup>


</script>
<template>
  <div class="wrz_blog_music_player" :style="openPlayerStyle">
    <iframe
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        width=330
        height=86
        src="/wy/outchain/player?type=2&id=34722449&auto=1&height=66"
        allow="encrypted-media *"
        sandbox="allow-scripts allow-same-origin"
    >
    </iframe>

  </div>




</template>


<style scoped lang="less">
.wrz_blog_music_player{
  position: fixed;
  overflow: hidden;
  bottom: 80px;
  left: -0px;
  transition: transform 0.5s ease;
  z-index: 2002;
}
.wrz_blog_music_player-content{
  float: left;
  width: 250px;
  height: 60px;
  margin: 0 auto;
  position: relative;
  background: rgb(255,255,255);
  box-sizing: border-box;
}
</style>
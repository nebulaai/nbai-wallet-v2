<template>
    <div class="dashboard">
        <transition name="appFade" mode="out-in">
            <router-view @getTotalStr="getTotalStr"></router-view>
        </transition>
    </div>
</template>
<script>
export default {
    data () {
        return {
            bodyWidth: document.body.clientWidth<=1024?true:false,
        }
    },
    methods: {
        getTotalStr(acc){
            this.$emit('getTotalStr', acc)
        }
    }
}
</script>
<style lang="scss" scoped>
.dashboard{
    box-sizing: border-box;
    padding: 0;
    background: rgb(255, 255, 255);
    font-size: 0.2rem;
}
    
.appFade-enter-active,
.appFade-leave-active {
  transition: opacity 0.3s;
}
.appFade-enter,
.appFade-leave-to {
  opacity: 0;
}
@media screen and (max-width:999px){
    
}
</style>
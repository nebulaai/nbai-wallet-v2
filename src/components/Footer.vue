<template>
 <!-- :class="{'footer_position': positionStyle, 'footer': 1==1}" -->
    <div class="footer">
        <img :src="footer_logo" class="footer_logo" />
        <div class="footer_menu">
            <a href="https://scan.nbai.io" target="_blank">Scan</a>
            <a href="https://nbai.io/" target="_blank">Orion</a>
            <a href="https://nebulaai.org" target="_blank">NBAI</a>
        </div>
        <p>{{$t('footer.copy')}}</p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            footer_logo: require('@/assets/images/imgs/icons/walletlogo.png'),
        };
    },
    props: ['positionStyle'],
    computed: {
        language() {
            return this.$store.getters.language
        }
    },
    methods: {
        header_logo() {
            this.$router.push({name: 'main'})
        },
        handleSetLanguage(lang){
            let _this = this

            document.body.style.height = '100vh'
            document.body.style['overflow-y'] = 'hidden'
            _this.$i18n.locale = lang;
            _this.$store.dispatch("setLanguage", lang);

            window.location.reload();
        },
    },
    mounted() {
    }
};
</script>
<style  lang="scss" scoped>
.footer{
    position: relative;
    width: 100%;
    background: -webkit-gradient(linear, left top, right top, from(#812dc9), to(#7a4bff));
    background: linear-gradient(to right, #812dc9, #7a4bff);
    padding: 0.3rem 0 0.05rem;
    color: #fff;

    .footer_logo{
        display: block;
        height: 0.25rem;
        margin: 0 auto;
    }
    p{
        font-size: 0.16rem;
        color: #fff;
        white-space: nowrap;
        line-height: 1.3;
        text-align: center;
    }
    .footer_menu{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.35rem auto;
        a{
            padding: 0 0.3rem;
            color: #fff;
            font-size: 0.195rem;
            line-height: 1;
        }
        a:nth-child(2){
            border-left: 1px solid #fff;
            border-right: 1px solid #fff;
        }
    }
}
.footer_position{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}
@media screen and (max-width:768px){
.footer{
    .footer_all{
        padding: 0.45rem 4%;
    }
}
    
}
@media screen and (max-width: 600px){
.footer{
    .footer_all{
        padding: 0.45rem 4%;
        
    }
    .pcShow{
        display: none;
    }
    .mobileShow{
        display: block;
    }
}
}
</style>

<template>
    <div class="headerCont">
        <div class="header">
            <div class="logoImg" @click="header_logo">
                <img :src="logo" alt='' />
            </div>
            <div class="header_right">
                <div :class="{'online': addr, 'feh-metamask': 1==1}">
                    <el-tooltip class="item" effect="dark" content="Connect to your MetaMask Wallet" placement="bottom" v-if="!addr">
                        <img src="@/assets/images/imgs/dashbord/metamask.png" @click="signFun" />
                    </el-tooltip>


                    <el-popover v-else
                        placement="bottom-end"
                        width="180"
                        trigger="click"
                        popper-class="addressInfo"
                        @show="walletInfo">
                        <h6>connected to:</h6>
                        <h5 v-if="network.name">{{ network.name }}</h5>
                        <h4>{{addr | hiddAddress}}</h4>
                            <el-divider></el-divider>
                        <h4>{{addr | hiddAddress}}</h4>
                        <h5>{{priceAccound}} {{ network.unit}}</h5>
                            <el-divider></el-divider>
                        <h3 @click="signOutFun">Disconnect</h3>

                        <img src="@/assets/images/imgs/dashbord/metamask.png" slot="reference" />
                    </el-popover>
                </div>
                <div class="network" @click="networkDialog=true">
                    <span class="node">{{ $t('header.NETWORK') }}</span>
                    <i class="el-icon-s-tools"></i>
                </div>
                <div class="download">
                    <a href="https://github.com/nebulaai/nbai-wallet/releases" target="_blank">
                        {{ $t('header.OFFLINEVERSION') }}
                    </a>
                </div>
                <div class="lang_style">
                    <span class="langChild" @click="handleSetLanguage('en')">EN</span>
                    <span>|</span>
                    <span class="langChild" @click="handleSetLanguage('cn')">中文</span>
                </div>
            </div>
        </div>

        <el-row class="menu">
            <el-col :span="24" class="balance">
                <h1>
                    {{ $t('header.TOTALBALANCE') }}
                    <br />
                    <span class="total">{{ totalStr | number }}</span> NBAI
                </h1>
            </el-col>
            <el-col :span="24" class="nav">
                <router-link class="navLink" :class="{'active': routerMenu == 1}" :to="{ name:'main' }">{{ $t('header.DASHBOARD') }}</router-link>
                <router-link class="navLink" :class="{'active': routerMenu == 2}" :to="{ name: 'transfer' }">{{ $t('header.SEND') }}</router-link>
                <a href="https://swap.nbai.io/" class="navLink" target="_blank">{{ $t('header.TOKENSWAP') }}</a>
                <a :href="scan_url" class="navLink" target="_blank">{{ $t('header.EXPLORER') }}</a>
            </el-col>
        </el-row>
        <network :networkDialog="networkDialog" @getNetworkDialog="getNetworkDialog"></network>
    </div>
</template>
<script>
import network from '@/components/network'
import NCWeb3 from "@/utils/web3";
export default {
    name: 'header_page',
    components:{
        network
    },
    data() {
        return {
            scan_url: process.env.BASE_SCANURL,
            logo: require("@/assets/images/imgs/icons/wallet_logo_blk.png"),
            networkDialog: false,
            addr: '',
            priceAccound: 0,
            network: {
                name: '',
                unit: 0
            }
        };
    },
    props: ['totalStr'],
    computed: {
        routerMenu() {
            return this.$store.getters.routerMenu
        },
    },
    watch: {
        $route: function (to, from) {}
    },
    methods: {
        header_logo() {
            this.$router.push({name: 'main'})
        },
        handleSetLanguage(lang){
            let _this = this
            _this.$i18n.locale = lang;
            _this.$store.dispatch("setLanguage", lang);
        },
        getNetworkDialog(network){
            this.networkDialog = network
        },
        // Wallet address
        signFun(){
            let _this = this
            if(!_this.addr){
                NCWeb3.Init(addr=>{
                    //Get the corresponding wallet address
                    // console.log('Wallet address:', addr)
                    _this.$nextTick(() => {
                        _this.addr = addr
                        _this.walletInfo()
                    })
                })
                return false
            }
        },
        walletInfo() {
            let _this = this
            web3.eth.getBalance(_this.addr).then(balance => {
                let balanceAll = web3.utils.fromWei(balance, 'ether')
                _this.priceAccound = Number(balanceAll).toFixed(4)
            });
            web3.eth.net.getId().then(netId => {
                // console.log('network ID:', netId)
                switch (netId) {
                case 1:
                    _this.network.name = 'mainnet';
                    _this.network.unit = 'ETH';
                    return;
                case 3:
                    _this.network.name = 'ropsten';
                    _this.network.unit = 'ETH';
                    break;
                case 4:
                    _this.network.name = 'rinkeby';
                    _this.network.unit = 'ETH';
                    return;
                case 5:
                    _this.network.name = 'goerli';
                    _this.network.unit = 'ETH';
                    return;
                case 42:
                    _this.network.name = 'kovan';
                    _this.network.unit = 'ETH';
                    return;
                case 999:
                    _this.network.name = 'NBAI';
                    _this.network.unit = 'NBAI';
                    return;
                default:
                    _this.network.name = '';
                    _this.network.unit = '';
                    return;
                }
            });
        },
        fn() {
            let _this = this
            ethereum.on("accountsChanged", function(accounts) {
                if(_this.$store.getters.metaAddress){
                    _this.addr = accounts[0]
                    _this.walletInfo()
                    _this.$store.dispatch('setMetaAddress', accounts[0])
                }
                // console.log('account:', accounts[0]);  //Once the account is switched, it will be executed here
            });
            ethereum.on("chainChanged", function(accounts) {
                _this.walletInfo()
            });
        },
        signOutFun() {
            this.addr = ''
            this.$store.dispatch('setMetaAddress', '')
        },
    },
    mounted() {
        let _this = this
        if(_this.$store.getters.metaAddress){
            _this.signFun()
        }
        _this.fn()
    },
    filters: {
        number (value) {
            let realVal = ''
            if (!isNaN(value) && value!== '' && value!==null) {
                // realVal = 0.000000000000000001 * value
                realVal = String(value).replace(/^(.*\..{18}).*$/, "$1")
            } else {
                realVal = '--'
            }
            return realVal
        },
        hiddAddress: function (val) {
            if(val){
                return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
            }else{
                return '-'
            }
        }
    },
};
</script>
<style lang="scss" scoped>
.addressInfo{
  padding: 0.2rem;
  h6{
    margin: 0.14rem 0 0;
    font-size: 0.13rem;
    font-weight: normal;
    padding: 0 0.07rem;
  }
  h5{
    font-size: 0.14rem;
    font-weight: normal;
    padding: 0 0.07rem;
  }
  h4{
    font-size: 0.15rem;
    font-weight: normal;
    padding: 0 0.07rem;
  }
  h3{
    margin: 0 0 0.05rem;
    font-size: 0.15rem;
    font-weight: normal;
    padding: 0 0.07rem;
    cursor: pointer;
    &:hover{
      color: rgba(11, 49, 143, 1);
    }
  }
  .el-divider /deep/{
    margin: 0.14rem 0;
  }
}
.headerCont{
    min-height: 0.65rem;
    background-color: #fff;
    .header{
        height: 0.8rem;
        padding: 0 5%;
        background: #fff;
        box-shadow: 0 1px 4px 0 rgba(35, 35, 35, 0.16);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        font-size: 0.16rem;
        -webkit-transition: position .4s, padding 0s;
        transition: position .4s, padding 0s;
        .logoImg{
            width: auto;
            height: 0.3rem;
            cursor: pointer;
            img{
                display: block;
                height: 100%;
                width: auto;
                max-width: 100%;
                margin: auto;
            }
        }
        .header_right{
            display: flex;
            align-items: center;
            .feh-metamask{
                position: relative;
                width: 30px;
                height: 30px;
                margin: 0 10px 0 0;
                cursor: pointer;
                img{
                    display: block;
                    width: 100%;
                    cursor: pointer;
                }
                &:before{
                    position: absolute;
                    right: 0;
                    top: -4px;
                    content: "";
                    width: 5px;
                    height: 5px;
                    border-radius: 100%;
                    background: #d7d6d6;
                }
            }
            .online{
                &:before{
                    background: #0fce7c;
                }
            }
            .network{
                color: #fff;
                background: #5c3cd3;
                padding: 0.08rem 0.2rem;
                border-radius: 0.2rem;
                cursor: pointer;
            }
            .download{
                padding: 0 0.15rem;
                a{
                    color: #fff;
                    background: #5c3cd3;
                    padding: 0.08rem 0.2rem;
                    border-radius: 0.2rem;
                }
            }
            .lang_style{
                line-height: 0.4rem;
                font-size: 0.16rem;
                font-weight: 500;
                span{
                    padding: 0 0.02rem;
                    cursor: pointer;
                    color: #007bff;
                    &:hover{
                        color: #5c3cd3;
                    }
                }
            }
        }
    }
    .menu{
        background: url(../assets/images/imgs/dashbord/Asset-2.png) no-repeat;
        background-size: cover;
        text-align: center;
        .balance{
            h1{
                padding-top: 0.54rem;
                color: #fff;
                font-size: 0.24rem;
                font-weight: normal;
                padding-bottom: 0.16rem;
                text-transform: uppercase;
                .total{
                    font-size: 0.4rem;
                }
            }
        }
        .nav{
            display: flex;
            align-items: center;
            .navLink{
                margin: 0 0 0 5%;
                font-size: 0.16rem;
                font-weight: 300;
                color: #fff;
                line-height: 1.7;
            }
            .active{
                text-decoration: underline;
            }
        }
    }
}

@media screen and (max-width:1024px){
    
}
@media screen and (max-width: 768px){
    .headerCont {
        .header {
            .logoImg{
                // height: 0.2rem;
            }
            .header_right {
                .network{
                    padding: 0.07rem 0.17rem;
                    margin: 0 0.1rem 0 0;
                    span{
                        display: none;
                    }
                }
                .download{
                    display: none;
                }
            }
        }

    }
}
@media screen and (max-width: 441px){
    .headerCont {
        .header {
            padding: 0 2%;
            .logoImg{
                width: 50%;
                height: auto;
                img{
                    width: 100%;
                    height: auto;
                }
            }
            .header_right {
                .network{
                    margin: 0 0.05rem 0 0;
                    padding: 0.05rem 0.1rem;
                }
            }
        }
        .menu {
            .balance {
                h1 {
                    .total{
                        font-size: 0.2rem;
                    }
                }
            }
        }
    }
}
</style>

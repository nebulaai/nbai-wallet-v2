<template>
    <div class="details-content">
        <div class="icon">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
                <g>
                    <circle class="st0" cx="40" cy="40" r="40" />
                    <circle class="st1" cx="29.1" cy="48.7" r="14.7" />
                    <polyline class="st1" points="34,34.7 34.2,22 60.9,22 60.9,48.7 43.9,48.7" />
                </g>
            </svg>
        </div>
        <div class="wallet-name">{{account[0].name}}</div>
        <div class="wallet-address">
            <a :href="scan_url+'address/'+account[0].address" target="_blank">{{ account[0].address | hidd}}</a> &nbsp;&nbsp;
            <a href="javascript:;" @click="copyText(account[0].address)">
                <img src="@/assets/images/imgs/icons/copy.svg" style="width: 20px;" />
            </a>
        </div>
        <div class="wallet-balance">{{account[0].balance}} NBAI</div>

        <div class="wallet-details">

            <div class="qrcode" v-if="account[0].address">
                <div id="er-pic" style="width:160px"></div>
            </div>
            <div class="btns">
                <router-link :to="{name: 'transfer' ,params: { address: account[0].address}}">{{ $t('header.SENDWITHADD')}}</router-link>
                <button @click="exportDialog=true">{{ $t('header.EXPORTPRIVATE')}}</button>
                <button @click="exportStoreDialog=true">{{ $t('header.EXPORTKEYSTORE')}}</button>
            </div>
        </div>

        <div class="link btn-add">
            <a :href="scan_url+'address/'+account[0].address" target="_blank">{{scan_url}}address/{{account[0].address}}</a>
            &nbsp;&nbsp;<a href="javascript:;" @click="copyText(scan_url + 'address/' + account[0].address)">
                <img src="@/assets/images/imgs/icons/copy.svg" style="width: 20px;" />
            </a>
        </div>

        <export-key 
            :exportDialog="exportDialog" :address="addressUrl"
            @getExportDialog="getExportDialog"></export-key>
        <export-keystore 
            :exportStoreDialog="exportStoreDialog" :address="addressUrl"
            @getExportStoreDialog="getExportStoreDialog"></export-keystore>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import exportKey from '@/components/exportKey'
import exportKeystore from '@/components/exportKeystore'
export default {
  name: 'detail',
  components:{
      exportKey,
      exportKeystore
  },
  data() {
    return {
      scan_url: process.env.BASE_SCANURL,
      bodyWidth: document.body.clientWidth>600?true:false,
      account: [{
          name: '',
          balance: '',
          address: ''
      }],
      addressUrl: '',
      exportDialog: false,
      exportStoreDialog: false
    }
  },
  methods: {
      getExportDialog(dialog) {
          this.exportDialog = dialog
      },
      getExportStoreDialog(dialog) {
          this.exportStoreDialog = dialog
      },
      copyText: function(text){
        let _this = this
        let saveLang = _this.$t('dashboard.COPYSUCCESS');
        var txtArea = document.createElement("textarea");
        txtArea.id = 'txt';
        txtArea.style.position = 'fixed';
        txtArea.style.top = '0';
        txtArea.style.left = '0';
        txtArea.style.opacity = '0';
        txtArea.value = text;
        document.body.appendChild(txtArea);
        txtArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            if (successful) {
                _this.$message({
                    message: saveLang,
                    type: 'success'
                });
                return true;
            }
        } catch (err) {
            console.log('Oops, unable to copy');
        } finally {
            document.body.removeChild(txtArea);
        }
        return false;
      },
      qrcode(text) {
        document.getElementById("er-pic").innerHTML = ""
        let qrcode = new QRCode('er-pic', {
          width: 160,
          height: 160, 
          text: text, 
          image: '',
          correctLevel: QRCode.CorrectLevel.L
        })
      },
      getData(address) {
        let _this = this
        const key = address;
        if (!key || !sessionStorage.getItem('accoundList')) _this.$router.push({ path: '/dashboard/main' })
        
        let acc = []
        _this.account = []
        if(sessionStorage.getItem('accoundList')){
            acc = JSON.parse(sessionStorage.getItem('accoundList'))
            acc.map(item => {
                if(item.address == address){
                    _this.account.push(item)
                    _this.getBalance(item.address)
                    return false
                }
            })
        }

      },
      getBalance(address) {
        let _this = this
        let web3 = new Web3(this.$root.networkUrl);
        web3.setProvider(this.$root.networkUrl);
        web3.eth.getBalance(address).then(balance => {
            // _this.account[0].balance = web3.utils.fromWei(balance, 'ether')
            _this.account[0].balance = 0.000000000000000001 * balance
            _this.qrcode(address)
        }).catch(err => {
            console.log(err)
            _this.$router.push({ path: '/dashboard/main' })
        });
      }
  },
  mounted() {
    this.addressUrl = this.$route.params.address
    this.getData(this.$route.params.address)
    this.$store.dispatch("setRouterMenu", 1);
  },
  filters: {
    hidd(val) {
      if (val.length <= 16) {
        return val;
      } else {
        return `${val.substring(0, 10)}...${val.substring(val.length - 6)}`;
      }
    },
    number (value) {
      let realVal = ''
      if (!isNaN(value) && value!== '' && value!==null) {
        value = value * 0.000000000000000001
        realVal = String(value).replace(/^(.*\..{18}).*$/, "$1")
      } else {
        realVal = '--'
      }
      return realVal
    },
  },
}
</script>

<style lang="scss" scoped>
.details-content{
    text-align: center;
    padding: 0.48rem;
    padding-top: 0.96rem;
    color: #565656;
    font-weight: 200;
    div.icon{
        svg{
            width: 60px;
            height: 60px;
            .st0 { fill: #5C3CD3;}
            .st1 {  fill: none;stroke: #FFFFFF;stroke-width: 3;stroke-miterlimit: 10;}
        }
    }
    .wallet-name{
        font-size: 0.24rem;
        padding-bottom: .048rem;
    }
    .wallet-address{
        font-size: 0.16rem;
        a{
            color: #007bff;
            &:hover{
                color: #084d98;
            }
        }
    }
    .wallet-balance{
        font-size: 0.32rem;
        color: #5C3CD3;
        padding-top: 0.08rem;
        padding-bottom: 0.32rem;
        font-weight: 500;
    }
    div.wallet-details{
        width: 430px;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;               
        div.btns{
            padding-top: 0.032rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            button, a{
                margin: 0.032rem auto;
                font-size: 0.16rem;
                width: 180px;
                height: 0.336rem;
                line-height: 0.336rem;
                border: 1px solid #5c3cd3;
                border-radius: 12px;
                color: #fff;
                background: #5c3cd3;
                font-weight: 500;
                &:hover{
                    cursor: pointer;
                }
            }
        }
        @media (max-width: 480px) {
            width: 80%;
            flex-direction: column;
            justify-content: center;
            align-self: center;
            div.qrcode{
                margin: 0.032rem auto;
            }
            div.btns{
                margin: 0.24rem auto 0;
                padding: 0;
                button{
                    margin: 0.128rem auto;
                }
            }
        }
    }
    div.btn-add{
        margin: 0.32rem auto;
        word-break: break-all;
        font-size: 0.16rem;
        a{
            color: #007bff;
            &:hover{
                color: #084d98;
            }
        }
        @media (max-width: 480px){
            word-break: break-all;
            width: 300px;
            font-size: 0.144rem;
        }
    }

}

@media screen and (max-width: 980px){
    
}

@media screen and (max-width:600px){
.landing{
  
} 
}

@media (max-width: 370px){
.landing{
  .drawer-content{
    .wallets{
      justify-content: center;
      .wallet{
        width: calc(100% - 2 * 10px);
      }
    }
  }
} 
}
</style>

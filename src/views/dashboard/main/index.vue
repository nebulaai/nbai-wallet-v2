<template>
  <div class="landing">
    <el-row class="wallets">
      <el-col class="wallet" v-for="(item, i) in accounts" :key="i" @click.native="routerTo(item.address)">
          <div class="wallet-header">
            <svg xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" style="enable-background:new 0 0 80 80;" version="1.1" viewBox="0 0 80 80" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px">
              <g>
                <circle class="st0" cx="40" cy="40" r="40"></circle>
                <polygon class="st1" points="11.7,46.1 27.2,19.4 41.7,46.1 	"></polygon>
                <circle class="st1" cx="50" cy="45.6" r="16.1"></circle>
              </g>
            </svg>
            <a class="fresh-f" href="javascript:;" @click.stop="refresh(item.address)">
              <svg t="1630053604217" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2238" width="200" height="200"><path d="M646.187 780.374 198.897 780.374c-17.239 0-14.91-18.171-14.91-29.819l0-74.548L183.987 482.181 94.529 482.181c-16.308 0-29.819-13.512-29.819-29.819 0-6.988 2.33-13.978 6.989-19.103l149.097-178.916c5.591-6.523 13.978-10.251 22.83-10.251s17.239 3.728 22.831 10.251l149.097 178.916c4.659 5.125 6.988 12.114 6.988 19.103 0 16.308-13.512 29.819-29.819 29.819l-89.458 0 0 178.916 268.374 0c4.193 0 8.853 1.863 11.648 5.125l74.548 89.458c1.864 2.796 3.262 6.523 3.262 9.784C661.097 773.385 654.107 780.374 646.187 780.374zM952.301 590.741 803.204 769.657c-5.591 6.523-13.978 10.717-22.83 10.717s-17.239-4.193-22.83-10.717L608.447 590.741c-4.659-5.125-6.989-12.113-6.989-19.103 0-16.308 13.512-29.819 29.819-29.819l89.458 0L720.735 362.903 452.361 362.903c-4.193 0-8.853-1.863-11.648-5.591l-74.548-89.458c-1.863-2.33-3.262-6.058-3.262-9.318 0-7.921 6.989-14.91 14.91-14.91l447.289 0c17.24 0 14.91 18.171 14.91 29.819l0 74.549 0 193.825 89.458 0c16.308 0 29.819 13.512 29.819 29.819C959.29 578.628 956.96 585.616 952.301 590.741z" p-id="2239" fill="#ffffff"></path></svg>
            </a>
          </div>
          <div class="wallet-content" navlink="navLink">
            <div tabindex="0">
              <div class="balance" :class="{'long': item.balance&&String(item.balance).length>18 ? true : false}">{{item.balance?item.balance:0}} NBAI</div>
              <div class="title">{{item.name}}</div>
              <div class="account">{{ item.address | hidd }}</div>
            </div>
            <div class="link"><a @click.stop="" target="_blank" :href="scan_url+'address/'+item.address">Nbai Scan</a></div>
          </div>
      </el-col>
    </el-row>

    <div class="addWallet">
      <ul>
        <li :class="{'active': linkNum == 1}" @click="walletDialog=true">
          <button @click="openPopup('add-wallet', 1)">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
              y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
              <path fill="red"
                d="M500.6,10.6c67.3,0,130.8,12.8,190.3,38.3c59.6,25.5,111.5,60.5,155.9,104.9c44.4,44.4,79.4,96.4,104.9,155.9c25.5,59.6,38.3,123,38.3,190.3c0,68.1-12.8,131.7-38.3,190.9c-25.5,59.2-60.5,111-104.9,155.4c-44.4,44.4-96.4,79.4-155.9,104.9c-59.6,25.5-123,38.3-190.3,38.3c-68.1,0-131.9-12.8-191.4-38.3c-59.6-25.5-111.5-60.5-155.9-104.9c-44.4-44.4-79.4-96.2-104.9-155.4C22.8,631.7,10,568.1,10,500c0-67.3,12.8-130.8,38.3-190.3c25.5-59.6,60.5-111.5,104.9-155.9c44.4-44.4,96.4-79.4,155.9-104.9C368.7,23.3,432.5,10.6,500.6,10.6L500.6,10.6z M780.2,567.7c19.2,0,35.5-6.8,48.8-20.5c13.3-13.7,20-30.2,20-49.4s-6.7-35.5-20-48.8c-13.3-13.3-29.6-20-48.8-20H571.6V220.3c0-19.2-6.8-35.7-20.5-49.4c-13.7-13.7-30.2-20.5-49.4-20.5c-19.2,0-35.5,6.8-48.8,20.5c-13.3,13.7-20,30.1-20,49.4V429H224.2c-19.2,0-35.5,6.7-48.8,20c-13.3,13.3-20,29.6-20,48.8s6.7,35.7,20,49.4c13.3,13.7,29.6,20.5,48.8,20.5h208.7v207.5c0,19.2,6.7,35.7,20,49.4c13.3,13.7,29.6,20.5,48.8,20.5c19.2,0,35.7-6.8,49.4-20.5c13.7-13.7,20.5-30.2,20.5-49.4V567.7H780.2L780.2,567.7z" />
            </svg>
            &nbsp;{{ $t('dashboard.ADD') }}
          </button>
        </li>
        <li :class="{'active': linkNum == 2}" @click="importDialog=true">
          <button @click="openPopup('import-wallet', 2)">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
              y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  d="M4494.5,4987.2c-902.4-92.1-1832.3-474.2-2566.7-1056.6c-1006-798.8-1680.4-2048.7-1804.7-3347C-19.6-871.3,505.2-2333,1536.5-3357.3c1510.1-1500.9,3789-1862.3,5681.2-902.4c478.8,244,874.7,529.4,1247.6,904.7c1912.9,1910.6,1912.9,5018.2,0,6928.9C7427.1,4614.3,5963.1,5134.5,4494.5,4987.2z M5187.4,3256.1c158.8-105.9,158.8-101.3,158.8-1176.3V1113l271.7,267c221,218.7,285.4,269.3,356.8,283.1c255.5,48.3,471.9-186.5,405.1-437.4c-20.7-76-119.7-186.5-580.1-649.2c-303.9-306.2-587-573.2-628.4-593.9c-92.1-43.7-246.3-43.7-326.9-2.3c-34.5,18.4-313.1,285.5-619.2,593.9c-612.3,616.9-642.2,658.3-584.7,844.8c32.2,110.5,156.5,225.6,264.7,244c145,27.6,239.4-25.3,504.1-283.1l246.3-244v966.8c0,920.8,2.3,966.8,46,1040.5C4802.9,3306.8,5030.8,3362,5187.4,3256.1z M3122.5,1200.5c6.9-20.7,13.8-55.2,13.8-76c0-78.3,135.8-313.1,241.7-416.7l103.6-101.3l-165.7-29.9c-89.8-13.8-191.1-46-223.3-71.4l-59.9-43.7V-710.1v-1169.4l80.6-46c80.6-48.3,105.9-48.3,1887.6-48.3s1807,0,1887.6,48.3l80.6,46v1169.4V461.6l-59.8,43.7c-32.2,25.3-126.6,55.2-211.8,71.4l-152,25.3l103.6,110.5c105.9,115.1,239.4,361.4,239.4,446.6c0,73.7,18.4,78.3,156.6,29.9c255.5-87.5,451.2-253.2,561.7-478.8l52.9-105.9V-696.3v-1300.6l-59.8-126.6c-112.8-239.4-379.8-439.7-690.6-511c-94.4-23-547.9-29.9-1919.8-29.9c-1645.9,0-1807,2.3-1942.8,41.4c-296.9,80.6-534.1,264.7-644.5,499.5l-59.8,126.6v1300.6V604.3l52.9,103.6c110.5,223.3,290,379.8,545.6,476.5C3108.7,1246.5,3104.1,1246.5,3122.5,1200.5z" />
              </g>
            </svg>
            &nbsp;{{ $t('dashboard.IMPORTWALLET') }}
          </button>
        </li>
      </ul>
    </div>

    <div class="transactions">
      <div class="transaction-header">
        <h2>{{ $t('header.RECENT') }}</h2>
        <button class="fresh-f" @click="refreshTransaction()">
              <svg t="1630053604217" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2238" width="200" height="200"><path d="M646.187 780.374 198.897 780.374c-17.239 0-14.91-18.171-14.91-29.819l0-74.548L183.987 482.181 94.529 482.181c-16.308 0-29.819-13.512-29.819-29.819 0-6.988 2.33-13.978 6.989-19.103l149.097-178.916c5.591-6.523 13.978-10.251 22.83-10.251s17.239 3.728 22.831 10.251l149.097 178.916c4.659 5.125 6.988 12.114 6.988 19.103 0 16.308-13.512 29.819-29.819 29.819l-89.458 0 0 178.916 268.374 0c4.193 0 8.853 1.863 11.648 5.125l74.548 89.458c1.864 2.796 3.262 6.523 3.262 9.784C661.097 773.385 654.107 780.374 646.187 780.374zM952.301 590.741 803.204 769.657c-5.591 6.523-13.978 10.717-22.83 10.717s-17.239-4.193-22.83-10.717L608.447 590.741c-4.659-5.125-6.989-12.113-6.989-19.103 0-16.308 13.512-29.819 29.819-29.819l89.458 0L720.735 362.903 452.361 362.903c-4.193 0-8.853-1.863-11.648-5.591l-74.548-89.458c-1.863-2.33-3.262-6.058-3.262-9.318 0-7.921 6.989-14.91 14.91-14.91l447.289 0c17.24 0 14.91 18.171 14.91 29.819l0 74.549 0 193.825 89.458 0c16.308 0 29.819 13.512 29.819 29.819C959.29 578.628 956.96 585.616 952.301 590.741z" p-id="2239" fill="#ffffff"></path></svg>
        </button>
      </div>
      <div class="transaction-body text-center">
        <div class="transaction-content">
            <div class="notice" v-if="transactions.length == 0">
                <img src="@/assets/images/imgs/dashbord/0ba65b0885e6fe7f340813b13ab34bc6 (1).svg" alt="icon">
                <p>
                    {{ $t('dashboard.NOTRANSACRTIONS') }}
                </p>
            </div>
            <el-table :data="transactions" v-else stripe style="width: 100%" v-loading="loading">
                <template slot="empty">
                    <div class="notice">
                        <img src="@/assets/images/imgs/dashbord/0ba65b0885e6fe7f340813b13ab34bc6 (1).svg" alt="icon">
                        <p>
                            {{ $t('dashboard.NOTRANSACRTIONS') }}
                        </p>
                    </div>
                </template>　
                <el-table-column prop="name" :label="$t('dashboard.WALLETER')" min-width="120"></el-table-column>
                <el-table-column prop="type" :label="$t('dashboard.ACTION')" min-width="60">
                    <template slot-scope="scope">
                        <div class="color-b">
                            <div class="color-in" v-if="scope.row.type == 2" title="View completed Txns">
                                {{ $t('dashboard.IN') }}
                            </div>
                            <div class="color-out" v-else-if="scope.row.type == 1" title="View completed Txns">
                                {{ $t('dashboard.OUT') }}
                            </div>
                            <div class="color-cir" v-else-if="scope.row.type == 3" title="View completed Txns">
                                {{ $t('dashboard.SELF')}}
                            </div>
                            {{scope.row.id}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="value" :label="$t('dashboard.VALUE')" min-width="160">
                    <template slot-scope="scope">
                        {{scope.row.value | number }} NBAI
                    </template>
                </el-table-column>
                <el-table-column prop="t_from" :label="$t('dashboard.FROM')" min-width="250">
                    <template slot-scope="scope">
                        <a :href="scan_url+'address/'+scope.row.t_from" target="_blank">
                            <span v-if="!scope.row.fromNick">{{scope.row.t_from}}</span>
                            <span v-if="scope.row.fromNick">{{scope.row.fromNick}}</span>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="t_to" :label="$t('dashboard.TO')" min-width="250">
                    <template slot-scope="scope">
                        <a :href="scan_url+'address/'+scope.row.t_to" target="_blank">
                            <span v-if="!scope.row.toNick">{{scope.row.t_to}}</span>
                            <span v-if="scope.row.toNick">{{scope.row.toNick}}</span>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('dashboard.STATUS')" min-width="100"></el-table-column>
                <el-table-column prop="timestamp" :label="$t('dashboard.TIME')" min-width="160"></el-table-column>
                <el-table-column prop="hash" :label="$t('dashboard.TRANSACTIONHASH')" min-width="250">
                    <template slot-scope="scope">
                        <a :href="scan_url+'tx/'+scope.row.hash" target="_blank"><span>{{scope.row.hash}}</span></a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
      </div>
      <div class="transaction-more" v-if="isMore">
        {{ $t('header.TRANSACTIONSMORE') }}
        <a href='https://scan.nbai.io' target='_blank'>NBAI {{ $t('dashboard.EXPLORER') }}</a>
      </div>
    </div>


    <new-wallet 
        :walletDialog="walletDialog" :accounts="accounts" :index="index" 
        @getWalletDialog="getWalletDialog"></new-wallet>
    <import-wallet 
        :importDialog="importDialog" :accounts="accounts" :index="index"
        @getImportDialog="getImportDialog"></import-wallet>

  </div>
</template>

<script>
let web3;
import newWallet from '@/components/newWallet'
import importWallet from '@/components/importWallet'
import axios from 'axios'
import moment from "moment";
export default {
  name: 'Dashboard',
  components:{
      newWallet,
      importWallet
  },
  data() {
    return {
        scan_url: process.env.BASE_SCANURL,
        loading: false,
        bodyWidth: document.body.clientWidth>600?true:false,
        linkNum: 1,
        transactions: [],
        isMore: false,
        walletDialog: false,
        importDialog: false,
        accounts: sessionStorage.getItem('accoundList')?JSON.parse(sessionStorage.getItem('accoundList')):[],
        index: 1,
      
        address: '0x3882E8B61C308ff6B3c252e8Cbcb93BC4E0F80F5'
    }
  },
  methods: {
    openPopup(url, num) {
      this.linkNum = num;
      // this.router.navigate([{ outlets: { popup: [url] } }]);
    },
    checkAccount(){
        let _this = this
        let accCopy = JSON.parse(sessionStorage.getItem('accoundList'))
        let accNum = accCopy.length
        accCopy.map((item, i) => {
            web3.eth.getBalance(item.address).then(balance => {
                // item.balance = web3.utils.fromWei(balance, 'ether')
                item.balance = 0.000000000000000001 * balance
                _this.accounts = accCopy
                if((i+1) == accNum){
                    sessionStorage.setItem('accoundList', JSON.stringify(accCopy))
                    _this.refreshTransaction()
                    _this.$emit('getTotalStr', JSON.parse(sessionStorage.getItem('accoundList')))
                }
            });
        })
    },
    refresh(address) {
        let _this = this
        let accCopy = JSON.parse(sessionStorage.getItem('accoundList'))
        accCopy.map((item, i) => {
            if(item.address == address){
                web3.eth.getBalance(item.address).then(balance => {
                    // item.balance = web3.utils.fromWei(balance, 'ether')
                    item.balance = 0.000000000000000001 * balance
                    _this.accounts = accCopy
                    sessionStorage.setItem('accoundList', JSON.stringify(accCopy))
                    _this.refreshTransaction()
                    _this.$emit('getTotalStr', JSON.parse(sessionStorage.getItem('accoundList')))
                });
            }
        })
    },
    refreshTransaction() {
        let _this = this
        if(_this.accounts.length <= 0){
            return false
        }
        _this.loading = true
        let addresses = ''
        _this.accounts.map(item => {
            addresses += item.address + ',';
        })
        addresses = addresses.substring(0, addresses.length - 1);

        axios.get(process.env.BASE_APIURL + '/transactions?addresses=' + addresses + '&limit=20&offset=0', {headers: {
            'Content-Type': 'application/json'
        }}).then((response) => {
            let data = response.data
            if(data && data['result']){
                _this.transactions = []
                _this.isMore = data['tx_count'] > 20 ? true : false
                data['result'].forEach(transaction => {
                  transaction['value'] = Number(transaction['value']) / 1000000000000000000
                  transaction['timestamp'] = transaction['timestamp']
                    ? moment(new Date(parseInt(transaction['timestamp'] * 1000))).format("YYYY-MM-DD")
                    : "-";
                  _this.accounts.forEach(account => {
                    if (account['address'].toLowerCase() == transaction['t_from'].toLowerCase()) {
                      transaction['fromNick'] = account['name'];
                      if (transaction['type'] == 1 || transaction['type'] == 3) {
                        transaction['name'] = account['name'];
                      }
                    }
                    if (account['address'].toLowerCase() == transaction['t_to'].toLowerCase()) {
                      transaction['toNick'] = account['name'];
                      if (transaction['type'] == 2) {
                        transaction['name'] = account['name'];
                      }
                    }

                  });

                  _this.transactions.push(transaction);
                })
            }

            _this.loading = false
        }).catch(function (error) {
            console.log(error);
            _this.loading = false
            // console.log(error.message, error.request, error.response.headers);
        });
    },
    getWalletDialog(wallet, index, acc){
        this.walletDialog = wallet
        if(index) this.getParent(index, acc)
    },
    getImportDialog(wallet, index, acc){
        this.importDialog = wallet
        if(index) this.getParent(index, acc)
    },
    getParent(index, acc) {
        let _this = this
        if(index){
            _this.index = index
        }
        if(acc){
            _this.accounts = acc
            _this.refreshTransaction()
            _this.$emit('getTotalStr', acc)
        }
    },
    routerTo(address){
        this.$router.push({ path: '/dashboard/details/'+address })
    }
  },
  mounted() {
    let _this = this
    _this.$store.dispatch("setRouterMenu", 1);
    
    web3 = new Web3(_this.$root.networkUrl);
    web3.setProvider(_this.$root.networkUrl);
    if(sessionStorage.getItem('accoundList')){
        _this.checkAccount()
    }
  },
  filters: {
    hidd(val) {
      if (val && val.length <= 16) {
        return val;
      } else {
        return `${val.substring(0, 10)}...${val.substring(val.length - 6)}`;
      }
    },
    number (value) {
      let realVal = ''
      if (!isNaN(value) && value!== '' && value!==null) {
        // realVal = parseFloat(value).toFixed(18)
        realVal = String(value).replace(/^(.*\..{18}).*$/, "$1")
      } else {
        realVal = '--'
      }
      return realVal
    },
    number01 (value) {
        let len = value.toString().split('.')[1].length;
        console.log(len)
        if(len > 18) return true
        else return false
    }
  },
}
</script>

<style lang="scss" scoped>
  .landing{
      display: flex;
      flex-wrap: wrap;
      .wallets{
          padding: 0.32rem;
          display: flex;
          flex-wrap: wrap;
          .wallet{
              padding: 0; 
              height: auto;
              min-height: 220px;
              width: 350px;
              margin:0.32rem;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: cover;
              font-family: 'Helvetica Neue';
              box-shadow: 0px 9px 16px -1px rgba(0,0,0,0.2);
              cursor: pointer;
              .wallet-header{
                  padding-left: 0.16rem;
                  padding-top: 0.16rem;
                  a{
                      float: right;
                      margin-right: 0.16rem;
                      background: transparent;
                      border: none;
                      border-radius: 5px;
                      cursor: pointer;
                      color: #6d6d6d;
                  }
                  a.fresh-f{
                    align-items: center;
                      display: flex;
                      background: #8c91f8;
                      border: none;
                      float: right;
                      cursor: pointer;
                      font-size: 0.192rem;
                      padding: 0.03rem;
                      border-radius: 50%;
                      outline: none;
                      i{
                          color: #fff;
                      }
                      svg{
                        width: 0.25rem;
                        height: 0.25rem;
                      }
                  }
              }
              .wallet-content{
                  padding-left: 0.16rem;
                  cursor: pointer;
                  .link{
                      a{
                          color:#007bff;
                          font-size: 0.16rem;
                          &:hover{
                              color: #1161b7;
                          }
                      }
                  }
              }
              div.title{
                  font-size: 0.24rem;
                  font-weight: 300;
                  color: #565656;
                  padding-top: 0.16rem;
              }
              div.account{
                  color: #565656;
                  font-size: .128rem;
              }
              div.balance{
                  color: #5C3CD3;
                  font-size: 0.288rem;
                  word-break: break-all;
                  &.long{
                      font-size: 0.24rem;
                  }
              }
              svg{
                  width: 60px;
                  height: 60px;
              }
              &:nth-child(1n){
                  background: linear-gradient(
                      120deg,
                      #F6F5FF 0%,
                      #B8B8FF 100%
                  );
                  background-image: url('../../../assets/images/imgs/dashbord/wallet1.png');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  div.balance{
                      color: #5C3CD3;
                  }
                  svg{
                      .st0 { fill: #5C3CD3;}
                      .st1 {  fill: none;stroke: #FFFFFF;stroke-width: 3;stroke-miterlimit: 10;}
                  }
                  border-bottom: #5C3CD3 5px solid;
              }
              &:nth-child(2n){
                  background: linear-gradient(
                      120deg,
                      #FFFDF5 0%,
                      #FFEB97 100%
                  );
                  background-image: url('../../../assets/images/imgs/dashbord/wallet2.png');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  div.balance{
                      color: #FFD833;
                  }
                  svg{
                      .st0{fill:#FFD833;}
                      .st1{fill:none;stroke:#FFFFFF;stroke-width:3;stroke-miterlimit:10;}
                  }
                  border-bottom: #FFD833 5px solid;
              }
              &:nth-child(3n){
                  background: linear-gradient(
                      120deg,
                      #fff8f8 0%,
                      #ff9999 100%
                  );
                  background-image: url('../../../assets/images/imgs/dashbord/wallet1.png');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  div.balance{
                      color: #f46060;
                  }
                  svg{
                      .st0{fill:#f46060;}
                      .st1{fill:none;stroke:#FFFFFF;stroke-width:3;stroke-miterlimit:10;}
                  }
                  border-bottom: #f46060 5px solid;
              }
              &:nth-child(4n){
                  background: linear-gradient(
                      120deg,
                      #f0fbff 0%,
                      #85e8ff 100%
                  );
                  background-image: url('../../../assets/images/imgs/dashbord/wallet2.png');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  div.balance{
                      color: #5fddff;
                  }
                  svg{
                      .st0{fill:#5fddff;}
                      .st1{fill:none;stroke:#FFFFFF;stroke-width:3;stroke-miterlimit:10;}
                  }
                  border-bottom: #5fddff 5px solid;
              }
              &:nth-child(5n){
                  background: linear-gradient(
                      120deg,
                      #eeffee 0%,
                      #9fef89 100%
                  );
                  background-image: url('../../../assets/images/imgs/dashbord/wallet1.png');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  div.balance{
                      color: #49ce5b;
                  }
                  svg{
                      .st0{fill:#49ce5b;}
                      .st1{fill:none;stroke:#FFFFFF;stroke-width:3;stroke-miterlimit:10;}
                  }
                  border-bottom: #49ce5b 5px solid;
              }
          }
      }
      .addWallet{
          margin-top: 0.64rem;
          ul{
              list-style-type: none;
              padding: 0;
              @media(min-width: 981px){
                  margin-left: 0.64rem;
              }
              li{
                  height: 1.12rem; 
                  width: 300px;
                  padding: 0px;
                  margin: 0px;
                  button{
                      width: 100%;
                      height: 1.12rem;
                      color: #565656;
                      background-color: rgba(0,0,0,0);
                      display: flex;
                      align-items: center;
                      padding-left: 30%;
                      border: 1px dotted #565656;
                      cursor: pointer;
                      font-size: 0.16rem;
                      svg{
                          width: 30px;
                          g, path{fill: #969696;}
                      }
                  }
                  &.active button svg{
                      path{
                          fill: #8f8fff;
                      }
                      g{fill: #8f8fff;}
                  }
              }
          }
      }
      .transactions{
          width: 100%;
          margin: 0 0.64rem;
          color: #565656;
          background: #fff;
          margin-bottom: 0.64rem;
          font-size: 0.128rem;
          overflow: hidden;
          .transaction-header{
              margin: 0.05rem 0 0;
              padding: 0.2rem 0.16rem;
              border-bottom: 1px solid #b2b2b2;
              display: inline-block;
              width: calc(100% - 0.32rem);
              h2{
                  text-transform: uppercase;
                  font-size: 0.16rem;
                  font-weight: 500;
                  float: left;
                  width: 50%;
                  @media (max-width: 480px){
                      width: auto;
                      font-size: 0.144rem;
                      margin-top: 0.048rem;
                      margin-bottom: 0;
                      word-break: break-word;
                  }
              }
              button{
                  background: transparent;
                  border: none;
                  float: right;
                  cursor: pointer;
                  font-size: 0.16rem;
              }
              button.fresh-f{
                  display: flex;
                  background: #8c91f8;
                  border: none;
                  float: right;
                  cursor: pointer;
                  font-size: 0.192rem;
                  padding: 0.03rem;
                  border-radius: 50%;
                  outline: none;
                  i{
                      color: #fff;
                  }
                  svg{
                    width: 0.25rem;
                    height: 0.25rem;
                  }
              }
          }
          .transaction-body{
              width: 100%;
              .notice{
                  padding: 0.16rem 0;
                  img{
                      display: block;
                      width: 100px;
                      margin: auto;
                  }
                  p{
                    text-align: center;
                  }
              }
              .transaction-content{
                  width: 100%;
                  
                  overflow-x: auto;
                  overflow-y: hidden;
                  .el-table /deep/{
                    width: 100%;
                    min-width: 1180px;
                    tr{
                        th, td{
                            padding: 0.01rem 0;
                            font-size: 0.128rem;
                            font-weight: normal;
                            line-height: 1.3;
                            text-align: center;
                            color: #333;
                            border: 0;
                            vertical-align: top;
                            .cell{
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                display: block;
                                a{
                                    color: inherit;
                                }
                                div{
                                    border-radius: .064rem;
                                    color: #fff;
                                    font-weight: 400;
                                    font-size: 0.128rem;
                                    margin: 0 0.032rem;
                                }
                                .color-b{
                                    width: 0.48rem;
                                    line-height: 1.5;
                                    .color-in{
                                        background-color: #5cb85c;
                                    }
                                    .color-out{
                                        background-color: #e67e22;                                               
                                    }
                                    .color-cir{
                                        background-color: #7c42ef;   
                                    }
                                    .color-same{
                                        background-color: #e20d8a;   
                                    }
                                }
                            }
                            &:nth-child(3){
                                text-align: right;
                            }
                            &:nth-child(4), &:nth-child(5), &:nth-child(8){
                                text-align: left;
                            }
                        }
                        th{
                            padding: 0 0 0.1rem;
                            line-height: 0.32rem;
                            color: #a4a4ff;
                            font-weight: 600;
                        }
                    }
                  }
                  .el-table::before {
                        height: 0;
                  }
                  table{
                      width: 100%;
                      min-width: 1180px;
                      tbody{
                          color: #333;
                      }
                      thead, tbody{
                          tr{
                              height: 0.32rem;
                              // display: flex;
                              x:-o-prefocus, tr {
                                  display: flex;
                                }
                              @media screen and (-webkit-min-device-pixel-ratio:0) {
                                  & {
                                      display: flex;
                                    }
                              }
                              @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
                                  & {
                                    display: '';
                                  }
                                }
                              // flex-direction: row;
                              justify-content: space-around;
                              td{
                                text-align: center;
                              }
                              th, td{
                                  .field{
                                      padding: 0.064rem 0;
                                      a{
                                          span{
                                              color: #565656; 
                                              overflow: hidden;
                                              text-overflow: ellipsis;
                                              white-space: nowrap;
                                          }
                                      }
                                  }
                                  &.action{
                                      div{
                                          border-radius: .064rem;
                                          color: #fff;
                                          font-weight: 400;
                                          font-size: 0.128rem;
                                          margin: 0 0.032rem;
                                      }
                                      .color-b{
                                          width: 0.48rem;
                                          .color-in{
                                              background-color: #5cb85c;
                                          }
                                          .color-out{
                                              background-color: #e67e22;                                               
                                          }
                                          .color-cir{
                                              background-color: #7c42ef;   
                                          }
                                          .color-same{
                                              background-color: #e20d8a;   
                                          }
                                      }
                                      
                                  }
                                  &.value{
                                      text-align: right;
                                      padding-right: 25px;
                                      text-align: right;
                                  }
                                  &.send{
                                      text-align: center;  
                                      .btn-send{
                                          color: #fff;
                                          padding: 0.032rem 0.08rem;
                                          background-color: #5C3CD3;
                                          border-radius: 5px;
                                      }     
                                  }
                                  &.hash{
                                      a{
                                          color: #565656;
                                      }
                                  }
                                  &.width-min{
                                      width: 120px;
                                  }
                                  &.width-min-s{
                                      width: 60px;
                                  }
                                  &.width-medium{
                                      width: 160px;
                                  }
                                  &.width-large{                                                  
                                      width: 250px;
                                      text-align: left;
                                      a{
                                          width: 100%;
                                          color: inherit;
                                          span{
                                              overflow: hidden;
                                              white-space: nowrap;
                                              text-overflow: ellipsis;
                                              display: block;
                                          }
                                      }
                                      @media (max-width: 1280px){
                                          width: 200px;
                                      }
                                  }
                              }
                          }
                      }
                      .header{
                          color: #a4a4ff;
                      }
                      .result{
                          &:nth-child(2n){
                              background: #f7f7f7;
                          }

                      }
                  }
              }
              .empty{
                  display: none;
              }
          }
          .transaction-more{
              text-align: right;
              margin-right: 5%;
              margin-top: 0.08rem;
              color: #252525;
              a{
                  color: #007bff;
                    &:hover{
                        color: #084d98;
                    }
              }
          }
          @media(max-width: 768px){
              width: 96%;
              margin: 0 2%;
              word-break: break-all;
              .transaction-body{
                  width: 100%;
                  overflow: scroll;
                  .slide-m{
                      width: 980px;
                  }
              }

              
          }
      }
  }

@media screen and (max-width: 980px){
.landing{
  .drawer-content{
    .wallets{
      justify-content: center;
    }
    .addWallet{
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 0.32rem;
    }
    .transactions{
      
    }
  }
  .wallets{
    justify-content: center;
  }
  .addWallet {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0.5rem auto 0.32rem;
  }
} 
}

@media screen and (max-width:600px){
.landing{
  
} 
}

@media (max-width: 441px){
.landing{
  .drawer-content{
    .wallets{
      justify-content: center;
      .wallet{
        width: calc(100% - 2 * 10px);
      }
    }
  }
  .wallets{
      width: 100%;
      padding: 0;
      .wallet{
        width: calc(100% - 0.4rem);
        margin: 0.2rem;
      }
  }
} 
}
</style>

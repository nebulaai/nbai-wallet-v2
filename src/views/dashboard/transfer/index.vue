<template>
  <div class="transfer_cont">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" @submit.native.prevent>
        <el-form-item :label="$t('dashboard.FROM')+'*'" prop="address_form" :class="{'err': ruleForm.address_form_tip}">
            <el-select v-model="ruleForm.address_form" placeholder="" @blur="selectFun(1, ruleForm.address_form)" @change="selectFun(1, ruleForm.address_form)">
                <el-option
                  v-for="item in addressAll"
                  :key="item.address"
                  :label="item.from"
                  :value="item.address">
                  <span style="float: left" @click="addressFromClick(item.balance, item.password, item)">{{item.name}}&nbsp;-&nbsp;{{item.address | hidd}}&nbsp;-&nbsp;{{item.balance | number}} NBAI</span>
                </el-option>
            </el-select>
            <p v-if="ruleForm.address_form_tip">Wallet Address is required</p>
        </el-form-item>
        <el-form-item :label="$t('dashboard.TO')+'*'" prop="address_to" :class="{'err': ruleForm.address_to_tip, 'createInput': 1==1}">
            <el-select 
            v-model="ruleForm.address_to" placeholder="" 
            filterable
            allow-create
            default-first-option
            v-el-select-input
            @blur="selectFun(2, ruleForm.address_to)" @change="selectFun(2, ruleForm.address_to)">
                <el-option
                  v-for="item in addressAll"
                  :key="item.address"
                  :label="item.to"
                  :value="item.address">
                  <span style="float: left" @click="addressToClick(item.address, item.display)">{{item.name}}&nbsp;-&nbsp;{{item.address | hidd}}&nbsp;-&nbsp;{{item.balance | number}} NBAI</span>
                </el-option>
            </el-select>
            <p v-if="ruleForm.address_to_tip">To Wallet Address is required</p>
            <p v-if="ruleForm.to_incorrect">{{$t('header.WRONGADDRESS')}}</p>
        </el-form-item>
        <el-form-item :label="$t('dashboard.AMOUNT')+'*'" prop="amount" :class="{'err': ruleForm.amount_tip}">
            <el-input v-model="ruleForm.amount" @blur="selectFun(3, ruleForm.amount)" @input="selectFun(3, ruleForm.amount)" maxlength="30"></el-input>
            <p v-if="ruleForm.amount_tip" style="font-size:12px">{{$t('header.AMOUNTISNUMBER')}}</p>
            <p v-if="ruleForm.amount_incorrect" style="font-size:12px">{{$t('header.AMOUNTINVALID')}}</p>
        </el-form-item>
        <el-form-item prop="gaslimit" :class="{'err': ruleForm.gaslimit_tip}">
            <template slot="label">
              {{$t('dashboard.GASLIMIT')+'*'}}
              <el-tooltip class="item tooltipStyle" effect="dark" :content="$t('header.gasLimit')" placement="top">
                <el-button>i</el-button>
              </el-tooltip>
            </template>
            <el-input v-model="ruleForm.gaslimit" @blur="selectFun(4, ruleForm.gaslimit)" @input="selectFun(4, ruleForm.gaslimit)" maxlength="7"></el-input>
            <p v-if="ruleForm.gaslimit_tip" style="font-size:12px">{{$t('header.GASLIMITMUST')}}</p>
        </el-form-item>
        <el-form-item prop="gasprice" :class="{'err': ruleForm.gasprice_tip}">
            <template slot="label">
              {{$t('dashboard.GASPRICE')+'*'}}
              <el-tooltip class="item tooltipStyle" effect="dark" :content="$t('header.gasPrice')" placement="top">
                <el-button>i</el-button>
              </el-tooltip>
            </template>
            <el-input v-model="ruleForm.gasprice" @blur="selectFun(5, ruleForm.gasprice)" @input="selectFun(5, ruleForm.gasprice)" maxlength="5"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dashboard.NOTE')" prop="note">
            <el-input type="textarea" :rows="3" v-model="ruleForm.note"></el-input>
        </el-form-item>
        
        <el-form-item>
            <el-button 
              :type="ruleForm.address_form_tip || ruleForm.address_to_tip || ruleForm.amount_tip || ruleForm.amount_incorrect || 
                      ruleForm.gaslimit_tip || ruleForm.gasprice_tip || !ruleForm.address_form || !ruleForm.address_to ||
                      !ruleForm.amount || !ruleForm.gaslimit || !ruleForm.gasprice?'info':'primary'" 
              :disabled="ruleForm.address_form_tip || ruleForm.address_to_tip || ruleForm.amount_tip || ruleForm.amount_incorrect || 
                      ruleForm.gaslimit_tip || ruleForm.gasprice_tip || !ruleForm.address_form || !ruleForm.address_to ||
                      !ruleForm.amount || !ruleForm.gaslimit || !ruleForm.gasprice?true:false" 
              @click="submitForm('ruleForm')">{{ $t('dashboard.SEND') }}</el-button>
        </el-form-item>
    </el-form>

    <transfer-popup 
      :popupConfirm="popupConfirm" :password="password" :tx="ruleForm" :addressSelect="addressSelect"
      @getTransferDialog="getTransferDialog" @getTransferFinish="getTransferFinish"></transfer-popup>

    <el-dialog title="" :visible.sync="finishTransaction" :width="width">
      <img src="@/assets/images/imgs/icons/alert-icon.png" />
      <h1>{{$t('dashboard.COMPLETED')}}!</h1>
      <h3>{{$t('dashboard.SUCCESS')}}</h3>
      <a :href="scan_url+'tx/'+txHash" target="_blank">{{txHash}}</a>
      <a class="a-close" @click="finishClose">{{$t('dashboard.CLOSE')}}</a>
    </el-dialog>
  </div>
</template>

<script>
let web3;
let that;
import transferPopup from '@/components/transferPopup'
export default {
  name: 'Transfer',
  components:{
      transferPopup
  },
  directives: {
		elSelectInput: {
			bind: function(el) {
				if (el.tagName.toLowerCase() !== 'input') {
					el = el.getElementsByTagName('input')[0];
				}
				el.addEventListener('input',function () {
          // console.log(el.value);
          that.ruleForm.address_to = el.value
				})
			}
		}
	},
  data() {
    return {
        scan_url: process.env.BASE_SCANURL,
        bodyWidth: document.body.clientWidth>600?true:false,
        width: document.body.clientWidth>600?'400px':'95%',
        ruleForm: {
          address_form: '',
          address_form_tip: false,
          address_to: '',
          address_to_tip: false,
          to: '',
          to_incorrect: false,
          amount: '',
          amount_balance: 0,
          amount_tip: false,
          amount_incorrect: false,
          gaslimit: '21000',
          gaslimit_tip: false,
          gasprice: '1',
          gasprice_tip: false,
          note: '',
        },
        disable_btn: true,
        addressAll: [],
        addressSelect: {},

        inputAmount: /^\d+(?:\.\d{0,8})?[\s]{0,5}/,
        inputG: /^[1-9]\d*$/,
        popupConfirm: false,
        password: '',
        txHash: '',
        finishTransaction: false
    }
  },
  watch: {
    'ruleForm.address_to': function() {
      let _this = this
      try{

        // web3.eth.getCode("0xF72c727a8Ad004e4fEEeEe73dfA8D63D493373Db").then(console.log);
        web3.eth.getCode(this.ruleForm.address_to).then(res => {
          // console.log(res)
          _this.ruleForm.gaslimit = res.toLowerCase() == '0x' ? '21000' : '100000'
        })
      } catch (e) {
          // console.log(e);
      }
    }
  },
  methods: {
      getTransferDialog(dialog) {
          this.popupConfirm = dialog
      },
      getTransferFinish(dialog, txHash){
          this.finishTransaction = dialog
          this.txHash = txHash
      },
      submitForm(formName) {
        let _this = this
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_this.ruleForm.address_form){
              web3.eth.getBalance(_this.ruleForm.address_form).then(balance => {
                // _this.ruleForm.amount_balance = web3.utils.fromWei(balance, 'ether')
                _this.ruleForm.amount_balance = 0.000000000000000001 * balance
                if(Number(_this.ruleForm.amount.trim()) > Number(_this.ruleForm.amount_balance)){
                  _this.ruleForm.amount_incorrect = true
                  return false
                }
                _this.popupConfirm = true
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      selectFun(index, val){
        if(index == 1){
          this.ruleForm.address_form_tip = !val ? true : false
        }else if(index == 2){
          this.ruleForm.address_to_tip = !val ? true : false
        }else if(index == 3){
          this.ruleForm.amount_tip = !this.inputAmount.test(val) ? true : false
          this.ruleForm.amount_incorrect = false
        }else if(index == 4){
          this.ruleForm.gaslimit_tip = !this.inputG.test(val) || val < 21000 || val > 4928871 ? true : false
        }else if(index == 5){
          this.ruleForm.gasprice_tip = !this.inputG.test(val) ? true : false
        }
      },
      addressFromClick(balance, password, row) {
        this.ruleForm.amount_balance = balance
        this.password = password
        this.addressSelect = row
        this.addressSelect.balance = balance
      },
      addressToClick(address, display) {
        this.ruleForm.to = address
        if (display.indexOf(' ') == -1) {
          this.ruleForm.to = display;
        }
        this.ruleForm.to = this.ruleForm.to.toLowerCase().indexOf('0x') == 0 ? this.ruleForm.to.trim() : '0x' + this.ruleForm.to.trim();
        this.ruleForm.to_incorrect = !web3.utils.isAddress(this.ruleForm.to) ? true : false //检查指定的字符串是否是有效的以太坊地址
      },
      finishClose(){
        let _this = this
        let accCopy = JSON.parse(sessionStorage.getItem('accoundList'))
        let accLength = accCopy.length
        accCopy.map((item, i) => {
            web3.eth.getBalance(item.address).then(balance => {
                // item.balance = web3.utils.fromWei(balance, 'ether')
                item.balance = 0.000000000000000001 * balance
                let iLength = i + 1
                if(iLength == accLength){
                  _this.finishTransaction = false
                  sessionStorage.removeItem('accoundList')
                  sessionStorage.setItem('accoundList', JSON.stringify(accCopy))
                  _this.$router.push({ path: '/dashboard/main' })
                }
            });
        })
      }
  },
  mounted() {
    let _this = this
    that = _this
    web3 = new Web3(_this.$root.networkUrl);
    web3.setProvider(_this.$root.networkUrl);
    _this.$store.dispatch("setRouterMenu", 2);
    if(_this.$route.params.address){
      _this.ruleForm.address_form = _this.$route.params.address
    }
    if(sessionStorage.getItem('accoundList')){
      _this.addressAll = JSON.parse(sessionStorage.getItem('accoundList'))
      _this.addressAll.map(account => {
        if(!account.balance) account.balance = 0
        account.from = `${account.name} - ${account.address.substring(0, 4)}...${account.address.substring(account.address.length - 4)} - ${String(account.balance).replace(/^(.*\..{18}).*$/, "$1")} NBAI`
        account.to = `${account.name} - ${account.address.substring(0, 4)}...${account.address.substring(account.address.length - 4)} - ${String(account.balance).replace(/^(.*\..{18}).*$/, "$1")} NBAI`
        account.display = account.name + '  ' + `${account.address.substring(0, 4)}...${account.address.substring(account.address.length - 4)}` + '  ' + Number(account.balance) + ' NBAI'

        if(_this.$route.params.address && _this.$route.params.address == account.address){
          _this.addressFromClick(account.balance, account.password, account)
        }
      })
    } 

  },
  filters: {
    hidd(val) {
      if (val && val.length < 8) {
        return val;
      } else {
        return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`;
      }
    },
    number (value) {
      let realVal = ''
      if (!isNaN(value) && value!== '' && value!==null) {
        // realVal = parseFloat(value).toFixed(18)
        realVal = String(value).replace(/^(.*\..{18}).*$/, "$1")
      } else {
        realVal = '0'
      }
      return realVal
    },
  },
}
</script>

<style lang="scss" scoped>
  .transfer_cont{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      padding: 0.48rem 0;
      .el-form /deep/{
          width: 94%;
          max-width: 400px;
          .el-form-item{
              flex-wrap: wrap;
              .el-form-item__label{
                  float: none;
                  width: 100%;
                  text-align: left;
                  color: #565656;
                  font-size: 0.16rem;
                  font-weight: 100;
                  .tooltipStyle{
                    padding: 0;
                    width: 15px;
                    height: 15px;
                    font-size: 12px;
                    font-weight: 600;
                    border: 0;
                    border-radius: 100%;
                    background: #aeb0b4;
                    color: #fff;
                    &:hover{
                      background: #6c6d6e;
                    }
                  }
              }
              .el-form-item__content{
                  .el-select{
                      width: 100%;
                  }
                  .el-button{
                    padding: 0.11rem 0.75rem;
                    font-size: 0.16rem;
                    border-radius: 0.15rem;
                  }
                  p{
                    margin: 0.05rem 0;
                    font-size: 0.16rem;
                    font-weight: 100;
                    color: red;
                    white-space: normal;
                    word-break: break-all;
                    line-height: 1;
                  }
              }
          }
          .createInput{
            .el-input{
              .el-input__inner{
                cursor: text;
              }
            }
          }
          .err{
            .el-form-item__label{
              color: red;
            }
            .el-input{
              .el-input__inner{
                border-color: red;
              }
            }
          }
      }
      .el-dialog__wrapper /deep/{
        text-align: center;
        .el-dialog__header{
          display: none;
        }
        img{
          display: block;
          max-width: 100px;
          margin: auto;
        }
        h1{
          margin: 0.32rem auto 0.1rem;
          font-size: 0.32rem;
          font-weight: 500;
          line-height: 1.2;
          color: #191919;
          word-break: break-word;
        }
        h3, a{
          font-size: 0.16rem;
          font-weight: 500;
          line-height: 1.2;
          color: #191919;
          word-break: break-word;
        }
        a{
          text-decoration: underline;
          color: #007bff;
        }
        a.a-close{
          padding: 5px 45px;
          background: #5c3cd3;
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          margin: 0.2rem auto 0;
          display: block;
          width: max-content;
          text-decoration: unset;
        }
      }
  }

@media screen and (max-width: 980px){
.transfer_cont{
    
} 
}

@media screen and (max-width:600px){
.transfer_cont{
  
} 
}

@media (max-width: 370px){
.transfer_cont{
    
} 
}
</style>

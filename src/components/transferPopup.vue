<template>
    <el-drawer :title="$t('dashboard.CONFIRMATION')" :visible.sync="popupConfirm" custom-class="demo-drawer"
        ref="drawer" :before-close="setMsgtoParent" :wrapperClosable="false"
    >
    <div class="demo-drawer__content">
        <el-form :model="newAccount" ref="newAccount" @submit.native.prevent>
            <el-form-item :label="$t('dashboard.WALLETPASSWORD')" prop="password">
                <el-input type="password" v-model="newAccount.password" autocomplete="off" maxlength="30" @input="inputChange"></el-input>
                <p v-if="incorrect">{{$t('dashboard.PASSWORDINCORRECT')}}</p>
                <p v-if="errMsg_tip">{{errMsg}}</p>
            </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
            <el-button 
                :type="!newAccount.password || incorrect || loading?'info':'primary'" 
                :disabled="!newAccount.password || incorrect || loading?true:false" 
                @click="submitForm('newAccount')">
                {{ $t('dashboard.CONFIRM') }}
            </el-button>
            <el-button 
                @click="setMsgtoParent">
                {{ $t('dashboard.BACK') }}
            </el-button>
        </div>
    </div>

    <div class="load" v-loading="loading"></div>
    </el-drawer>

</template>
<script>
let web3;
export default {
    data() {
        return {
            width: document.body.clientWidth>600?'400px':'90%',
            loading: false,
            newAccount: {
                password: '',
            },
            inputPrivateKeyPass: /^(?=.*\d)(?=.*[a-z]).{6,30}$/,
            incorrect: false,
            errMsg: '',
            errMsg_tip: false,
            addressAll: [],
            finishTransaction: false,
            timer: ''
        };
    },
    props: ['popupConfirm', 'password', 'tx', 'addressSelect'],
    watch: {
        'popupConfirm': function() {
            if(!this.popupConfirm){
                this.newAccount = {
                    password: ''
                }
            }
            web3 = new Web3(this.$root.networkUrl);
            web3.setProvider(this.$root.networkUrl);
        }
    },
    methods: {
        submitForm(formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
            if (valid) {
                if(_this.password.trim() == _this.newAccount.password.trim()){
                    _this.incorrect = false
                    _this.errMsg_tip = false;
                    try {
                        _this.loading = true; 
                        _this.sendSignedTransaction(_this.tx.address_form, _this.tx, _this.addressSelect.privateKey.substr(2));

                    } catch (e) {
                        console.log(e);
                        this.loading = false;
                    }
                }else{
                    _this.incorrect = true
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        sendSignedTransaction(address, etx, privateKey) {
            let _this = this
            const Tx = require('ethereumjs-tx');
            web3.eth.getTransactionCount(address, (err, txCount) => {       
                // console.log(txCount)
                const txObject = {
                    nonce: web3.utils.toHex(txCount),
                    to: etx['address_to'],
                    value: web3.utils.toHex(web3.utils.toWei(etx['amount'], 'ether')),
                    gasLimit: web3.utils.toHex(etx['gaslimit']),
                    gasPrice: web3.utils.toHex(web3.utils.toWei(etx['gasprice'] + '', 'gwei'))
                };
                const tx = new Tx(txObject);
                const key = new Buffer(privateKey, 'hex');
                tx.sign(key);
                const serializedTx = '0x' + tx.serialize().toString('hex');
                web3.eth.sendSignedTransaction(serializedTx, (error, txHash) => {
                    if (error) {
                        console.log('web3.eth.sendSignedTransaction error:', error);
                        _this.errMsg = error;
                        _this.errMsg_tip = true;
                        _this.loading = false;
                    }
                    _this.checkTransaction(txHash);
                });
            });
        },
        checkTransaction(txHash) {
            let _this = this
            web3.eth.getTransactionReceipt(txHash).then(
                res => {
                    console.log('checking ... ');
                    if (!res) { return _this.timer = setTimeout(() => { _this.checkTransaction(txHash); }, 2000); }
                    else {
                        _this.loading = false;
                        _this.$emit('getTransferFinish', true, txHash)
                    }
                },
                err => { console.error(err); }
            );
        },
        setMsgtoParent(){
            this.$emit('getTransferDialog',false)
        },
        inputChange(){
            if(this.newAccount.password) this.incorrect = false
        }
    },
    mounted() {
        clearTimeout(this.timer)
        if(sessionStorage.getItem('accoundList')) this.addressAll = JSON.parse(sessionStorage.getItem('accoundList'))
    }
};
</script>
<style lang="scss" scoped>
.el-drawer__wrapper /deep/{
    .el-drawer{
        width: 4rem !important;
        background: rgba(12, 12, 12, 0.8);
        padding: 0.3rem;
        .el-drawer__header{
            text-align: left;
            padding: 0.16rem;
            margin-bottom: 0.3rem;
            font-size: 0.24rem;
            font-weight: 500;
            color: #fff;
            border-bottom: 1px solid #dee2e6;
        }
    }
    .subtitle {
        font-weight: 200;
        padding-bottom: .048rem;
        line-height: 1.1;
        color: #fff;
        font-size: 0.16rem;
        text-align: left;
        width: 94%;
        margin: auto;
    }
    .load{
        width: 100%;
        height: 200px;
        div{
            background: transparent;
        }
    }
      .el-form{
          width: 94%;
          max-width: 400px;
          margin: auto;
          .el-form-item{
              flex-wrap: wrap;
              margin: 0 0 0.05rem;
                .el-form-item__label{
                    width: 100%;
                    text-align: left;
                    color: #fff;
                    font-size: 0.16rem;
                    font-weight: 400;
                    line-height: 1.5;
                }
                .el-form-item__content{
                    .el-input{
                        .el-input__inner{
                            height: 0.3rem;
                            padding: 0.05rem;
                            line-height: 0.3rem;
                            border-radius: 0;
                        }
                    }
                    .el-textarea{
                        .el-textarea__inner{
                            width: 100%;
                            padding: 0.05rem;
                            background: #a4a4ff;
                            border: 1px solid #fff;
                            font-size: 0.16rem;
                            color: #000;
                            border-radius: 0;
                        }
                    }
                    button{
                        padding: 0.07rem 0.2rem;
                        border: 1px solid #5c3cd3;
                        font-size: 0.16rem;
                    }
                    .el-button--primary{
                        background: #5c3cd3;
                    }
                    p{
                        margin: 0 0 0.05rem;
                        font-size: 12px;
                        color: #d10000;
                        white-space: normal;
                        word-break: break-all;
                        line-height: 1;
                        text-align: left;
                    }
                }
          }
      }
      .demo-drawer__footer{
            padding: 0.2rem 3% 0;
            margin: 0.3rem auto 0;
            border-top: 1px solid #dee2e6;
            overflow: hidden;
            button{
                float: left;
                padding: 0.07rem 0.2rem;
                border: 1px solid #5c3cd3;
                border-radius: 0.25rem;
                font-size: 0.16rem;
            }
            .el-button--primary{
                background: #5c3cd3;
            }
      }
}


@media screen and (max-width: 600px){
.el-drawer__wrapper /deep/{
    .el-drawer{
        width: 90% !important;
    }
}
    
}
</style>
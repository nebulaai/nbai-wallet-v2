<template>
    <el-drawer :title="$t('dashboard.ADD')" :visible.sync="walletDialog" custom-class="demo-drawer"
        ref="drawer" :before-close="setMsgtoParent" :wrapperClosable="false"
    >
    <div class="demo-drawer__content">
        <el-form :model="newAccount" ref="newAccount" @submit.native.prevent>
            <el-form-item :label="$t('dashboard.WALLETNAME')" prop="name">
                <el-input v-model="newAccount.name" autocomplete="off" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item :label="$t('dashboard.ENTER')" prop="enter">
                <el-input type="password" v-model="newAccount.enter_password" autocomplete="off" @input="inputJY(1, newAccount.enter_password)" maxlength="30"></el-input>
                <p v-if="newAccount.enter_password_tip">{{ $t('header.PASSFORMAT') }}</p>
            </el-form-item>
            <el-form-item :label="$t('dashboard.REPEAT')" prop="repeat">
                <el-input type="password" v-model="newAccount.repeat_password" autocomplete="off" @input="inputJY(2, newAccount.repeat_password)" maxlength="30"></el-input>
                <p v-if="newAccount.repeat_password_tip">{{ $t('header.PASSWORDNOTMATCH') }}</p>
            </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
            <el-button 
                :type="newAccount.enter_password_tip||newAccount.repeat_password_tip||!newAccount.repeat_password||!newAccount.enter_password||!newAccount.name?'info':'primary'" 
                :disabled="newAccount.enter_password_tip||newAccount.repeat_password_tip||!newAccount.repeat_password||!newAccount.enter_password||!newAccount.name?true:false" 
                @click="submitForm('newAccount')">{{ $t('dashboard.NEXT') }}</el-button>
        </div>
    </div>
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
                name: '',
                enter_password: '',
                enter_password_tip: false,
                repeat_password: '',
                repeat_password_tip: false
            },
            inputPrivateKeyPass: /^(?=.*\d)(?=.*[a-z]).{6,30}$/,
            idexChild: this.index
        };
    },
    props: ['walletDialog', 'accounts', 'index'],
    watch: {
        'walletDialog': function() {
            if(!this.walletDialog){
                this.newAccount = {
                    name: '',
                    enter_password: '',
                    enter_password_tip: false,
                    repeat_password: '',
                    repeat_password_tip: false
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
                const bip39 = require("bip39");
                const hdkey = require('ethereumjs-wallet/hdkey');
                const util = require('ethereumjs-util');

                let words = bip39.generateMnemonic();

                _this.newAccount.mnemonic = words

                try {
                    
                    const seed = bip39.mnemonicToSeed(words);
                    const hdWallet = hdkey.fromMasterSeed(seed);
                    const key1 = hdWallet.derivePath("m/44'/60'/0'/0/0");
                    const address = util.pubToAddress(key1._hdkey._publicKey, true);
                    const pkey = util.toChecksumAddress(address.toString('hex'));
                    const privateKey = util.bufferToHex(key1._hdkey._privateKey);
                    const keystore = web3.eth.accounts.encrypt(privateKey, _this.newAccount.enter_password);
                    _this.newAccount['address'] = pkey;
                    _this.newAccount['privateKey'] = privateKey;
                    _this.newAccount['keystore'] = keystore;
                    _this.newAccount['password'] = _this.newAccount.enter_password;
                    
                    if(_this.newAccount['mnemonic'] != null || _this.newAccount['mnemonic']!="" || _this.newAccount['mnemonic']==undefined ||_this.newAccount['address'].substring(0,4)!="0x95"){
                        let newAcc = {}
                        newAcc = _this.newAccount
                        _this.addAccount(newAcc);
                        _this.downloadKeystore(keystore);
                        _this.$router.push({ path: '/dashboard/main' })
                    }
                    else{
                        alert("We are sorry. Create wallet failed, please try again.")
                    }
                
                } catch (e) {
                    console.error(e);
                }

            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        addAccount(acc) {
            let _this = this
            let found = false;
            for (let account of _this.accounts) {
                if (account.address == acc.address) found = true;
            }
            if (found) return;
            if (!acc.name) {
                acc.name = `Wallet ${_this.idexChild}`;
                _this.idexChild += 1;
            }
            _this.accounts.push(acc);
            sessionStorage.setItem('accoundList', JSON.stringify(_this.accounts))
            _this.$emit('getWalletDialog', false, _this.idexChild, _this.accounts)
            // this.web3Service.getBalanceSpecial(acc).subscribe(
            // res => {
            //     const balance = 0.000000000000000001 * res;
            //     this.total += balance;
            //     this.totalStr = this.bigAdd(this.totalStr, balance);
            //     // console.log('total str', this.totalStr);
            //     this.totalSubject.next(this.total);
            //     this.totalStrSubject.next(this.totalStr);
            // },
            // err => {
            //     console.log('err', err);
            // });
            // this.walletSubject.next(this.accounts);
        },
        downloadKeystore(keystore) {
            const keystring = JSON.stringify(keystore);
            const blob = new Blob([keystring], { type: 'application/json' });
            const file = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = file;


            const date = new Date();
            const m = date.getMonth() >= 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1);
            const d = date.getDate() >= 10 ? date.getDate().toString() : "0" + date.getDate();
            const h = date.getHours() >= 10 ? "h" + date.getHours() : "h0" + date.getHours();
            const min = date.getMinutes() >= 10 ? "m" + date.getMinutes() : "m0" + date.getMinutes();
            const sDate = date.getFullYear().toString() + m + d + h + min;
            link.download = `NBAI-UTC-${sDate}-${keystore['address']}`;
            link.dispatchEvent(new MouseEvent('click'));
            window.URL.revokeObjectURL(link.href);
        },
        setMsgtoParent(){
            this.$emit('getWalletDialog',false)
        },
        inputJY(type, val) {
            if(type == 1){
                this.newAccount.enter_password_tip = !this.inputPrivateKeyPass.test(val) && val ? true : false
            }else if(type == 2){
                this.newAccount.repeat_password_tip = this.newAccount.repeat_password != this.newAccount.enter_password? true : false
            }
        },
    },
    mounted() {}
};
</script>
<style lang="scss" scoped>
.el-drawer__wrapper /deep/{
    .el-drawer{
        width: 4rem !important;
        background: rgba(12, 12, 12, 0.8);
        padding: 0.3rem;
        .el-drawer__header{
            padding: 0.16rem;
            margin-bottom: 0.3rem;
            font-size: 0.24rem;
            color: #fff;
            border-bottom: 1px solid #dee2e6;
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
                    }
                }
          }
      }
      .demo-drawer__footer{
            padding: 0.2rem 3% 0;
            margin: 0.3rem auto 0;
            border-top: 1px solid #dee2e6;
            button{
                float: right;
                padding: 0.05rem 0.16rem;
                border: 1px solid #5c3cd3;
                border-radius: 0;
                font-size: 0.13rem;
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
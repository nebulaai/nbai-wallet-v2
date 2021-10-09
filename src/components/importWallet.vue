<template>
    <el-drawer :title="$t('header.IMPORT')" :visible.sync="importDialog" custom-class="demo-drawer"
        ref="drawer" :before-close="setMsgtoParent" :wrapperClosable="false"
    >
    <div class="demo-drawer__content">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane :label="$t('header.IMPORTKEYSTOREFILE')" name="first">
                <p class="text">{{$t('header.PLEASEKEYSTORE')}}</p>
                <el-upload
                    class="upload-demo"
                    drag
                    ref="uploadFileRef"
                    action="customize"
                    :http-request="uploadFile"
                    :file-list="fileList"
                    :show-file-list="false"
                    :on-change="handleChange"
                    accept='*'>
                    <div class="el-upload__text">{{ fileName?fileName:$t('header.IMPORTKEYSTORE')}}</div>
                </el-upload>

                <el-form :model="ruleForm" ref="ruleForm" @submit.native.prevent>
                    <el-form-item :label="$t('header.ENTER')" prop="password">
                        <el-input type="password" v-model="ruleForm.password" autocomplete="off" maxlength="30" @change="changeInput"></el-input>
                    </el-form-item>
                    <el-form-item v-if="incorrect">
                        <p>{{ $t('header.KEYSTOREPASSWORDINCORRECT') }}</p>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button 
                            :type="ruleForm.password && upload_file?'primary':'info'" round 
                            :disabled="ruleForm.password && upload_file?false:true" @click="submitForm(keyStore, null, ruleForm.password)">
                            {{ $t('header.RESTORE') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('header.IMPORTPRIVATEKEY')" name="second">
                <el-form :model="ruleForm" ref="ruleForm" @submit.native.prevent>
                    <el-form-item :label="$t('header.ENTERPRIVATEKEY')" prop="private_key">
                        <el-input v-model="ruleForm.private_key" autocomplete="off" @input="inputJY(1, ruleForm.private_key)"></el-input>
                        <p v-if="ruleForm.private_key_tip">{{ $t('header.PRIVATEKEYINCORRECT') }}</p>
                    </el-form-item>
                    <el-form-item :label="$t('header.ENTERNEWKEY')" prop="enter_password">
                        <el-input type="password" v-model="ruleForm.enter_password" autocomplete="off" @input="inputJY(2, ruleForm.enter_password)" maxlength="30"></el-input>
                        <p v-if="ruleForm.enter_password_tip">{{ $t('header.PASSFORMAT') }}</p>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button 
                            :type="ruleForm.enter_password_tip||ruleForm.private_key_tip||!ruleForm.private_key||!ruleForm.enter_password?'info':'primary'" 
                            :disabled="ruleForm.enter_password_tip||ruleForm.private_key_tip||!ruleForm.private_key||!ruleForm.enter_password?true:false" 
                            round @click="submitForm(null, ruleForm.private_key, ruleForm.enter_password)">
                            {{ $t('header.RESTORE') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('header.IMPORTMNEMONIC')" name="third">
                <el-form :model="ruleForm" ref="ruleForm" @submit.native.prevent>
                    <el-form-item :label="$t('header.ENTERMNEMONIC')" prop="textarea">
                        <el-input type="textarea" :rows="3" v-model="ruleForm.textarea" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <div class="btn_tip">
                            <el-button type="primary" round @click="restoreMnemonic">
                                {{ $t('header.RESTORE') }}
                            </el-button>
                            <span v-if="accountTexts.length>0">{{$t('header.AFTERRESTORE')}}</span>
                        </div>
                    </el-form-item>
                </el-form>

                <el-row v-if="accountTexts.length>0">
                    <el-col :span="24">
                        <el-table ref="singleTable" :cell-class-name="tableCellClassName" @cell-click="cellClick" :data="accountTexts" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
                            <el-table-column type="index" width="30">
                                <template  slot-scope="scope">
                                    <el-radio v-model="radio" :label="'1-'+scope.$index"></el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column property="address" :label="$t('header.ADDRESS')"></el-table-column>
                            <el-table-column property="balance" :label="$t('header.AMOUNT')" width="100">
                                <!-- <template  slot-scope="scope">
                                    {{scope.row.balance}} 
                                </template> -->
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="24">
                        <el-button @click="toPrevious" :disabled="pagePosition==0" class="textarea_page">PREV</el-button>
                        <el-button @click="toNext" class="textarea_page">NEXT</el-button>
                    </el-col>
                </el-row>

                <el-form :model="ruleForm" ref="ruleForm" v-if="radio && mnemonicAccountSelected" @submit.native.prevent>
                    <el-form-item :label="$t('header.ENTERNEWKEY')" prop="enter_textarea_password">
                        <el-input type="password" v-model="ruleForm.enter_textarea_password" autocomplete="off" @input="inputJY(3, ruleForm.enter_textarea_password)" maxlength="30"></el-input>
                        <p v-if="ruleForm.enter_textarea_password_tip">{{ $t('header.PASSFORMAT') }}</p>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button 
                            :type="ruleForm.enter_textarea_password && !ruleForm.enter_textarea_password_tip && ruleForm.textarea?'primary':'info'" 
                            round :disabled="ruleForm.enter_textarea_password && !ruleForm.enter_textarea_password_tip && ruleForm.textarea?false:true" 
                            @click="submitForm(null, mnemonicDerivedPk, ruleForm.enter_textarea_password)">
                            {{ $t('header.RESTORE') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>


    </div>
    </el-drawer>

</template>
<script>
let web3;
export default {
    data() {
        return {
            width: document.body.clientWidth>600?'400px':'90%',
            dialog: false,
            loading: false,
            timer: null,
            activeName: 'first',
            ruleForm: {
                name: '',
                password: '',
                private_key: '',
                private_key_tip: false,
                enter_password: '',
                enter_password_tip: false,
                enter_textarea_password: '',
                enter_textarea_password_tip: false,
                textarea: ''
            },
            fileName: '',
            upload_file: '',
            fileList: [],
            fileListTip: false,
            keyStore: '',
            incorrect: false,
            idexChild: this.index,
            pagePosition: 0,
            accountTexts: [],
            radio: '',
            mnemonicAccountSelected: false,
            mnemonicDerivedPk: '',

            inputPrivateKey: /^0x[0-9a-zA-Z]{64}$/,
            inputPrivateKeyPass: /^(?=.*\d)(?=.*[a-z]).{6,30}$/
        };
    },
    props: ['importDialog', 'accounts', 'index'],
    watch: {
        'importDialog': function() {
            if(!this.importDialog){
                this.activeName = 'first'
                this.fileName = ''
                this.upload_file = ''
                this.radio = ''
                this.pagePosition = 0
                this.mnemonicAccountSelected = false
                this.ruleForm = {
                    name: '',
                    password: '',
                    private_key: '',
                    private_key_tip: false,
                    enter_password: '',
                    enter_password_tip: false,
                    textarea: ''
                }
            }
            web3 = new Web3(this.$root.networkUrl);
            web3.setProvider(this.$root.networkUrl);
        },
        'ruleForm.password': function() {
            this.incorrect = false
        },
        'pagePosition': function() {
            this.restoreMnemonic()
        }
    },
    methods: {
        setMsgtoParent(){
            this.$emit('getImportDialog', false)
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        // 文件上传
        uploadFile(params) {
            let _this = this
            _this.upload_file = params.file;
            
            // 读取并解析csv文件,读取为二进制
            var reader = new FileReader();
            reader.readAsText(_this.upload_file, 'utf-8');
            reader.onload = function (evt) {
                var str = reader.result;
                var rows = str.split('\n'); 
                // if(!str.replace(/^\s+|\s+$/g,'')){
                //     console.log('csv文件为空')
                // }
                _this.keyStore = JSON.parse(JSON.stringify(str.toLowerCase()))                
            }   

            const isLt2M = _this.upload_file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                // _this.$message.error(this.$t('deal.upload_form_file_tip'))
                _this.fileListTip = true
                return false
            }else{
                _this.fileListTip = false
            }
        },
        handleChange(file, fileList) {
            if (fileList.length > 0) {
                this.fileList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
                this.fileName = fileList[fileList.length - 1].name.slice(0, 28)
            }
        },
        changeInput(){},
        submitForm(keyStore, privateKey, password) {
            let _this = this
            try {
                if(keyStore){
                    let wallet = web3.eth.accounts.decrypt(keyStore, this.ruleForm.password)
                    let account = { 
                        address: wallet.address, 
                        keystore: _this.keyStore, 
                        privateKey: wallet.privateKey, 
                        password: _this.ruleForm.password 
                    }
                    _this.incorrect = false;
                    web3.eth.getBalance(account.address).then(balance => {
                        // console.log('balance', balance)
                        // account.balance = web3.utils.fromWei(balance, 'ether')
                        account.balance = 0.000000000000000001 * balance
                        _this.accoundList(account)
                    });
                }else if(privateKey){
                    let wallet = web3.eth.accounts.privateKeyToAccount(privateKey)
                    let account = { 
                        address: wallet.address, 
                        keystore: web3.eth.accounts.encrypt(wallet.privateKey, _this.ruleForm.enter_password), 
                        privateKey: wallet.privateKey, 
                        password: _this.ruleForm.enter_password
                    }
                    _this.incorrect = false;
                    web3.eth.getBalance(account.address).then(balance => {
                        // console.log('balance', balance)
                        account.balance = web3.utils.fromWei(balance, 'ether')
                        account.balance = 0.000000000000000001 * balance
                        _this.accoundList(account)
                    });
                }
            } catch (e) {
                // console.log(e);
                _this.incorrect = true;
            }
        },
        restoreMnemonic() {
            let _this = this

            let mnemonic = _this.ruleForm.textarea
            _this.accountTexts = []
            _this.accountTexts = _this.generateAddressesFromSeed(mnemonic, _this.pagePosition);
            _this.accountTexts.map(element => {
                web3.eth.getBalance(element.address).then(balance => {
                    element.balance = web3.utils.fromWei(balance, 'ether')
                    // element.balance = 0.000000000000000001 * balance
                });
            });
        },
        accoundList(acc) {
            let _this = this
            let found = false
            for (let account of this.accounts) {
                if (account.address == acc.address) found = true;
            }
            if (found) {
                _this.$emit('getImportDialog', false)
                return
            };
            if (!acc.name) {
                acc.name = `Wallet ${_this.idexChild}`;
                _this.idexChild += 1;
            }
            _this.accounts.push(acc);
            sessionStorage.setItem('accoundList', JSON.stringify(_this.accounts))
            _this.$emit('getImportDialog', false, _this.idexChild, _this.accounts)
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
        inputJY(type, val) {
            if(type == 1){
                this.ruleForm.private_key_tip = !this.inputPrivateKey.test(val) && val ? true : false
            }else if(type == 2){
                this.ruleForm.enter_password_tip = !this.inputPrivateKeyPass.test(val) && val ? true : false
            }else if(type == 3){
                this.ruleForm.enter_textarea_password_tip = !this.inputPrivateKeyPass.test(val) && val ? true : false
            }
        },
        generateAddressesFromSeed(seed, startingPosition) {
            const Tx = require('ethereumjs-tx');
            const bip39 = require("bip39");
            const hdkey = require('ethereumjs-wallet/hdkey');
            const util = require('ethereumjs-util');

            let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(seed));
            let wallet_hdpath = "m/44'/60'/0'/0/";
            const key = hdwallet.derivePath("m/44'/60'/0'/0/0");

            const address = util.pubToAddress(key._hdkey._publicKey, true);
            const addressHex = util.toChecksumAddress(address.toString('hex'));
            const privateKey = util.bufferToHex(key._hdkey._privateKey);

            let accounts = [];
            for (let i = startingPosition; i < startingPosition + 8; i++) {

                let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
                let address = '0x' + wallet.getAddress().toString("hex");
                let privateKey = '0x' + wallet.getPrivateKey().toString("hex");
                accounts.push({ address: address, privateKey: privateKey, balance: '' });

            }

            return accounts;
        },
        tableCellClassName({row, column, rowIndex, columnIndex}){
            //利用单元格的 className 的回调方法，给行列索引赋值
            row.index = rowIndex;
            column.index = columnIndex;
        },
        cellClick(row, column, cell, event){
            // console.log(row.index);  //选中行
            let _this = this
            _this.radio = '1-' + row.index
            _this.mnemonicAccountSelected = true
            _this.mnemonicDerivedPk = row.privateKey
        },
        handleCurrentChange(val) {
            // console.log('textarea table change:', val)
        },
        toPrevious() {
            if (this.pagePosition >= 1) {
                this.pagePosition--;
            }
        },
        toNext() {
            this.pagePosition++;
        }
    },
    mounted() {
        let _this = this
        document.onkeydown = function(e) {
            if (e.keyCode === 13) {
                if(_this.ruleForm.password && _this.upload_file){
                    _this.submitForm(_this.keyStore, null, _this.ruleForm.password)
                }
            }
        }

    }
};
</script>
<style lang="scss" scoped>
.el-drawer__wrapper /deep/{
    font-size: 0.16rem;
    color: #fff;
    .el-drawer{
        background: rgba(12, 12, 12, 0.8);
        padding: 0.24rem 0 0;
        width: 520px !important;
        .el-drawer__header{
            padding: 0 0.32rem;
            margin-bottom: 0.3rem;
            font-size: 0.24rem;
            color: #fff;
        }
        .el-drawer__body{
            // overflow: hidden;
        }
    }
    .demo-drawer__content{
        .el-tabs{
            .el-tabs__header{
                .el-tabs__nav{
                    border: 0;
                    border-bottom: 1px solid #666;
                    background: #333;
                    border-radius: 0;
                    width: 100%;
                    .el-tabs__item{
                        width: 33.33%;
                        padding: 0;
                        text-align: center;
                        border: 0;
                        color: #fff;
                        font-size: 0.16rem;
                        &:nth-child(2){
                            border-right: 1px solid #666;
                            border-left: 1px solid #666;
                        }
                    }
                    .is-active{
                        color: #8f8fff;
                    }
                }
            }
            .el-tabs__content{
                margin: 0 0.32rem;
                .text{
                    margin: 0 0 0.048rem;
                    font-size: 0.16rem;
                    font-weight: 100;
                    white-space: normal;
                    word-break: break-all;
                    line-height: 2;
                    color: #fff;
                }
                .js{
                    color: #5c3cd3;
                }
                .upload-demo{
                    .el-upload{
                        width: 100%;
                        .el-upload-dragger{
                            width: calc(100% - 0.12rem);
                            height: auto;
                            padding: 0.15rem 0.1rem;
                            background: transparent;
                            border: 1px dashed #fff;
                            border-radius: 0;
                            color: #fff;
                            .el-upload__text{
                                font-size: 0.16rem;
                                color: inherit;
                                line-height: 2;
                            }
                            &:hover{
                                background: #34495E;
                                color: #39D2B4;
                            }
                        }
                    }
                }
                .el-form{
                    width: 100%;
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
                            .el-textarea{
                                .el-textarea__inner{
                                    width: 100%;
                                    background: #a4a4ff;
                                    border: 1px solid #fff;
                                    font-size: 0.16rem;
                                    color: #000;
                                    border-radius: 0;
                                }
                            }
                            p{
                                margin: 0 0 0.05rem;
                                font-size: 12px;
                                color: #d10000;
                                white-space: normal;
                                word-break: break-all;
                                line-height: 1;
                            }
                            .btn_tip{
                                display: flex;
                                margin: 0.05rem 0 0.1rem;
                                align-items: center;
                                span{
                                    font-size: 0.16rem;
                                    line-height: 1.2;
                                }
                                .el-button{
                                    margin: 0 0.1rem;
                                }
                            }
                        }
                    }
                }
                .el-row{
                    .el-col{
                        .el-table{
                            font-size: 0.13rem;
                            background: transparent;
                            tr{
                                background: transparent;
                                
                                &:hover{
                                    td{
                                        color: orange;
                                    }
                                }
                            }
                            th, td{
                                padding: 0.1rem 0;
                                background: transparent;
                                color: #fff;
                                border: 0;
                                border-radius: 0;
                                font-weight: 400;
                                text-align: center;
                                cursor: pointer;
                                .cell{
                                    padding: 0;
                                    line-height: 1.2;
                                    .el-radio{
                                        .el-radio__label{
                                            display: none;
                                        }
                                    }
                                }
                            }
                            td{
                                padding: 0.02rem 0;
                                &:nth-child(2){
                                    text-align: left;
                                }
                            }
                            &::before{
                                height: 0;
                            }
                        }
                        .textarea_page{
                            padding: 0.04rem 0.08rem;
                            margin: 0.05rem 0.05rem 0 0;
                            font-size: 12px;
                            border-radius: 0;
                            color: #000;
                            border-color: #363636;
                        }
                        .is-disabled{
                            background: #616161;
                            color: #363636;
                        }
                    }
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
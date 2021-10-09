<template>
    <el-drawer :title="$t('dashboard.EXPORTKEYSTORE')" :visible.sync="exportStoreDialog" custom-class="demo-drawer"
        ref="drawer" :before-close="setMsgtoParent" :wrapperClosable="false"
    >
    <div class="demo-drawer__content">
        <div class="subtitle">{{$t('dashboard.STOREOFFLINE')}}</div>
        <div class="desc">{{$t('dashboard.PLEASESTORE')}}</div>
        <div class="subtitle">{{$t('dashboard.DONTTRANSFER')}}</div>
        <div class="desc"><!-- {{$t('dashboard.DONTUSEMAIL')}} --></div>
        <div class="subtitle">{{$t('dashboard.STORE')}}</div>
        <div class="desc">{{$t('dashboard.IFYOU')}}</div>

        <el-form :model="newAccount" ref="newAccount" @submit.native.prevent>
            <el-form-item :label="$t('dashboard.ENTER')" prop="password">
                <el-input type="password" v-model="newAccount.password" autocomplete="off" maxlength="30" 
                    @input="inputChange" :disabled="newAccount.keystore_show?true:false"></el-input>
                <p v-if="incorrect">{{$t('dashboard.PASSWORDINCORRECT')}}</p>
            </el-form-item>
            <el-form-item label="" prop="keystore" v-if="newAccount.keystore_show">
                <el-input type="textarea" :rows="5" v-model="newAccount.keystore" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
            <el-button 
                v-if="newAccount.keystore_show"
                :type="!newAccount.keystore?'info':'primary'" 
                :disabled="!newAccount.keystore?true:false" 
                @click="download">
                {{ $t('dashboard.DOWNLOAD') }}
            </el-button>
            <el-button 
                v-else
                :type="!newAccount.password || incorrect?'info':'primary'" 
                :disabled="!newAccount.password || incorrect?true:false" 
                @click="submitForm('newAccount')">
                {{ $t('dashboard.EXPORT') }}
            </el-button>
        </div>
    </div>
    </el-drawer>

</template>
<script>
export default {
    data() {
        return {
            width: document.body.clientWidth>600?'400px':'90%',
            loading: false,
            newAccount: {
                password: '',
                keystore: '',
                keystore_show: false
            },
            inputPrivateKeyPass: /^(?=.*\d)(?=.*[a-z]).{6,30}$/,
            incorrect: false,
            addressAll: []
        };
    },
    props: ['exportStoreDialog', 'address'],
    watch: {
        'exportStoreDialog': function() {
            if(!this.exportStoreDialog){
                this.newAccount = {
                    name: '',
                    keystore: '',
                    keystore_show: false
                }
            }
        }
    },
    methods: {
        submitForm(formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
            if (valid) {
                _this.addressAll.map(item => {
                    if(item.address == _this.address && item.password == _this.newAccount.password){
                        _this.newAccount.keystore = JSON.stringify(item.keystore)
                        _this.incorrect = false
                        _this.newAccount.keystore_show = true
                    }
                })

                if(!_this.newAccount.keystore){
                    _this.incorrect = true
                    _this.newAccount.keystore_show = false
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        download() {
            let _this = this
            let keyClose = JSON.parse(_this.newAccount.keystore);
            if (typeof keyClose == 'string') {
                keyClose = JSON.parse(JSON.parse(_this.newAccount.keystore));
            }else{
                keyClose = JSON.parse(_this.newAccount.keystore);
            }
            const keyObject = keyClose;
            console.log("keyObject", keyObject.address)
            const blob = new Blob([_this.newAccount.keystore], { type: 'application/json' });
            const file = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date();
            const m = date.getMonth() >= 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1);
            const d = date.getDate() >= 10 ? date.getDate().toString() : "0" + date.getDate();
            const h = date.getHours() >= 10 ? "h" + date.getHours() : "h0" + date.getHours();
            const min = date.getMinutes() >= 10 ? "m" + date.getMinutes() : "m0" + date.getMinutes();
            const sDate = date.getFullYear().toString() + m + d + h + min;
            link.href = file;
            link.download = `NBAI-UTC-${sDate}-${keyObject.address}`;
            link.click;
            link.dispatchEvent(new MouseEvent('click'));
            window.URL.revokeObjectURL(link.href);
        },
        setMsgtoParent(){
            this.$emit('getExportStoreDialog',false)
        },
        inputChange(){
            if(this.newAccount.password) this.incorrect = false
        }
    },
    mounted() {
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
    .desc {
        font-size: .128rem;
        font-weight: 100;
        padding-bottom: 0.24rem;
        line-height: 0.16rem;
        text-align: left;
        width: 94%;
        margin: auto;
        color: #fff;
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
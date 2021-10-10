<template>
    <el-drawer :title="$t('dashboard.EXPORTPRIVATE')" :visible.sync="exportDialog" custom-class="demo-drawer"
        ref="drawer" :before-close="setMsgtoParent" :wrapperClosable="false"
    >
    <div class="demo-drawer__content">
        <div class="subtitle">
            {{$t('dashboard.WARNINGEXPORT')}}
        </div>
        <el-form :model="newAccount" ref="newAccount" @submit.native.prevent>
            <el-form-item :label="$t('dashboard.ENTER')" prop="password">
                <el-input type="password" v-model="newAccount.password" autocomplete="off" maxlength="30" 
                    @input="inputChange" :disabled="newAccount.privateKey_show?true:false"></el-input>
                <p v-if="incorrect">{{$t('dashboard.PASSWORDINCORRECT')}}</p>
            </el-form-item>
            <el-form-item label="" prop="privateKey" v-if="newAccount.privateKey_show">
                <el-input type="textarea" :rows="5" v-model="newAccount.privateKey" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
            <el-button 
                v-if="newAccount.privateKey_show"
                :type="!newAccount.privateKey?'info':'primary'" 
                :disabled="!newAccount.privateKey?true:false" 
                @click="copyText(newAccount.privateKey)">
                {{ $t('dashboard.COPY') }}
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
                privateKey: '',
                privateKey_show: false
            },
            inputPrivateKeyPass: /^(?=.*\d)(?=.*[a-z]).{6,30}$/,
            incorrect: false,
            addressAll: []
        };
    },
    props: ['exportDialog', 'address'],
    watch: {
        'exportDialog': function() {
            if(!this.exportDialog){
                this.newAccount = {
                    password: '',
                    privateKey: '',
                    privateKey_show: false
                }
            }
        }
    },
    methods: {
        copyText: function(text){
            let _this = this
            let saveLang = _this.$store.getters.language == 'cn'?"复制成功":"success";
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
                // console.log('Copying text command was ' + msg);
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
        submitForm(formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
            if (valid) {
                _this.addressAll.map(item => {
                    if(item.address == _this.address && item.password == _this.newAccount.password){
                        _this.newAccount.privateKey = item.privateKey
                        _this.incorrect = false
                        _this.newAccount.privateKey_show = true
                    }
                })

                if(!_this.newAccount.privateKey){
                    _this.incorrect = true
                    _this.newAccount.privateKey_show = false
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        setMsgtoParent(){
            this.$emit('getExportDialog',false)
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
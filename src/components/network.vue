<template>
    <el-dialog :title="$t('header.NETWORK')" :visible.sync="networkDialog" :width="width" :before-close="setMsgtoParent">
        <el-form :model="form" @submit.native.prevent>
            <el-form-item :label="$t('header.NODE')">
                <el-input v-model="form.url" autocomplete="off" @input="checkNote" :class="{'err': validNode}"></el-input>
                <p v-if="validNode">Invalid node address</p>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :type="validNode?'info':'primary'" :disabled="validNode?true:false" @click="submit">{{ $t('header.CONFIRM') }}</el-button>
            <el-button @click="setMsgtoParent">{{ $t('header.CANCAL') }}</el-button>
        </div>
    </el-dialog>

</template>
<script>
export default {
    data() {
        return {
            width: document.body.clientWidth>600?'400px':'90%',
            form: {
                url: this.$root.networkUrl
            },
            validNode: false
        };
    },
    props: ['networkDialog'],
    methods: {
        submit(){
            this.$root.networkUrl = this.form.url
            this.setMsgtoParent()
        },
        setMsgtoParent(){
            this.$emit('getNetworkDialog',false)
        },
        checkNote(){
            let _this = this
            let web3 = new Web3(_this.form.url);
            web3.setProvider(_this.form.url);
            web3.eth.getBlockNumber().then(res => {
                _this.validNode = false
            }, err => {
                _this.validNode = true;
            });
        }
    },
    mounted() {}
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper /deep/{
    .el-dialog__header{
        display: flex;
    }
    .el-form{
        .el-form-item__content{
            p{
                color: red;
                font-size: 12px;
                line-height: 1.2;
            }
            .err{
                .el-input__inner{
                    border-color: red;
                }
            }
        }
    }
    .dialog-footer{
        display: flex;
        justify-content: center;
        margin-bottom: 0.2rem;
    }
}
</style>
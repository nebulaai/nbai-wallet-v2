<template>
    <div class="wrapper" id="wrapper" ref="area">
            <v-head :totalStr="totalStr"></v-head>
            <div class="content">
                <transition name="move" mode="out-in">
                    <router-view @getTotalStr="getTotalStr"></router-view>
                </transition>
            </div>
            <v-foot :positionStyle="positionStyle"></v-foot>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vFoot from './Footer.vue';
import elementResizeDetectorMaker from "element-resize-detector"
export default {
    data() {
        return {
            bodyWidth: document.body.clientWidth<=1024?true:false,
            positionStyle: false,
            totalStr: 0
        };
    },
    components: {
        vHead,
        vFoot
    },
    computed: {
        headertitle() {
            return this.$store.getters.headertitle
        },
        routerMenu() {
            return this.$store.getters.routerMenu
        },
    },
    watch: {
        $route: function (to, from) {
        }
    },
    mounted() {
        this.footer_style()
    },
    methods: {
        getTotalStr(acc) {
            // console.log(acc)
            let _this= this
            let tre = 0
            
            acc.map(item => {
                tre = _this.bigAdd(tre, item.balance)
            })

            setTimeout(function(){
                _this.$nextTick(_ => {
                    _this.totalStr = tre
                });
            }, 1500)
        },
        bigAdd(num1, num2) {
            const num1Str = num1.toString();
            const num2Str = num2.toString();
            let num1Int = this.int(num1Str);
            let num1Dec = this.dec(num1Str);
            let num2Int = this.int(num2Str);
            let num2Dec = this.dec(num2Str);
            const diffInt = num1Int.length - num2Int.length;
            const diffDec = num1Dec.length - num2Dec.length;
            if (diffInt < 0) {
            for (let i = 0; i < Math.abs(diffInt); i++) {
                num1Int = '0' + num1Int;
            }
            }
            else {
            for (let i = 0; i < Math.abs(diffInt); i++) {
                num2Int = '0' + num2Int;
            }
            }
            if (diffDec < 0) {
            for (let i = 0; i < Math.abs(diffDec); i++) {
                num1Dec = num1Dec + '0';
            }
            }
            else {
            for (let i = 0; i < Math.abs(diffDec); i++) {
                num2Dec = num2Dec + '0'
            }
            }
            // console.log('dec', num1, num2, num1Dec, num2Dec);
            let sumDecArr = [];
            let sumIntArr = [];
            const num1DecArr = num1Dec.split('');
            const num2DecArr = num2Dec.split('');
            const num1IntArr = num1Int.split('');
            const num2IntArr = num2Int.split('');
            let upToInt = 0;
            for (let i = num1Dec.length - 1; i >= 0; i--) {
            let sum = Number(num1DecArr[i]) + Number(num2DecArr[i]);
            // console.log('sum', i, sum, num1DecArr[i], num2DecArr[i]);
            if (sum >= 10) {
                let up = (sum - sum % 10) / 10;
                sum = sum % 10;
                if (i == 0) {
                upToInt = up;
                }
                else {
                num1DecArr[i - 1] = Number(num1DecArr[i - 1]) + up;
                }
            }
            sumDecArr.unshift(sum);
            // console.log('str', sumDecArr);
            }
            num1IntArr[num1IntArr.length - 1] = Number(num1IntArr[num1IntArr.length - 1]) + upToInt;
            for (let i = num1Int.length - 1; i >= 0; i--) {
            let sum = Number(num1IntArr[i]) + Number(num2IntArr[i]);
            // console.log('sum', i, sum, num1IntArr[i], num2IntArr[i]);
            if (sum >= 10) {
                let up = (sum - sum % 10) / 10;
                sum = sum % 10;
                if (i == 0) {
                sumIntArr.unshift(up);
                }
                else {
                num1IntArr[i - 1] = Number(num1IntArr[i - 1]) + up;
                }
            }
            sumIntArr.unshift(sum);
            // console.log('str', sumDecArr);
            }
            if (sumDecArr.length != 0) {
            return sumIntArr.join('') + '.' + sumDecArr.join('');
            }
            return sumIntArr.join('');
        },
        int(num) {
            if (num.indexOf('.') !== -1) {
                return num.substring(0, num.indexOf('.'));
            }
            return num;
        },
        dec(num) {
            if (num.indexOf('.') !== -1) {
                return num.substring(num.indexOf('.') + 1);
            }
            return '';
        },
        footer_style() {
            //   this.positionStyle = false
            //   let wrapperH = document.querySelector("#wrapper").clientHeight
            //   let areaHomeH = document.querySelector("#areaHome").clientHeight
            //   this.positionStyle = areaHomeH < wrapperH ? true : false
            //   console.log(areaHomeH, wrapperH, this.positionStyle)

            let _this = this
            _this.positionStyle = false

            let erd = elementResizeDetectorMaker();
            erd.listenTo(this.$refs.area, (element) => { 
                // 这里的this.$refs.fan指定要监听的元素对象
                let width = element.offsetWidth;
                let height = element.offsetHeight;
                let clientHeight = document.documentElement.clientHeight;
                _this.$nextTick(() => {
                // console.log('element', clientHeight, height);

                if(height < clientHeight){
                    // document.body.style.height = clientHeight + 'px'
                    _this.positionStyle = true
                }else{
                    // document.body.style.height = '100%'
                    _this.positionStyle = false
                }

                })
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.wrapper{
    .content{
        .el-backtop{
            background-color: #45a2ff;
        }
        .el-backtop, .el-calendar-table td.is-today{
            color: #fff;
        }
    }
    &::-webkit-scrollbar-track {
        background: #f7f7f7;
    }
    &::-webkit-scrollbar {
        width: 6px;
        background: #ccc;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
    }
}
</style>
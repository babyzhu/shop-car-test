var vm=new Vue({
    el:"#app",
    // 参数
    data:{
        productList:[],
        totalMoney:0,
        checkedflag:false,
        delFlag:false,
        curProduct:'',
        cartts:'',
        checklen:''
    },
    // 局部过滤器
    filters:{
        formatMoney:function(value){
            return "￥"+ value.toFixed(2);
        }
    },
    //生命周期
    mounted:function(){
        //实例化编译完后要查询某个方法相当jq的$(function(){}) 
        // 为了确保dom完全插入 需要使用到 this.$nextTick
        this.$nextTick(function(){
            this.cartView();
        })
    },
    //方法
    methods:{
        cartView:function(){
            // 1.0 vue 是用vue-resource 来ajax的请求
            // 2.0 可以用使用axios 做ajax请求
            var _this=this;
            axios.post("data/cartData.json").then(function(res){
                if(res.data.status==1){
                    _this.productList=res.data.result.list;
                }          
            })
        },
        changeMoney:function(product,way){
            // way 1 ++
            // way -1 --
            if(way>0){
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity=1
                }
            }   
            this.calcTotalPrice();
        },
        selectProduct:function(item){
            if(typeof item.checked=="undefined"){
                // 全局Vue.set 注册一个本身没有的参数
                Vue.set(item,"checked",true);
                // 局部注册
                //this.set(item,"checked",true);
            }else{
                item.checked=!item.checked;
            }
            //一个一个单点列表全部都选中了就把全选按钮打上勾，
            //通过打钩的个数和总的列表个数进行对比
            var _this=this;
            _this.checklen=0;
            this.productList.forEach(function(item,index){
                if(item.checked){
                    _this.checklen++;
                }
            })
            if(_this.checklen==this.productList.length){
                this.checkedflag=true;
            }else{
                this.checkedflag=false;;
            }
            if(_this.checklen==0){
                _this.checklen="";
            }
            this.calcTotalPrice();
        },
        checkALL:function(flag){
            this.checkedflag=flag;
            var _this=this; 
            this.productList.forEach(function(item,index) {
                if(typeof item.checked=="undefined"){
                    // 全局Vue.set 注册一个本身没有的参数
                    Vue.set(item,"checked",_this.checkedflag);
                }else{
                    item.checked=_this.checkedflag;
                }
            });
            this.calcTotalPrice();  
        },
        calcTotalPrice:function(){
            // 计算总金额,遍历列表。遍历之前都把金额清0，然后把有选中的商品总金额相加
            var _this=this;
            _this.totalMoney=0;
            this.productList.forEach(function(item,index){
                if(item.checked){
                    _this.totalMoney +=item.productPrice*item.productQuantity
                }
            })
            _this.cartts="";
        },
        delConfirm:function(item){
            this.delFlag=true;
            this.curProduct=item;
        },
        delProduct:function(){
            var index=this.productList.indexOf(this.curProduct);
            // console.log(index);
            this.productList.splice(index,1);
            this.delFlag=false;
            this.calcTotalPrice();      
        },
        jsProdect:function(e){
            var target=e.target;
            // 点击结算，如果没有选中商品则出现提示，有选中则跳到地址选配页
            var _this=this;
            this.productList.forEach(function(item,index){
                if(item.checked){
                   var url=target.getAttribute("data-href");
                   window.location=url;
                    _this.cartts="";
                }else{
                    _this.cartts="请选择商品"
                }
            })
        }
    }
});
// 全局过滤器
Vue.filter("money",function(value,type){
    return "￥"+ value.toFixed(2) + type;
})

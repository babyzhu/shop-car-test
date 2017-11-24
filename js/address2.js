var vm=new Vue({
    el:".container",
    data:{
        limitNum:3,
        addressList:[],
        currentIndex:0,
        shippingMethod:1,
        curaddress:'',
        selected:-1,
        delFlag:false,
        editFlag:false,
        overlayFlag:false
    },
    mounted:function(){
        this.$nextTick(function(){
            this.getAddressList();
        })
    },
    computed:{
        // 通过 过滤器来实现是显示3个地址。
        filterAddress:function(){
            return this.addressList.slice(0,this.limitNum);
        }
    },
    methods:{
        getAddressList:function(){
            var _this=this;
            axios.post("data/address.json").then(function(res){
                if(res.data.status=="0"){
                    _this.addressList=res.data.result;
                }      
            })
        },
        loadMore:function(){
            // more
            if(this.limitNum==3){
                this.limitNum=this.addressList.length;
            }else{
                this.limitNum=3;
            }       
        },
        // 设置默认地址后排在列表的第一位 @click="setDefault(item,index)"    
        setDefault:function(item,index){
            this.addressList.forEach(function(value,index){
                value.isDefault = false
            })
            this.addressList.splice(index, 1);
            this.addressList.unshift(item);
            item.isDefault=true;
        },
        // 点击删除出现弹窗。并把当前块复制
        delConfirm:function(index,item){
            this.closeConfirm(1);
            this.curaddress=item;
            this.selected=index;
        },
        // 弹窗点击yes删除地址
        delAddress:function(){
            this.addressList.splice(this.selected,1);
            this.closeConfirm();
        },
        // 点击关闭按钮和NO
        closeConfirm:function(n){
            // 遮罩层
            switch(n){
                // del
                case 1:{
                    this.overlayFlag=this.delFlag=!this.delFlag; 
                    break;
                }
                // edit
                case 2:{
                    this.overlayFlag=this.editFlag=!this.editFlag; 
                    break;
                } 
                default:{
                    this.editFlag=this.delFlag=this.overlayFlag=!this.overlayFlag;
                    break;
                }  
            }     
        },
        // 点击编辑出现弹窗；
        editConfirm:function(index,item){
            this.closeConfirm(2);
            this.selected=index;
            //（浅拷贝）直接赋值
            //this.curaddress=item;      
            // 而我们需要的时候点击保存之后在保存数据
            //this.curaddress=item;
            //改成下面的(通过转换变成深拷贝)
            this.curaddress=JSON.parse( JSON.stringify(item));   
        },    
        // 点击编辑后的保存
        saveAddress:function(){
            //console.log(this.selected);
            if(this.selected>-1){
                Vue.set(this.addressList, this.selected,this.curaddress);
                this.selected=-1;
            }else{
                this.addressList.push(this.curaddress);
                this.limitNum=this.addressList.length;
            }
            // ajax sucesss
            this.closeConfirm();
        },
        // 新增地址
        addAddress:function(){
            this.closeConfirm(2);
            this.curaddress = {
                "userName":"wendy",
                "streetName":"福建",
                "tel":"123456789",
                "isDefault":false
              };
        }
    }
})
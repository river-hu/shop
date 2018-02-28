var vm = new Vue({
    el:".container",
    data:{
        search:"",
        shop:[],
        allpage:0,
        pageIndex:1
    },
    watch:{
        pageIndex:function(){
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/query.do",{
                params:{
                    page:vm.pageIndex,
                    count:10,
                    name:vm.search
                }
            }).then(function(response){
                if( response.data.msg=="没有数据"){//非空验证
                    vm.shop = [];
                    vm.allpage = 0;
                }else{
                    vm.shop = response.data.data.list;
                    vm.allpage = response.data.data.total;
                }
            }).catch(function(error){
            })
        }
    },
    methods:{
        goto:function(index){//页面跳转，跳转去商品详情页
            if(this.shop[index].shop_goods_sorts.length!=0){
                window.location.href="./dec.html?id="+this.shop[index].id;
            }else{
                showModel({
                    icon:"icon-warning",
                    text:"没有商品详细数据"
                },1500)
            }
            
        },
        pre:function(){
            if(this.pageIndex!=1){
                this.pageIndex--;
            }
        },
        next:function(){
            if(this.allpage>1&&this.pageIndex<this.allpage){
                this.pageIndex++;
            }
        },
        search_shop:function(){//商品搜索功能
            var search = this.search;
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/query.do",{
                params:{
                    page:1,
                    count:10,
                    name:search
                }
            }).then(function(response){
                console.log(response.data);
                if( response.data.msg=="没有数据"){//非空验证
                    vm.shop = [];
                    vm.allpage = 0;
                    showModel({//弹出框提示
                        icon:"icon-warning",
                        text:"没有相应的商品"
                    },1500)
                }else{
                    vm.shop = response.data.data.list;
                    vm.allpage = response.data.data.total;
                }
            }).catch(function(error){
            })
        }
    },
    created:function(){
        this.search = sessionStorage.search_id;
        var search = this.search;
        
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/query.do",{//商品搜索功能
            params:{
                page:1,
                count:10,
                name:search
            }
        }).then(function(response){
            console.log(response.data);
            if( response.data.msg=="没有数据"){//非空验证
                vm.shop = [];
                vm.allpage = 0;
                showModel({
                    icon:"icon-warning",
                    text:"没有相应的商品"
                },1500)
            }else{
                vm.shop = response.data.data.list;
                vm.allpage = response.data.data.total;
            }
           
            
        }).catch(function(error){
        })
    }
})
var vm = new Vue({
    el:".container",
    data:{
        search:"",
        arr:[],
        sortIndex:0,
        arrIndex:[],
        shop:{}
    },
    methods:{
        search_shop:function(){//跳转搜索页
            sessionStorage.search_id=this.search;
            window.location.href="./searchshop.html"
        },
        toggle:function(index){//页面切换
            if(this.sortIndex==index){
                this.sortIndex=-1;
            }else{
                this.sortIndex=index;
            }         
        },  
        goto:function(k){//跳转商品详情页
            if(k.shop_goods_sorts.length!=0){
                window.location.href="./dec.html?id="+k.id;//页面跳转，附带商品id
            }else{
                showModel({
                    icon:"icon-warning",
                    text:"暂无此商品的详细数据"
                },1500)
            }
           
        }

    },
    created:function(){
        show_loading();
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/firstSortController/query.do").then(function(response){//获取一级分类
            console.log(response.data.data);
            vm.arr = response.data.data;
            for( var j in response.data.data){
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/secondSortController/query.do",{//根据一级分类获取二级分类
                params:{
                    firstid:vm.arr[j].id//默认获取第一页商品数据
                }
            }).then(function(response){//根据二级分类获取商品数据
                
                console.log(response.data.data);
                vm.arr[j].list = response.data.data;
                for(var i in response.data.data){
                        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/query.do",{
                            params:{
                                secondId:response.data.data[i].id
                            }
                        }).then(function(response){
                            console.log(response.data);
                            hide_loading();
                            vm.arr[j].list[i].shop=response.data.data;
                        })
                }
            
            })
        }
        }).catch(function(error){

        })
    }
})
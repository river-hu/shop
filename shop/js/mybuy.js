Vue.filter('date', function (value) {
    if (!value) return '';
          return value.substring(5).substr(0,11);
  })
var vm=new Vue({
    el:".container",
    data:{
        nin:5,
        num:'',
        num_off:false,
        arrindex:0,
        userid:0,
        items:[],
        shop:[],
        itemindex:-1,
        arrnav:[
            {
                name:'全部订单',
                url:'#tab1'
            },
            {
                name: '待发货',
                url:'#tab2'
            },
            {
                name: '待评价',
                url:'#tab3'
            },
            {
                name:'已评价',
                url:'#tab4'
            }
        ],
        state:[
            '未完成支付',
            '未发货',
            '待评价',
            '已评价'
        ],
        address:[],
        off:false,
        shopindex:0

    },
    watch:{
        num:function(){
            if(this.num.length>=150){
                this.num=this.num.substring(0,150);
                this.num_off=true;
            }else{
                this.num_off=false;
            }
            
        }
    },
    methods:{
        wuliu:function(index){
            this.itemindex=this.itemindex==index?-1:index;   
            if(this.itemindex!=-1){
                show_loading();
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/getExpressInfo.do",{
                    params:{
                        id:vm.items[vm.itemindex].id
                    }
                }).then(function(response){
                    vm.address = response.data.data.map.Traces.myArrayList;
                    hide_loading();
                }).catch(function(error){
                })
            }
        },
        submit:function(){
            show_loading();
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsEvaluationController/add.do",{
                params:{
                    'wechatUserId':vm.userid,
                    'goodsId':vm.items[vm.shopindex].goodsId,
                    'orderId':vm.items[vm.shopindex].id,
                    'content':vm.num,
                    'star':vm.nin
                }
            }).then(function(response){
                console.log(response.data);
                vm.off = false;
                var userid = vm.userid;
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/query.do",{
                    params:{
                        'wechat_user_id':userid,
                        'page':1,
                        'count':1000
                    }
                }).then(function(response){
                    console.log(response.data);
                    vm.shop = response.data.data.list;
                    vm.toggle(vm.arrindex);
                    hide_loading();
                }).catch(function(error){
                })
            }).catch(function(error){
            })
        },
        pp:function(index){//显示商品评价面板
                this.off = true;
                this.shopindex = index;
        },
        evaluate:function(index){
            if(typeof index =='number'){
                
                 this.nin=index;
            }
        },
        del:function(){
            this.num = '';
            this.nin = 5;
            this.off = false;
        },
        toggle:function(index){
            this.arrindex = index;
            this.items = [];
            this.itemindex = -1;
            if(index!=0){
                for(var i in this.shop){
                    if(this.shop[i].state==index){
                        this.items.push(this.shop[i]);
                    }
                }
            }else{
                this.items = this.shop;
            }
        }
    },
    created:function(){
        this.userid = sessionStorage.userid;
        if(this.userid==''||this.userid==undefined||this.userid=='undefined'){
            window.location.href="../user/index.html";
        }
        var userid = this.userid;
        show_loading();
        this.userid = 33;
        var userid = this.userid;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/query.do",{
            params:{
                'wechat_user_id':userid,
                'page':1,
                'count':1000
            }
        }).then(function(response){
            console.log(response.data);
            vm.shop = response.data.data.list;
            vm.items = vm.shop;
            hide_loading();
        }).catch(function(error){
        })
    }
})
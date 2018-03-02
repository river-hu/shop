var vm = new Vue({
    el:".container",
    data:{
        binner:[],//轮播图数据
        currentIndex: 0,//当前显示图片的索引
        timer: '',//轮播图定时器 
        transition:"list",//轮播图切换效果
        page:{list:[],totel:0},//商品列表数据
        pageIndex:1
    },
    watch:{
        pageIndex:function(){
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/query.do",{
                params:{
                    "page":vm.pageIndex,
                    "count":10
                }
            }).then(function(response){
                console.log(response.data);
                vm.page=response.data.data;
                localStorage.setItem("shop",JSON.stringify(vm.page.list[0]));
            }).catch(function(){
            });
        }
    },
    methods:{
        upto:function(){
            if(this.pageIndex>1){
                this.pageIndex--;
            }
        },         
        downto:function(){
            console.log(this.page.total);
            
            if(this.pageIndex<this.page.total){
                this.pageIndex++;
            }

        },
        go:function() {//定时轮播
            this.timer = setInterval(() => {
                this.autoPlay()
            }, 4000)
        },
        stop:function() {//暂停播放
            clearInterval(this.timer)
            this.timer = null
        },
        autoPlay:function() {//下一个
            this.transition="list";
            this.currentIndex++
            if (this.currentIndex > this.binner.length - 1) {
                this.currentIndex = 0

            }
        },
        left:function(){//向左滑动
            this.stop();
            this.autoPlay();
            this.go();
        },
        right:function(){//向右滑动
            this.transition="list2";
            this.stop();
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.binner.length - 1
            }
            this.go();  

        },
        goto_dec:function(index){
            if(this.page.list[index].shop_goods_sorts.length!=0){
                window.location.href="./dec.html?id="+this.page.list[index].id
            }else{
                showModel({
                    icon:"icon-warning",
                    text:"暂无此商品的详细数据"
                },1500)
            }
        }
    },
    created:function(){
        
        show_loading();//显示加载动画
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopBannerController/query.do").then(function(response){//请求轮播图数据
            console.log(response);
            vm.binner = response.data.data;
            hide_loading();//加载完成
        });
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/query.do",{
            params:{
                "page":1,
                "count":10
            }
        }).then(function(response){
            console.log(response.data);
            vm.page=response.data.data;
        }).catch(function(){
        });
        this.$nextTick(function(){//启动轮播图
            vm.timer = setInterval(function(){
                vm.autoPlay()
            }, 4000)
        })
    }
})

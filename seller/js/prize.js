var openid = sessionStorage.openid;
var vm=new Vue({
    el:".app",
    data:{
        openid:openid,
        page:0,//当前页码
        all:0,//总页数
        loading:false,//加载控制
        prize:[],//奖品数组
        search:'',//搜索绑定数据
        cache:null,//控制搜索框的操作频率
        status:200,//存储搜索结果
        height:0,
        cache1:null//控制上拉加载的操作频率
    },
    methods:{
        search_to: function(){
            clearTimeout(this.cache);
            this.page=0;
            this.cache=setTimeout(function(){ 
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/writeOffRecord.do",{
                    params:{
                        openid:vm.openid,
                        likeName:vm.search==''?-1:vm.search,
                        begin:0,
                        pages:10
                    }
                }).then(function(response){
                    console.log(response.data)
                    if(response.data.code==200){
                        vm.all=response.data.data.pagesTotle-1;
                        vm.prize = response.data.data.pageList;
                    }                 
                    vm.status=response.data.code;
                }).catch(function(){
                })
            },500);
        },
        test:function(){
            var scrolltop=vm.$el.getElementsByClassName("content")[0].scrollHeight;//获取页面总高度
            clearTimeout(vm.cache1);//清除延时操作定时器
            var dy=scrolltop+50-window.scrollY-window.innerHeight;//滚动高与页面高度之间的差      
            this.cache1=setTimeout(function(){//延时操作
                if(dy<1&&window.scrollY!=0){//判断是否滚动到底部
                        if(vm.page<vm.all){
                            vm.page++;//页码加一
                            axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/writeOffRecord.do",{//请求数据
                                params:{
                                    openid:vm.openid,
                                    likeName:vm.search==''?-1:vm.search,//判断当前输入框的值是否为空，为空则搜索-1
                                    begin:vm.page,//当前页码
                                    pages:10
                                }
                            }).then(function(response){
                                console.log(response.data.data.pageList)
                                if(response.data.code==200){
                                    vm.all=response.data.data.pagesTotle-1;
                                    for(var i=0;i<response.data.data.pageList.length;i++){//载入本次请求数据
                                        vm.prize.push(response.data.data.pageList[i]);
                                    }
                                }
                                vm.status=response.data.code;//记录本次请求状态
                            }).catch(function(){
                                console.log(0)
                            })
                        }
                }
            },300);
        }
        
    },
    watch:{
        search:function(){
            this.search_to()
        }
    },
    mounted:function(){//监听页面滚动事件
        window.addEventListener("scroll",this.test);
    },
    created:function(){
        var vm =this;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/writeOffRecord.do",{
                params:{
                    openid:vm.openid,
                    likeName:-1,
                    begin:0,
                    pages:10
                }
            }).then(function(response){
                console.log(response.data.data.pageList)
                if(response.data.code==200){
                    vm.all=response.data.data.pagesTotle-1;
                    vm.prize = response.data.data.pageList;
                }
                vm.status=response.data.code;
            }).catch(function(){
                console.log(0)
            })
    }
})
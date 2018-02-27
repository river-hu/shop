var openid = localStorage.getItem("openid");
var app = new Vue({//蒙层实例
    el:".meng",
    data:{
            off:false,//控制蒙层二维码显示
            prize:{
                prize:{
                    name:'',
                    publishdate:""
                }
            },//存储蒙层页面显示数据
            id:''
    },
    filters: {//过滤器
        year: function (value) {//计算年份
          if (!value) return '';
          var data = new Date(Number(value))
          return data.getFullYear();
        },
        month: function (value) {//计算月份
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getMonth()+1;
          },
          day: function (value) {//计算日期
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getDate();
          },
          hour: function (value) {//小时
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getHours();
          },
          minutes: function (value) {//分钟
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getMinutes();
          },
          addzero:function(value){//数值为一位数时，十位补0
            if (!value) return '';
            var num = value<10?'0'+value:value;
            return num;
          }
      },
    methods:{
        close:function(){//关闭蒙层
            this.off=false;//关闭二维码页面加载待完成*********************
            vm.loading=false;
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/getMyPrize.do",{
                params:{
                    openid:openid,//测试openID***********
                    typeid:"1"//1 为未兑换
                }
            }).then(function(response){
                console.log(response.data);
                vm.loading=true;//取消页面加载动画
                vm.arr=response.data.data;
            }).catch(function(error){
                alert("网络错误，请刷新重试");
            })
        }
    }
});

var vm = new Vue({
    el:".app",
    data:{
        arr:[   ],//存储未兑换数据
        toggle:true,//控制未使用与已失效页面之间的切换
        arred:[ ],//存储已失效数据
        loading:false,//未兑换页面加载动画显示控制，flase为显示
        loading1:false,//已失效页面加载动画显示控制，false为显示动画
        cache:true,//已失效页面数据缓存控制
        id:0,
        codeOff:false,
        address:[],
        addIndex:0,
        arrIndex:-1
    },
    methods:{
        okAddress:function(){
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/redeemprizesController/add.do",{
                params:{
                    openid: openid,
                    addressid:vm.address[vm.addIndex].id,
                    prizeid:vm.arr[vm.arrIndex].prizeid,
                    prizessetid:vm.arr[vm.arrIndex].prizessetid,
                    lotteryrecordid:vm.arr[vm.arrIndex].lotteryrecordid,
                }
            }).then(function(response){
                console.log(response.data);
                alert("奖品会在第一时间发货，请耐心等待");
                vm.codeOff=false;
                vm.loading=false;
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/getMyPrize.do",{
                    params:{
                        openid:openid,//测试openID***********
                        typeid:"1"//1 为未兑换
                    }
                }).then(function(response){
                    console.log(response.data);
                    vm.loading=true;//取消页面加载动画
                    vm.arr=response.data.data;
                }).catch(function(error){
                    alert("网络错误，请刷新重试");
                })
            }).catch(function(error){
            })
            console.log(this.address[this.addIndex]);
        },
        toggleAddress:function(index){
            this.addIndex=index;
        },
        go_address:function(){
            window.location.href="./address.html";
        },
        code:function(index){//查看奖品二维码页面，显示蒙层
            this.arrIndex=index;
            if(this.arr[index].str5!=4){
                app.prize=this.arr[index];//获取二维码页面数据
                var url = "http://yunzhujia.qx1688.net/wxoneqrcode/end/index.html?lotteryrecordid="+this.arr[index].lotteryrecordid;//二维码信息
                console.log(url);
                $('.er').empty();//清除之前的二维码
                $('.er').qrcode({width:160,height:160,text:url});//生成二维码
                app.off=true;
            }else{
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do",{
                    params:{
                        "wechat_user_id":vm.id
                    }
                }).then(function(response){
                    
                    if(response.data.data.length==0){
                        alert("暂无收货地址，立即去添加收货地址");
                        window.location.href="./address.html";
                    }else{
                        vm.address=response.data.data;
                        vm.codeOff=true;

                    }


                }).catch(function(){
                    
                })
            }
           
        },
         togglef:function(off){//页面切换，未兑换与已失效 
             if(this.cache){//控制缓存，首次加载数据，之后不加载
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/getMyPrize.do",{
                    params:{
                        openid:openid,//测试openID**********
                        typeid:"0"//0 为已失效，1 为未兑换
                    }
                }).then(function(response){
                    console.log(response.data);
                    console.log(openid);
                     vm.loading1=true;
                     vm.cache=false;
                     vm.arred=response.data.data;
                }).catch(function(error){
                    alert("网络错误，请刷新重试");
                })
             }
             this.toggle=off;
        }
    },
    filters: {//过滤器
        year: function (value) {//计算年份
          if (!value) return '';
          var data = new Date(Number(value))
          return data.getFullYear();
        },
        month: function (value) {//计算月份
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getMonth()+1;
          },
          day: function (value) {//计算日期
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getDate();
          },
          hour: function (value) {//小时
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getHours();
          },
          minutes: function (value) {//分钟
            if (!value) return '';
            var data = new Date(Number(value))
            return data.getMinutes();
          },
          addzero:function(value){//数值为一位数时，十位补0
            if (!value) return '';
            var num = value<10?'0'+value:value;
            return num;
          }
      },
    created:function(){//页面首次加载，请求未兑换数据
        this.id = sessionStorage.userid;
        console.log(openid);
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/getMyPrize.do",{
            params:{
                openid:openid,//测试openID***********
                typeid:"1"//1 为未兑换
            }
        }).then(function(response){
            console.log(response.data);
            vm.loading=true;//取消页面加载动画
            vm.arr=response.data.data;
        }).catch(function(error){
            alert("网络错误，请刷新重试");
        })
    }
})

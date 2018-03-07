var openid = sessionStorage.openid;
var qrcodeno= one().no;
function show_loading(){//loading蒙层显示
    var model = document.getElementById("loading");
    model.style.display="block";
}
function hide_loading(){//loading蒙层隐藏
    var model = document.getElementById("loading");
    model.style.display="none";
}
if(qrcodeno=="undefined"||qrcodeno==undefined){
    qrcodeno="-1";
    var activityid=one().activityid;
}else{
    var activityid="0";
}
var vm = new Vue({
    el: "#body",
    data: {
        num: 0,//转盘旋转角度
        height: 0,//整体高度
        qrcodeno: qrcodeno,//小包码
        over_img:"",
        over_src: '',//两种模态框背景图
        pan: [//转盘内置数据
            {
                prize: {
                    name: "谢谢参与",
                    photo: './img/kong.png'
                },
                prizeid: null,
                id:null
            },
            {
                prize: {
                    name: "谢谢参与",
                    photo: './img/kong.png'
                },
                prizeid: null,
                id:null
            },
            {
                prize: {
                    name: "谢谢参与",
                    photo: './img/kong.png'
                },
                prizeid: null,
                id:null
            },
            {
                prize: {
                    name: "谢谢参与",
                    photo: './img/kong.png'
                },
                prizeid: null,
                id:null
            },
            {
                prize: {
                    name: "谢谢参与",
                    photo: './img/kong.png'
                },
                prizeid: null,
                id:null
            },
            {
                prize: {
                    name: "谢谢参与",
                    photo: './img/kong.png'
                },
                prizeid: null,
                id:null
            }
        ],
        gps:{},//位置信息
        activityid:12,//活动id
        prize:{//奖品信息
            name:'',//奖品名称
            photo:''//奖品图片
        },
        gps_code:{},
        subscribe:0,
        off_all:true,
        j_off:false
    },
    methods: {
        go_user:function(){
                vm.get_ai(this.j_off);//提示用户关注公众号
                window.location.href="../user/index.html";
        },
        start: function () {     
            if(this.off_all){
                this.off_all=false;
                vm.get_prize();
            }else{
            }    
        },
        get_ai:function(off){//判断用户是否关注，提示用户去关注公众号            
                if(vm.subscribe=='0'){
                    if(off){
                        alert("关注公众号，兑换礼品");
                            window.location.href="http://yunzhujia.qx1688.net/wxoneqrcode/ai/code.html"; 
                    }else{
                        alert("关注公众号，赢取更多好礼");
                        window.location.href="http://yunzhujia.qx1688.net/wxoneqrcode/ai/code.html";
                    }      
                }else{
                    window.location.href="../user/index.html";
                }
        },
        get_prize:function(){//抽奖函数
            axios.get('http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/add.do', {//调用抽奖接口
            params: {
                qrcodeno:qrcodeno,
                province:vm.gps.province,
                city:vm.gps.city,
                district:vm.gps.district,
                lng:vm.gps_code.longitude,
                lat:vm.gps_code.latitude,
                openid:openid,
                activityid:vm.activityid
            }
        }).then(function (response) {
            console.log(response);
            vm.off_all=true;
            if(response.data.code=='200'){//抽奖成功
                if(response.data.msg=='success'){//抽中奖项
                    if(vm.subscribe){
                        axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/sendTempByOpenid.do",{
                            params:{
                                openid:openid
                            }
                        }).then(function(response){
                        })
                    }
                    for(var i=0;i<6;i++){
                        if(response.data.data.prizessetid==vm.pan[i].id){
                            vm.off_all=true;
                            vm.num = 7200-i*60;
                            setTimeout(function(){
                                vm.over_src = "./img/bgy.png";//显示背景
                                vm.prize.name=vm.pan[i].prize.name;//奖品名称
                                vm.prize.photo=vm.pan[i].prize.photo;//奖品图片
                                vm.j_off=true;
                            },3600); 
                            break;
                        }
                    }           
            }else{
                vm.num = 7260;
                setTimeout(function(){
                    vm.over_src ='./img/over.png';//抽中空奖
                   
                },3600); 
            }
            }else{ 
                    alert(response.data.msg);
                    vm.off_all=true;
                    if(response.data.msg=="您今天已经抽过奖了"){
                        window.location.href="../user/index.html";
                    }
            }
        }) .catch(function (error) {
            vm.num = 7260;
            setTimeout(function(){
                vm.over_src ='./img/over.png';//抽中空奖
                vm.off_all=true;
            },3600); 
            });

        }
    },
    created: function () {
        this.height = window.innerHeight + "px";
    },
    beforeCreate: function () {   
        show_loading();     
      var item = {};
      var href = location.href;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/jsapiticketController/getJsapiticket.do",{
            params:{
                url:href
            }
        }).then(function(response){         
            item = response.data.data;
            wx.config({
                debug: false,
                appId: item.appId,
                timestamp: item.timestamp,
                nonceStr: item.nonceStr,
                signature: item.signature,
                jsApiList: [
                  'getLocation',
                  'checkJsApi'
                ]
                });
                wx.ready(function(){
                    wx.getLocation({//获取地理位置
                        success: function (res) {
                          vm.gps_code=res;
                          var code =res.longitude+','+res.latitude;
                          axios.get("http://yunzhujia.qx1688.net/oneqrcode/coordinateController/conversion.do",{
                              params:{
                                coords:code
                              }
                          }).then(function(response){
                                vm.gps=response.data.areas[0];//保存地理位置
                                console.log(vm.gps)
                                hide_loading();
                          }).catch(function(){
                          })
                        },
                        cancel: function (res) {
                          alert('获取失败');
                        }
                      });
                });
               
        }).catch(function (error) {
        });
       
        axios.get('http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/getAllPrizes.do', {
            params: {
                qrcodeno: qrcodeno,
                activityid:activityid 
            }
        }).then(function (response) {
            console.log(response);
            if(response.data.code=="404"){
                alert(response.data.msg);
               window.location.href="../user/index.html";
            }
            vm.activityid=response.data.data[0].activityid;
            for (var i = 0; i < response.data.data.length; i++) {
                vm.pan[i].prize = response.data.data[i].prize;
                vm.pan[i].id=response.data.data[i].id;
                
            }
        })
            .catch(function (error) {
                console.log(error);
            });
          
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/verifyWechatController/getUserInfo.do",{//获取用户信息
            params:{
                openid:openid
            }
        }).then(function(response){
            
                console.log(openid);
                vm.subscribe = response.data.data.map.subscribe;//存储用户信息
 
        }).catch(function(error){
           
        })
    }
})
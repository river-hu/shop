var vm = new Vue({
    el:".container",
    data:{
        user:{},
        core:0,
        loading:false,
        id:0,
        openid:0,
        userid:0
    },
    methods:{
        gotomybuy:function(){
            sessionStorage.userid = this.userid
        }
    },
    created:function(){
        var openid = localStorage.getItem("openid");
        console.log(openid);
        this.openid = openid;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/verifyWechatController/getUserInfo.do",{//获取用户信息
            params:{
                openid:openid
            }
        }).then(function(response){
                console.log(response);
                vm.user = response.data.data.map;//存储用户信息
                if(vm.user.subscribe==0){
                    window.location.href="http://yunzhujia.qx1688.net/wxoneqrcode/ai/code.html";
                }
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do",{//获取用户积分信息
                    params:{
                        openid:openid
                    }
                }).then(function(response){
                    console.log(response);
                    if(response.data.code=='404'){
                    }else{
                        vm.core=response.data.data.integral;
                        vm.id=response.data.data.id;
                        sessionStorage.userid=response.data.data.id;
                        vm.userid = response.data.data.id
                    }         
                    vm.loading=true;      //数据请求完成 
                    
                }).catch(function(error){
                    alert("0网络错误，请刷新重试");
                })
        }).catch(function(error){
            alert("1网络错误，请刷新重试");
        })
    }
})
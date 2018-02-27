var vm = new Vue({
    el: ".content",
    data: {
        phone: '',
        code: '',
        code_off: false,
        code_content: "获取验证码",
        timer: null,
        code_ok:''
    },
    methods: {
        getcode: function () {
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/verificationController/checkPhone.do",{
                params:{
                    phone:vm.phone
                }
            }).then(function(response){
                    console.log(response);
                    if (vm.code_off) {
                        return false;
                    } else if(response.data.code==404){
                        alert(response.data.msg);
                    }else{
                        vm.code_off = true;
                        vm.code_content = "30秒后点击";
                        var num = 30;
                        vm.timer = setInterval(function () {
                            num--;
                            var str = num + "秒后点击";
                            vm.code_content = str;
                            if (num <= 0) {
                                clearInterval(vm.timer);
                                vm.code_content = "获取验证码";
                                vm.code_off = false;
                            }
                        }, 1000);
                    }
            }).catch(function(error){
                    alert("网络错误，请刷新重试");
            })
      
        },
        post:function(){
            if(this.phone==''||this.code==''){
                alert("手机号和验证码不能为空");
            }else if(!(/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(vm.phone))){
                alert("手机号码错误");
            }else if(this.code!=this.code_ok){
                alert("验证码错误");
            }else{
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/bindWeChatPhone.do",{
                    params:{
                        openid:openid,
                        phone:vm.phone
                    }
                }).then(function(response){
                        if(response.data.code==404){
                            alert(response.data.msg)
                        }else{
                            window.location.href="./index.html"
                        }
                }).catch(function(){
                    alert("网络错误，请刷新重试");
                })
              
            }
            
        }
    }
})
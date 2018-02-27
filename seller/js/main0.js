var vm = new Vue({
    el: ".app",
    data: {
        user: {},
        core: 0,
        loading: false
    },
    methods: {
        getuser: function () {//获取核销人员基本信息
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/verifyWechatController/getUserInfo.do", {//获取用户信息
                params: {
                    openid: openid
                }
            }).then(function (response) {
                console.log(response.data.data.map);
                vm.user = response.data.data.map;//存储用户信息
                vm.loading = true;   
            }).catch(function (error) {
                console.log(error);
            })
        }
    },
    filters:{
        phone: function (value) {//手机号隐藏
            if (!value) return '';
            var str=value.substring(0,3)+"*****"+value.substr(8);
            return str;
          },
    },
    created: function () {
        var openid = localStorage.getItem("openid");
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do", {
            params: {
                openid: openid
            }
        }).then(function (response) {
            if (response.data.code == 404) {
                alert(response.data.msg);
                window.location.href = "./login.html"
            }else if(response.data.data.type==0){
                alert("您还不是核销人员，请进行认证");
                window.location.href = "./login.html";
                console.log(response.data);
            }else{
                vm.core=response.data.data.phone;
                vm.getuser();//获取用户基本信息
            }     
        })
    }
})
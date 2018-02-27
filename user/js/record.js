var openid = localStorage.getItem("openid");
var vm = new Vue({
    el:".box",
    data:{
        arr:[]
    },
    created:function(){
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/winningRecord.do",{
            params:{
                openid:openid
            }
        }).then(function(response){
                    vm.arr=response.data.data
        }).catch(function(){
            alert("网络错误，请刷新重试");
        })
    }
})
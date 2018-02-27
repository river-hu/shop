
var vm = new Vue({
    el:'.app',
    data:{
        toggle:200,
        text:'',
        loading:false
    },
    methods:{
    },
    created:function(){
        var lotteryrecordid=one().lotteryrecordid;
      axios.get("http://yunzhujia.qx1688.net/oneqrcode/lotteryrecordController/writeOff.do",{
                    params:{
                        openid:openid,
                        lotteryrecordid:lotteryrecordid
                    }
                }).then(function(response){
                    console.log(response.data);
                    vm.toggle = response.data.code;
                    vm.text = response.data.msg;
                    if(vm.text =="success"){
                        vm.text ="核销成功";
                    }
                 
                    if(vm.text=="您当前还不是核销人员"){
                        setTimeout(function(){
                                window.location.href="../seller/login.html"
                        },500)
                    }
                    vm.loading=true;
                }).catch(function(error){
        
                })
    }
})
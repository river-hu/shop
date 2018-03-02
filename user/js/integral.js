var vm = new Vue({
    el:".container",
    data:{
        arr:[]
    },
    methods:{

    },
    created:function(){
        var openid = localStorage.getItem("openid");
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/scoreRecordController/query.do",{
            params:{
                openid:openid
            }
        }).then(function(response){
            console.log(response.data);
            vm.arr = response.data.data;
        }).catch(function(error){
        })
    }
})
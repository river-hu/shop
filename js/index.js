var vm = new Vue({
    el:".container",
    data:{
        binner:[],
        currentIndex: 0,
        timer: ''
    },
    methods:{
        go:function() {
            this.timer = setInterval(() => {
                this.autoPlay()
            }, 4000)
        },
        stop:function() {
            clearInterval(this.timer)
            this.timer = null
        },
        change:function(index) {
            this.currentIndex = index
        },
        autoPlay:function() {
            this.currentIndex++
            if (this.currentIndex > this.binner.length - 1) {
                this.currentIndex = 0
            }
        }
    },
    created:function(){
        axios.get("http://192.168.1.107:8080/oneqrcode/shopBannerController/query.do").then(function(response){
            console.log(response);
            vm.binner = response.data.data;
            
        })
        this.$nextTick(function(){
            vm.timer = setInterval(function(){
                vm.autoPlay()
            }, 4000)
        })
    }
})

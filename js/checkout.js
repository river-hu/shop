var vm = new Vue({
    el:".container",
    data:{
            off:false
    },
    methods:{
        toggle:function(){
            this.off=!this.off;
        }
    },
    created:function(){

    }
})
var vm = new Vue({
    el:".container",
    data:{
        search:""
    },
    methods:{
        search_shop:function(){
            sessionStorage.search_id=this.search;
            window.location.href="./searchshop.html"
        }
    },
    created:function(){

    }
})
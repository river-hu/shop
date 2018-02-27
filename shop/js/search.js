var vm = new Vue({
    el:".container",
    data:{
        search:""
    },
    methods:{
        search_shop:function(){

        }
    },
    created:function(){
        this.search = sessionStorage.search_id;
    }
})
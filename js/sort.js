var vm = new Vue({
    el:".container",
    data:{
        search:"",
        arr:[],
        sortIndex:0
    },
    methods:{
        search_shop:function(){
            sessionStorage.search_id=this.search;
            window.location.href="./searchshop.html"
        },
        toggle:function(index){
            if(this.sortIndex==index){
                this.sortIndex=-1;
            }else{
                this.sortIndex=index;
            }
            
        }
    },
    created:function(){
        show_loading();
        axios.get("http://192.168.1.107:8080/oneqrcode/firstSortController/query.do").then(function(response){
            console.log(response.data.data);
            vm.arr = response.data.data;
            hide_loading();
        }).catch(function(error){

        })
    }
})
var vm = new Vue({
    el:".container",
    data:{
        search:"",
        arr:[],
        sortIndex:0,
        arrIndex:[]
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
        axios.get("http://192.168.1.107:8080/oneqrcode/firstSortController/query.do").then(function(response){//获取一级分类
            console.log(response.data.data);
            vm.arr = response.data.data;
            axios.get("http://192.168.1.107:8080/oneqrcode/secondSortController/query.do",{//根据一级分类获取二级分类
                params:{
                    firstid:vm.arr[1].id
                }
            }).then(function(response){//根据二级分类获取商品数据
                hide_loading();
                console.log(response.data.data)
                var arr = response.data.data
                for(var i=0;i<)
                vm.arrIndex=response.data.data; 
            })
            
        }).catch(function(error){

        })
    }
})
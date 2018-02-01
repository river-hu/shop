var vm = new Vue({
    el:".container",
    data:{
        arr:[
            {
                name:"胡长江",
                sheng:"河南",
                city:"郑州",
                qu:"金水区",
                jie:"文化路街道",
                dec:"农业路政七街省汇中心B座710室",
                tel:"15039922892",
                off:false
            },
            {
                name:"胡长江",
                sheng:"河南",
                city:"郑州",
                qu:"金水区",
                jie:"文化路街道",
                dec:"农业路政七街省汇中心B座710室",
                tel:"15039922892",
                off:false
            },
            {
                name:"胡长江",
                sheng:"河南",
                city:"郑州",
                qu:"金水区",
                jie:"文化路街道",
                dec:"农业路政七街省汇中心B座710室",
                tel:"15039922892",
                off:false
            },
            {
                name:"胡长江",
                sheng:"河南",
                city:"郑州",
                qu:"金水区",
                jie:"文化路街道",
                dec:"农业路政七街省汇中心B座710室",
                tel:"15039922892",
                off:false
            },
            {
                name:"胡长江",
                sheng:"河南",
                city:"郑州",
                qu:"金水区",
                jie:"文化路街道",
                dec:"农业路政七街省汇中心B座710室",
                tel:"15039922892",
                off:false
            }
        ],
        address:[],
        address_city:[],
        address_area:[],
        sheng:'',
        city:'',
        qu:''
    },
    filters:{
        phone: function (value) {//手机号隐藏
            if (!value) return '';
            var str=value.substring(0,3)+"*****"+value.substr(8);
            return str;
          },
    },
    watch:{
        sheng:function(){          
            for(var i=0;i<35;i++){
                if(this.sheng==this.address[i].name){
                    this.address_city=this.address[i].city;                   
                    this.city=this.address[i].city[0].name;
                    break;
                }
            }
        },
        city:function(){
            for(var i=0;i<this.address_city.length;i++){
                if(this.city==this.address_city[i].name){
                    this.address_area=this.address_city[i].area;  
                    this.qu=this.address_city[i].area[0];                
                    break;
                }
            }
        }
    },
    methods:{
        set:function(index){
          
            console.log(this.sheng);
            if(vm.address.length==0){
              
                axios.get("http://192.168.1.107:8080/oneqrcode/addressJsonController/index.do").then(function(response){
                        vm.address=response.data;
                        vm.sheng=vm.arr[index].sheng;
                        for(var i=0;i<35;i++){
                            if(vm.sheng==vm.address[i].name){
                                vm.address_city=vm.address[i].city;
                               
                                break;
                            }
                        }
                        vm.city=vm.arr[index].city;
                        for(var i=0;i<vm.address_city.length;i++){
                            if(vm.city==vm.address_city[i].name){
                                vm.address_area=vm.address_city[i].area;
                               
                                break;
                            }
                        }
                        vm.qu=vm.arr[index].qu;
                        vm.arr[index].off= true;
                }).catch(function(error){
                        alert("网络错误请刷新重试");
                })
            }else{
                this.sheng=this.arr[index].sheng;
                this.city=this.arr[index].city;
                this.qu=this.arr[index].qu;
                this.arr[index].off= !this.arr[index].off;
            }

        }
    },
    created:function(){

    }
})
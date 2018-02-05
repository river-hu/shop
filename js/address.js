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
            }
        ],
        address:[],
        address_city:[],
        address_area:[],
        sheng:'',
        city:'',
        qu:'',
        arrIndex:-1,
        add_off:false
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
              
                
            }else{
                this.sheng=this.arr[index].province;
                this.city=this.arr[index].city;
                this.qu=this.arr[index].district;
                if(this.arrIndex==index){
                    this.arrIndex=-1
                }else{
                    this.arrIndex= index;
                }
                
            }
        },
        add_toggle:function(){
            this.add_off=!this.add_off;
            this.sheng="北京";
        }
    },
    created:function(){
        var id = sessionStorage.userid;
        axios.get("http://192.168.1.107:8080/oneqrcode/receivingAddressController/query.do",{
            params:{
                "wechat_user_id":id
            }
        }).then(function(response){
            console.log(response.data);
            vm.arr=response.data.data;
        }).catch(function(error){
        })
        axios.get("http://192.168.1.107:8080/oneqrcode/addressJsonController/index.do").then(function(response){
                        vm.address=response.data;
                
                }).catch(function(error){
                        alert("网络错误请刷新重试");
                })
    }
})
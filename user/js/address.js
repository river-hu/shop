var vm = new Vue({
    el:".container",
    data:{
        arr:[
        ],
        address:[],
        address_city:[],
        address_area:[],
        sheng:'',
        city:'',
        qu:'',
        user:'',
        tel:'',
        dec:'',
        arrIndex:-1,
        add_off:false,
        id:0
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
        nonull:function(index){
            if(vm.arr[index].detailAddress==''){
                alert('地址详情为空');
                return false;
            }
            if(vm.arr[index].person==''){
                alert('用户名错误');
                return false;
            }
            if(vm.arr[index].mobile==''){
                alert('电话号码错误');
                return false;
            }
            return true;
        },
        delet:function(index){
            if(confirm("是否删除")){
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/deleteById.do",{
                    params:{
                        id:vm.arr[index].id
                    }
                }).then(function(response){
                    console.log(response.data);
                    var id = sessionStorage.userid;  
                    axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do",{
                        params:{
                            "wechat_user_id":id,
                        }
                    }).then(function(response){
                        console.log(response.data);
                        vm.arr=response.data.data;
                        vm.arrIndex=-1;
                    }).catch(function(error){
                    })
                }).catch(function(error){
                })
            }
        },
        updata:function(index){
            if(!this.nonull(index)){
                return false;
            }
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/update.do",{
                params:{
                    id:vm.arr[index].id,
                    wechatUserId:vm.arr[index].wechatUserId,
                    province:vm.sheng,
                    city:vm.city,
                    district:vm.qu,
                    detailAddress:vm.arr[index].detailAddress,
                    date:vm.arr[index].date,
                    person:vm.arr[index].person,
                    mobile:vm.arr[index].mobile,
                    isdefault:vm.arr[index].isdefault
                }
            }).then(function(response){
                console.log(response.data);
                vm.arrIndex=-1
            }).catch(function(error){
            })
        },
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

        },
        defaul:function(index){
            show_loading();
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/setDefaultById.do",{
                params:{
                    id:vm.arr[index].id
                }
            }).then(function(response){
               
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do",{
                    params:{
                        "wechat_user_id":vm.id,
                    }
                }).then(function(response){
                    console.log(response.data);
                    vm.arr=response.data.data;
                    vm.arrIndex=-1;
                    hide_loading();
                }).catch(function(error){
                })
            })
        },
        cancel:function(){
            this.sheng = '北京',
            this.dec = '',
            this.user = '',
            this.tel = '',
            this.add_off = false;
        },
        add:function(){     
            if(vm.dec==''){
                alert('地址详情为空');
                return false;
            }
            if(vm.user==''){
                alert('用户名错误');
                return false;
            }
            if(vm.tel==''){
                alert('电话号码错误');
                return false;
            }
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/add.do",{
                params:{
                    wechatUserId: vm.id,
                    province:vm.sheng,
                    city:vm.city,
                    district:vm.qu,
                    detailAddress:vm.dec,
                    person:vm.user,
                    mobile:vm.tel
                }
            }).then(function(response){
                console.log(response); 
                vm.sheng = '北京',
                vm.dec = '',
                vm.user = '',
                vm.tel = '',
                vm.add_off = false;
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do",{
                    params:{
                        "wechat_user_id":vm.id,
                    }
                }).then(function(response){
                    console.log(response.data);
                    vm.arr=response.data.data;
                }).catch(function(error){
                })
            }).catch(function(error){

            })
        }
    },
    created:function(){
        this.id = sessionStorage.userid;
        show_loading();
        var vm =this;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do",{
            params:{
                "wechat_user_id":vm.id
            }
        }).then(function(response){
            console.log(response.data);
            vm.arr=response.data.data;
            hide_loading();
        }).catch(function(error){
        })
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/addressJsonController/index.do").then(function(response){
                        vm.address=response.data;
                }).catch(function(error){
                        alert("网络错误请刷新重试");
                })
    }
})
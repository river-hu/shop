var vm = new Vue({
    el: ".app",
    data: {
        arr: [
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: true
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            }
        ],
        all: false,
        marey: 0,
        all_marey: 0,
        loading: false,
        integral:0,
        exchange:0.1
    },
    methods: {
        check: function (index) {
            this.arr[index].off = !this.arr[index].off;
            for (var i in this.arr) {
                this.all = true;
                if (!this.arr[i].off) {
                    this.all = false;
                    break;
                }
            }
            this.addall();
        },
        update:function(index){
            var myDate = new Date();
            var time = myDate.getTime();//获取当前时间的毫秒数

            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopCarController/update.do",{
                params:{
                    id:vm.arr[index].id,
                    goodsId:vm.arr[index].goodsId,
                    count:vm.arr[index].count,
                    date:time,
                    wechatUserId:vm.arr[index].wechatUserId,
                    goodsSortId:vm.arr[index].goodsSortId
                }
            }).then(function(response){
                console.log(response.data);
            }).catch(function(error){
            })
        },
        close: function (index) {//删除购物车单条数据
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopCarController/deleteById.do", {
                params: {
                    id: vm.arr[index].id
                }
            }).then(function (response) {
                console.log(response.data);
                vm.arr.splice(index, 1);
                for (var i in vm.arr) {//重新计算总价钱
                    vm.all = true;
                    if (!vm.arr[i].off) {
                        vm.all = false;
                        break;
                    }
                }
                vm.addall();
            }).catch(function (error) {
            })

        },
        buy: function () {//go to buy goods now
            var jsons = [];
            if(this.all_marey!=0){
                for (var i in this.arr) {
                    if (this.arr[i].off) {
                        this.arr[i].shop_goods_sorts=[];
                        this.arr[i].shop_goods_sorts.push(vm.arr[i].shopGoodsSort);
                        jsons.push({
                            num:vm.arr[i].count,
                            shop:vm.arr[i],
                            select:0
                        })
                    }
                }
                sessionStorage.buyshop='';
                sessionStorage.buyshop = JSON.stringify(jsons);
                window.location.href = "./checkout.html";

            }else{
                showModel({
                    icon:'icon-warning',
                    text:'您没有购买选中商品'
                },1500)
            }

        },
        jian: function (index) {//数量减1
            if (this.arr[index].count != 1) {
                this.arr[index].count--;
                this.update(index);
                this.addall();
            }

        },
        add: function (index) {//数量增加，并选中商品
            this.arr[index].count++;

            this.arr[index].off = false;

            this.check(index);
            console.log(this.arr[index]);
            this.update(index);
            this.addall();

        },
        addall: function () {//计算全部选中商品的价格总和
            var mroe = 0;//折扣后的价钱
            var all = 0;//总的积分
            var omroe = 0;//积分抵扣之前的价钱
            for (var i in this.arr) {
                if (this.arr[i].off) {
                    mroe += this.arr[i].shopGoodsSort.price * this.arr[i].count;
                    all += this.arr[i].shopGoodsSort.integration * this.arr[i].count;
                    omroe += this.arr[i].shopGoodsSort.originalPrice * this.arr[i].count;
                }
            }
            if(this.arr.length>1&&all>this.integral&&this.integral!=0){
                showModel({
                    icon:'icon-warning',
                    text:'积分不足，请分开购买单类商品'
                },1500)
                for (var i in this.arr) {
                    this.arr[i].off = false;
                }
                this.all_marey = 0;
            }
            if(all<this.integral){
                this.all_marey = mroe;
            }
            if(this.integral==0){
                this.all_marey = omroe;
            }
            if(this.arr.length==1&&all>this.integral){
                this.all_marey = omroe - this.exchange*this.integral;
            }

        },
        check_all: function () {//全选功能
            this.all = !this.all;
            for (var i in this.arr) {
                this.arr[i].off = this.all;
            }
            this.addall();
        }
    },
    created: function () {
        show_loading();
        var openid = sessionStorage.openid;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do", {//获取用户积分信息
            params: {
                openid: openid
            }
        }).then(function (response) {
            console.log(response);
            var id = response.data.data.id;

            vm.integral = response.data.data.integral;
            this.exchange = 0.1;//****积分兑换rmb汇率***********测试********************************************* */
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopCarController/query.do", {//请求购物车数据
                params: {
                    "wechat_user_id": id,
                    "page": 1,
                    "count": 100
                }
            }).then(function (response) {
                console.log(response.data);
                if (response.data.data == '') {//请求数据进行非空验证
                    vm.arr = [];
                } else {
                    vm.arr = response.data.data.list;
                }
                vm.loading = true;
                hide_loading();
            }).catch(function (error) {
            })

        }).catch(function (error) {
            alert("网络错误，请刷新重试");
        })


    }
})
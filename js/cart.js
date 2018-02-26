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
        integral:0
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


        },
        jian: function (index) {//数量减1
            if (this.arr[index].count != 1) {
                this.arr[index].count--;

                this.addall();
            }

        },
        add: function (index) {//数量增加，并选中商品
            this.arr[index].count++;
            this.arr[index].off = false;
            this.check(index);
            this.addall();

        },
        addall: function () {//计算全部选中商品的价格总和
            var mroe = 0;
            for (var i in this.arr) {
                if (this.arr[i].off) {
                    mroe += this.arr[i].shopGoodsSort.price * this.arr[i].count;
                }
            }
            this.all_marey = mroe;
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
        var openid = localStorage.getItem("openid");
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do", {//获取用户积分信息
            params: {
                openid: openid
            }
        }).then(function (response) {
            console.log(response);
            var id = response.data.data.id;
            vm.integral = response.data.data.integral;
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
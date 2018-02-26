var vm = new Vue({
    el: '.container',
    data: {
        shop: {},
        currentIndex: 0,//当前显示图片的索引
        timer: '',//轮播图定时器 
        transition: "list",//轮播图切换效果
        sortIndex: 0,
        num: 1,
        ping: [],
        pingOff: true,
        id: 0,
        loading: false,
        toggle: true
    },
    watch: {
        num: function () {
            if (this.num > 200) {
                this.num = 200;
            }
        }
    },
    methods: {
        add_cart: function () {
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopCarController/add.do", {//加入购物车
                params: {
                    goodsId: vm.shop.id,
                    count: vm.num,
                    wechatUserId: vm.id,
                    goodsSortId: vm.shop.shop_goods_sorts[vm.sortIndex].id
                }
            }).then(function (response) {
                showModel({
                    icon: "icon-success",
                    text: "加入购物车成功"
                }, 1500);
            }).catch(function (error) {
                console.log(error);
            })
        },
        go: function () {//定时轮播
            this.timer = setInterval(() => {
                this.autoPlay()
            }, 4000);
        },
        getdec: function () {
            this.toggle = true;
        },
        stop: function () {//暂停播放
            clearInterval(this.timer);
            this.timer = null
        },
        autoPlay: function () {//下一个
            this.transition = "list";
            this.currentIndex++
            if (this.currentIndex > this.shop.images.length - 1) {
                this.currentIndex = 0

            }
        },
        gobuy: function () {
            var jsons = [{
                num: vm.num,
                shop: vm.shop,
                select: vm.sortIndex
            }];
            sessionStorage.buyshop = JSON.stringify(jsons);
            window.location.href = "./checkout.html";
        },
        get_ping: function () {
            if (this.pingOff) {
                axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsEvaluationController/query.do", {
                    params: {
                        goodsId: vm.shop.id,
                        page: 1,
                        count: 10
                    }
                }).then(function (response) {
                    vm.pingOff = false;
                    vm.ping = response.data.data.list;
                    vm.toggle = false;
                    console.log(response.data.data.list);
                }).catch(function (error) {
                })
            } else {
                vm.toggle = false;
            }
        },
        left: function () {//向左滑动
            this.stop();
            this.autoPlay();
            this.go();
        },
        right: function () {//向右滑动
            this.transition = "list2";
            this.stop();
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.shop.images.length - 1
            }
            this.go();

        },
        jian: function () {
            if (this.num > 1) {
                this.num--;
            }
        },
        add: function () {
            this.num++;
        },
        select: function (index) {
            this.sortIndex = index;
        }
    },
    created: function () {
        var url = location.search;
        var id = url.split('?')[1].split('&')[0].split('=')[1];
        var openid = localStorage.getItem("openid");
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do", {//获取用户积分信息
            params: {
                openid: openid
            }
        }).then(function (response) {
            console.log(response);
            var id = response.data.data.id;
            console.log(id);
            vm.id = id;
        }).catch(function (error) {
            alert("网络错误，请刷新重试");
        })

        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsController/queryById.do", {
            params: {
                id: id
            }
        }).then(function (response) {
            console.log(response.data);
            vm.shop = response.data.data;
            vm.shop.images = JSON.parse(vm.shop.images);
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopGoodsSortController/query.do", {
                params: {
                    goodsId: id
                }
            }).then(function (response) {
                console.log(response.data);
                vm.shop.shop_goods_sorts = response.data.data;
                vm.loading = true;
            }).catch(function (error) {
            })
            console.log(vm.shop)

            document.title = vm.shop.name;

        }).catch(function (error) {
        })
    }
})
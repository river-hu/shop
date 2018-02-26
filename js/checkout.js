var vm = new Vue({
    el: ".container",
    data: {
        off: false,
        arr: [
            {
                person: "胡长江",
                province: "河南",
                city: "郑州",
                district: "金水区",
                detailAddress: "农业路政七街省汇中心B座710室",
                mobile: "15039922892",
                isdefault: 1
            },
            {
                person: "胡长江",
                province: "河南",
                city: "郑州",
                district: "金水区",
                detailAddress: "农业路政七街省汇中心B座710室",
                mobile: "15039922892",
                isdefault: false
            },
            {
                person: "胡长江",
                province: "河南",
                city: "郑州",
                district: "金水区",
                detailAddress: "农业路政七街省汇中心B座710室",
                mobile: "15039922892",
                isdefault: false
            }
        ],
        arrIndex: 0,
        shop: {},
        allnum: 0,
        allprice: 0,
        allintegration: 0,
    },
    methods: {
        toggle: function () {
            this.off = !this.off;
        },
        check: function (index) {
            this.off = false;
            this.arrIndex = index;

        },
        addall: function () {
            for (var i in this.shop) {
                this.allnum += this.shop[i].num;
                this.allprice += this.shop[i].shop.shop_goods_sorts[this.shop[i].select].price;
                this.allintegration += this.shop[i].shop.shop_goods_sorts[this.shop[i].select].integration;
            }
        },
        buy: function () {
            var shopjson = [];
            for (var i in this.shop) {
                shopjson.push({
                    "goodsSortId": vm.shop[i].shop.shop_goods_sorts[vm.shop[i].select].id,
                    "count": vm.shop[i].num
                })
            }
            $.ajax({
                url: "http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/addMany.do",
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {
                    "wechatUserId": vm.arr[vm.arrIndex].wechatUserId,    //测试用后期项目需要修改*********************************************
                    "receiving_address_id": vm.arr[vm.arrIndex].id,
                    "orderJson": JSON.stringify(shopjson)
                }
            }).done(function (json) {
                console.log(json);
                var checkarr=[];
                for(var i in json.data){
                    checkarr.push(json.data[i].id);
                }
                $.ajax({
                    url: "http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/submitOrder.do",
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    data: {
                        "wechatUserId": vm.arr[vm.arrIndex].wechatUserId,  
                        "orderIdsJson": JSON.stringify(checkarr)
                    }
                }).done(function (json) {
                    console.log(json);
                }).fail(function () {
                    layer.msg('服务器数据错误', { icon: 2 });
                });
            }).fail(function () {
                layer.msg('服务器数据错误', { icon: 2 });
            });
        }
    },
    created: function () {
        var openid = localStorage.getItem("openid");
        this.shop = JSON.parse(sessionStorage.buyshop);
        this.addall();
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do", {//获取用户积分信息
            params: {
                openid: openid
            }
        }).then(function (response) {
            console.log(response);
            var id = response.data.data.id;
            console.log(id);
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do", {
                params: {
                    "wechat_user_id": id    
                }     
            }).then(function (response) {
                console.log(response.data);
                vm.arr = response.data.data;
                for (var i in vm.arr) {
                    if (vm.arr[i].isdefault == 1) {
                        vm.arrIndex = i;
                        break;
                    }
                }
            }).catch(function (error) {
            })
        }).catch(function (error) {
            alert("网络错误，请刷新重试");
        })

    }
})




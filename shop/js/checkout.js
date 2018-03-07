var vm = new Vue({
    el: ".container",
    data: {
        off: false,
        arr: [
            {
                person: " ",
                province: " ",
                city: " ",
                district: " ",
                detailAddress: " ",
                mobile: " ",
                isdefault: 1
            }
        ],
        arrIndex: 0,
        shop: {},
        allnum: 0,
        allprice: 0,
        allintegration: 0,
        integral: 0,
        exchange:0.1
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
            var mroe = 0;//折扣后的价钱
            var all = 0;//总的积分
            var omroe = 0;//积分抵扣之前的价钱
            for (var i in this.shop) {
                this.allnum += this.shop[i].num;
                mroe += this.shop[i].shop.shop_goods_sorts[this.shop[i].select].price * this.shop[i].num;
                all += this.shop[i].shop.shop_goods_sorts[this.shop[i].select].integration * this.shop[i].num;
                omroe += this.shop[i].shop.shop_goods_sorts[this.shop[i].select].originalPrice * this.shop[i].num;
            }
            
            if (all < this.integral) {
                console.log(omroe,all,mroe,0);
                this.allprice = mroe;
                this.allintegration = all;
            }
            if (this.integral == 0) {
                console.log(omroe,all,mroe,1);
                this.allprice = omroe;
                this.allintegration = 0;
            }
            if (this.arr.length == 1 && all > this.integral) {
                console.log(omroe,all,mroe,2);
                this.allprice = omroe - this.exchange * this.integral;
                this.allintegration = this.integral;
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
                    "wechatUserId": vm.arr[vm.arrIndex].wechatUserId,   
                    "receiving_address_id": vm.arr[vm.arrIndex].id,
                    "orderJson": JSON.stringify(shopjson)
                }
            }).done(function (json) {
                console.log(json);
                var checkarr = [];
                for (var i in json.data) {
                    checkarr.push(json.data[i].id);
                }
                $.ajax({
                    url: "http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/submitOrder.do",
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    data: {
                        "wechat_user_id": vm.arr[vm.arrIndex].wechatUserId,
                        "orderIdsJson": JSON.stringify(checkarr)
                    }
                }).done(function (json) {
                    console.log(json);
                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                        "appId": "wx339d7ece7aee4a80",     //公众号名称，由商户传入

                        "timeStamp": json.data.timestamp,         //时间戳，自1970年以来的秒数

                        "nonceStr": json.data.nonceStr, //随机串

                        "package": "prepay_id=" + json.data.prepay_id,

                        "signType": "MD5",         //微信签名方式：

                        "paySign": json.data.paySign //微信签名
                    }, function (res) {
                        if (res.err_msg === 'get_brand_wcpay_request:ok') {
                            alert('支付成功，返回订单列表！');
                        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                            alert('取消支付！');
                        }
                    });

                }).fail(function () {
                    layer.msg('服务器数据错误', { icon: 2 });
                });
            }).fail(function () {
                layer.msg('服务器数据错误', { icon: 2 });
            });
        }
    },
    created: function () {
        var openid = sessionStorage.openid;
        var buyshop = sessionStorage.buyshop;
        if(buyshop==''||buyshop==undefined||buyshop=='undefined'){
            alert("数据为空！");
            window.location.href = "./index.html";
        }
        this.shop = JSON.parse(buyshop);
        
        this.addall();
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/wechatuserController/getOneById.do", {//获取用户积分信息
            params: {
                openid: openid
            }
        }).then(function (response) {
            console.log(response);
            var id = response.data.data.id;
            vm.integral = response.data.data.integral;
            console.log(id);
            axios.get("http://yunzhujia.qx1688.net/oneqrcode/receivingAddressController/query.do", {
                params: {
                    "wechat_user_id": id
                }
            }).then(function (response) {
                console.log(response.data);
                vm.arr = response.data.data;
                if(response.data.data==''){
                    alert("收货地址为空，去添加收货地址");
                    window.location.href = "./address.html";
                }
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




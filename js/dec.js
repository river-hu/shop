var vm = new Vue({
    el:'.container',
    data:{
        shop:{},
        currentIndex: 0,//当前显示图片的索引
        timer: '',//轮播图定时器 
        transition:"list",//轮播图切换效果
        sortIndex:0,
        num:1
    },
    watch:{
        num:function(){
            if(this.num>200){
                this.num=200;
            }
        }
    },
    methods:{
        go:function() {//定时轮播
            this.timer = setInterval(() => {
                this.autoPlay()
            }, 4000);
        },
        stop:function() {//暂停播放
            clearInterval(this.timer);
            this.timer = null
        },
        autoPlay:function() {//下一个
            this.transition="list";
            this.currentIndex++
            if (this.currentIndex > this.shop.images.length - 1) {
                this.currentIndex = 0

            }
        },
        left:function(){//向左滑动
            this.stop();
            this.autoPlay();
            this.go();
        },
        right:function(){//向右滑动
            this.transition="list2";
            this.stop();
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.shop.images.length - 1
            }
            this.go();  

        },
        jian:function(){
            if(this.num>1){
                this.num--;
            }
        },
        add:function(){
            this.num++;
        },
        select:function(index){
            this.sortIndex=index;
        }
    },
    created:function(){
        var shop=localStorage.getItem("shop");
        this.shop = JSON.parse(shop);
        this.shop.images = JSON.parse(this.shop.images);
        document.title = this.shop.name;
    }
})
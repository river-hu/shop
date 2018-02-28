var vm=new Vue({
    el:".container",
    data:{
        off:false,
        off_text:"点击查看物流信息",
        nin:5,
        num:'',
        num_off:false,
        arrindex:0,
        userid:0,
        items:[],
        arrnav:[
            {
                name:'全部订单',
                url:'#tab1'
            },
            {
                name: '待发货',
                url:'#tab2'
            },
            {
                name: '待评价',
                url:'#tab3'
            },
            {
                name:'已评价',
                url:'#tab4'
            }
        ],
        state:[
            '未完成支付',
            '未发货',
            '待评价',
            '已评价'
        ]
    },
    watch:{
        num:function(){
            if(this.num.length>=150){
                this.num=this.num.substring(0,150);
                this.num_off=true;
            }else{
                this.num_off=false;
            }
            
        }
    },
    methods:{
        wuliu:function(){
            this.off=!this.off;
            this.off_text=this.off?"点击收起":"点击查看物流信息";
        },
        confirm:function(){
            if(confirm("是否确认收货")){

            }
        },
        evaluate:function(index){
           
            if(typeof index =='number'){
                
           this.nin=index;
            }
        },
        toggle:function(index){
            this.arrindex = index;
        }
    },
    created:function(){
        // this.userid = sessionStorage.userid;
        // if(this.userid==''||this.userid==undefined||this.userid=='undefined'){
        //     window.location.href="../user/index.html";
        // }
        // var userid = this.userid;
        this.userid = 33;
        var userid = this.userid;
        axios.get("http://yunzhujia.qx1688.net/oneqrcode/shopOrderController/query.do",{
            params:{
                'wechat_user_id':userid,
                'page':1,
                'count':10
            }
        }).then(function(response){
            console.log(response.data);
            vm.items = response.data.data.list;
        }).catch(function(error){
        })
    }
})
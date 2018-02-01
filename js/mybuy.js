var vm=new Vue({
    el:".container",
    data:{
        off:false,
        off_text:"点击查看物流信息",
        nin:5,
        num:'',
        num_off:false
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
        }
    },
    created:function(){

    }
})
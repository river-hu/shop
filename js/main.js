/**
 * Created by admin on 2017/12/20.
 */
function one() { //获取参数
    var url =  location.search
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var openid = ''
var access_token =''
if(one().code){ //是否关注
    
    // jinzhi()
   
    if(openid=="undefined"||openid==undefined||openid==''){
        
        $.ajax({
            url:'http://yunzhujia.qx1688.net/oneqrcode/verifyWechatController/getOpenId.do?code='+one().code,
            type:'get',
            datatype:'json',
            async:false,
            success:function (res) {           
                openid = res.openid
                console.log(res);
                access_token = res.access_token
                localStorage.setItem("openid", openid);
            }
        })     
       
    }else{
        openid=localStorage.getItem("openid");
        
    }
   
}else{
    localStorage.setItem('item', location.href)
    console.log(window.location.href)
    window.location.href='http://yunzhujia.qx1688.net/oneqrcode/verifyWechatController/verifyLogin.do?url='+window.location.href;
}
var w = 0;

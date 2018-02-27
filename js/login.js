var login=localStorage.getItem("login");
if(login){

}else{
    axios.get("http://192.168.1.110/oneqrcode/wechatuserController/getOneById.do",{
        params:{
            openid:"kajsdfhtuyahgasdiui"
        }
    }).then(function(response){
            console.log(response.data)
    }).catch(function(error){
            
    })
}
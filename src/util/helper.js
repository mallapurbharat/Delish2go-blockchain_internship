const getCookie = (request, key)=>{
    if(request.headers.cookie == null)
        return null;
        
    let cookies = request.headers.cookie.split(";");
    return cookies.map((cookie)=>{
        cookie = cookie.split("=");
        if(cookie[0]==key)
            return cookie[1];
    }).toString();
};



module.exports = {
    getCookie: getCookie
}
$(document).ready(_=>{

    $('.login-btn').click(_=>{
        D2G.init(_=>{
            let url = window.location.href.split('=')[1];
            window.location.href = url
            // alert(url)
        })
    })
})
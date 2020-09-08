$(document).ready(_=>{
    D2G.init()

    $('.accept-btn').click(function(){
        console.log($(this).parent().children('h2').attr('orderId'))
        D2G.acceptOrder($(this).parent().children('h2').attr('orderId'))
    })

    $('#outForDelivery-btn').click(function(){
        console.log($(this).parent().children('h2').attr('orderId'))
        D2G.outForDelivery($(this).parent().children('h2').attr('orderId'))
    })
})
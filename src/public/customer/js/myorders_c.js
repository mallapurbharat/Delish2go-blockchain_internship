$(document).ready(_=>{
    $('.received-btn').click( async function(){
        await D2G.init();
        console.log($(this).parent().children('h2').attr('orderId'))
        await D2G.orderReceived($(this).parent().children('h2').attr('orderId'))

    })
})
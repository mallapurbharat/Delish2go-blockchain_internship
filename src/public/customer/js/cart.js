// const { delete } = require("../../../routes/routes_r");

let billAmount=20;
let dishDetails='';
let dishes=null;

$(document).ready(_=> {
    dishes = JSON.parse(sessionStorage.getItem('dishes'));
    console.log(dishes);

    const dishesContainer = $('.dishes-selected');
    dishes.forEach(dish=>{
        dishesContainer.append(`<li><span class="dish-name">${ dish.name }</span> - &#8377<span class="dish-price">${ dish.price }</span> x <span class="dish-quantity">${ dish.qunt }</span> = &#8377<span class="dish-totprice">${ dish.totPrice }</span></li>`);
        billAmount+=parseInt(dish.totPrice);
        dishDetails += `${dish.Id}@${dish.qunt}@${dish.price};`
        delete dish.img;
        // dishList.push(dish)
    })
    dishesContainer.append(`<li>Delivery charges = &#8377 20</li>`)
    
    
    $('.bill-amount').html(billAmount);

    $('.place-order-btn').click( async event=>{
        event.preventDefault();
    
        let res_acc_add = sessionStorage.getItem('res_acc_add');
        // const dishes = JSON.parse(sessionStorage.getItem('dishes'));

        if(res_acc_add && dishes){
            await D2G.init();
            // console.log(D2G.contracts.DlishBlockchain.address)
            
            let res = await D2G.placeOrder(res_acc_add, billAmount, dishDetails, dishes).then((res)=>console.log(res)).catch(err=>console.log(err));

            console.log(res)

            
        }
        else{
            window.location.href = '/';
        }
        
    })
})
$(document).ready(_ => {
    const dishes = JSON.parse(sessionStorage.getItem('dishes'));
    console.log(dishes);

    const dishesContainer = $('.dishes-selected');
    let billAmount=0;
    dishes.forEach(dish=>{
        dishesContainer.append(`<li><span class="dish-name">${ dish.name }</span> - &#8377<span class="dish-price">${ dish.price }</span> x <span class="dish-quantity">${ dish.qunt }</span> = &#8377<span class="dish-totprice">${ dish.totPrice }</span></li>`);
        billAmount+=parseInt(dish.totPrice);
    })
    
    $('.bill-amount').html(billAmount);
})
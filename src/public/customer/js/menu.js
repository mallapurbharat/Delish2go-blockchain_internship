let dishesSelected = {
  dishes:[]
};


$(".cart-btn").hide();

// function to update the list of selected dishes
// each time the user increments or decrements quantity
let updateDishList = (selectedCard)=>{

  dishesSelected.dishes.forEach((dish, i) => {
    if(dish.Id == `${selectedCard.find(".dish-title").attr("dish-id")}`)
      dishesSelected.dishes.splice(i,1);
  });


  if(selectedCard.find(".qunt").html()!="0")
    dishesSelected.dishes.push({
      Id: `${selectedCard.find(".dish-title").attr("dish-id")}`,
      name: `${selectedCard.find(".dish-title").html()}`,
      price: `${selectedCard.find(".dish-price").html()}`,
      totPrice: `${parseInt(selectedCard.find(".dish-price").html())*parseInt(selectedCard.find(".qunt").html())}`,
      qunt: `${selectedCard.find(".qunt").html()}`,
      img: `${selectedCard.find(".dish-img").attr("src")}`
    });

  if(dishesSelected.dishes.length ==0)
    $(".cart-btn").fadeOut();
  else
    $(".cart-btn").fadeIn();

  if(Storage){
    sessionStorage.setItem('dishes', JSON.stringify(dishesSelected.dishes));

    let url = window.location.href.split('/');
    sessionStorage.setItem('res_acc_add', url[url.length-1])
  }
  else
    alert("Sry your browser does not support storage");
  console.log(dishesSelected);
  };


// All the callback function that has to be initialised
// after the DOM is fully loaded is placed inside this
// function
$(document).ready(function(){

  // Callback for increment
  $(".inc").click(function(){
    $(this).parent().children(".qunt").html(parseInt($(this).parent().children(".qunt").html())+1);

    let selectedCard = $(this).parents(".dish-card");
    updateDishList(selectedCard);
  });


  // Callback for decrement
  $(".dec").click(function(){
    let qunt = parseInt($(this).parent().children(".qunt").html());
    if(qunt>0)
      $(this).parent().children(".qunt").html(qunt-1);

    let selectedCard = $(this).parents(".dish-card");
    updateDishList(selectedCard);
  });

  //redirect user to cart
  $(".cart-btn").click((e)=>{
    window.location.href = "/cart"
  });

});



// alert("hi");

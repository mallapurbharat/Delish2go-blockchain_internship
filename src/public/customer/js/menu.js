let dishesSelected = {
  dishes:[]
};

let dishes = [
  {
    Id:"101",
    name:"Paneer Butter Masala",
    price:"190",
    img:"/customer/img/menu/01.jpg"
  },
  {
    Id:"102",
    name:"Biryani",
    price:"190",
    img:"/customer/img/menu/02.jpeg"
  },
  {
    Id:"103",
    name:"Chicken tikka masala",
    price:"190",
    img:"/customer/img/menu/03.jpeg"
  },
  {
    Id:"104",
    name:"Butter chicken",
    price:"190",
    img:"/customer/img/menu/04.jpg"
  },
  {
    Id:"105",
    name:"Alu Gobi",
    price:"190",
    img:"/customer/img/menu/05.jpg"
  },
  {
    Id:"106",
    name:"Carrot Halwa",
    price:"190",
    img:"/customer/img/menu/06.jpg"
  },
  {
    Id:"107",
    name:"Gulab Jamun",
    price:"190",
    img:"/customer/img/menu/07.jpg"
  },
  {
    Id:"108",
    name:"Chicken 65",
    price:"190",
    img:"/customer/img/menu/08.jpg"
  }
]

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

  console.log(dishesSelected);
  };


// All the callback function that has to be initialised
// after the DOM is fully loaded is placed inside this
// function
$(document).ready(function(){

  // Populates all the cards based on the given JSON
  dishes.forEach((dish, i) => {
    $(".dish-container").append(`
      <div class="uk-animation-slide-right-medium dish-card">
        <div class="uk-card uk-card-default uk-child-width-1-2@s " uk-grid>
            <div class="uk-card-media-left uk-cover-container">
                <img class="dish-img" src="${dish.img}" alt="" uk-cover>
                <canvas width="50" height="150"></canvas>
            </div>
            <div>
                <div class="uk-card-body uk-grid-small uk-margin-small-right uk-child-width-1-1@s dish-body" uk-grid>
                  <h3 class="uk-card-title uk-text-left dish-title" dish-id="${dish.Id}">${dish.name}</h3>
                  <p class="uk-text-meta uk-text-left dish-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                  <div class="uk-grid-small uk-child-width-expand@s" uk-grid>
                    <div class="uk-flex">
                      &#8377 <span class="dish-price">${dish.price}</span>
                    </div>

                    <div class="uk-grid-small uk-margin-small-right counter uk-flex-right unselectable" uk-grid>
                      <div class="dec">-</div>
                      <div class="qunt">0</div>
                      <div class="inc">+</div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
      `);
  });



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
    window.location.replace("http://localhost:3000/cart");
  });

});



// alert("hi");

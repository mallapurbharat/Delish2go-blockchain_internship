  $(document).ready(function(){
    
    $.getJSON('/restaurant/json/holiday.json', (data)=>{
      data.forEach(day => {
        $("#res-holiday").append(`<option value="${day.day}">${day.day}</option>`);
        console.log("restarurant in");
      });
      $('#res-holiday').formSelect();
    });

    $('.timepicker').timepicker();
    $('select').formSelect();

    D2G.init()
    // portis.showPortis(); 
    $('.register-btn').click( async _=>{
      
      await D2G.registerRestaurant()
    })
  });

  

  $(document).ready(function(){
    $('select').formSelect();

    $('.register-btn').click(async _=>{
        await D2G.init()
        await D2G.registerDeliveryPersonnel()
      })
  });

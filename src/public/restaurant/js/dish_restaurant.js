let selectedDishId = null;

const UCDish = event=>{
    
    let formData = new FormData();
    formData.append('dish_id',selectedDishId);
    formData.append('dish_name', $("#dish_name").val());
    formData.append('img', $("#dish-img")[0].files[0], $("#dish-img").prop('files')[0].name);
    formData.append('description', $("#dish-des").val());          
    formData.append('type', $("#dish-type").val());          
    formData.append('price', $("#dish-price").val()); 
    
    $.ajax({
    url:`${HOST}restaurant/UCDish`,
    method: 'POST',
    data:formData,
    processData: false,
    contentType: false,
    success:()=>console.log("data sent")
    });
  };

$(document).ready(()=>{
    $('select').formSelect();

    $('#dish-add-btn').click(UCDish);
});

const HOST = `https://delish2go.herokuapp.com/`;//"http://localhost:3000/";
let selectedDishId = null;

const UCDish = event=>{
    
    let formData = new FormData();
    formData.append('dish_id',selectedDishId);
    formData.append('dish_name', $("#dish-name").val());
    formData.append('img', $("#dish-img")[0].files[0]);
    formData.append('description', $("#dish-des").val());          
    formData.append('type', $("#dish-type").val());          
    formData.append('price', $("#dish-price").val()); 
    
    $.ajax({
    url:`${HOST}restaurant/UCDish`,
    method: 'POST',
    data:formData,
    processData: false,
    contentType: false,
    success:()=>{
        console.log("data sent")
        alert("Dish was processed successfully")
        window.location.reload()
    }
    });

    selectedDishId=null;
  };



const autoFillForm = event=>{

    console.log($(event.target).parent().children('h2').html())
    $("#dish-name").val($(event.target).parent().children('h2').html())
    // $("#dish-img").prop('files')[0]
    $("#dish-des").val($(event.target).parent().children('p').html())         
    // $("#dish-type").val()          
    $("#dish-price").val($(event.target).parent().children('span').html().split(" ")[1]) 
    M.updateTextFields()
    selectedDishId=$(event.target).parent().children('h2').attr('dishId')

    $('#dish-add-btn').html('Update Dish');
    $('#dish-form-card').show()
    $('.add-btn').hide()
}


$(document).ready(_=>{
    $('select').formSelect();

    // $('#dish-form-card').show()
    $('.add-btn').click(_=>{
        $('#dish-form-card').show()
        $('.add-btn').hide()
    })

    $('.close-btn').click(_=>{
        $('#dish-form-card').hide()
        $('.add-btn').show()

        $("#dish-name").val('')
        $("#dish-img").val('')
        $("#dish-des").val('')    
        $("#dish-type").val('Choose Type')  
        $("#dish-price").val('') 
        M.updateTextFields();
        $('#dish-add-btn').html('Add Dish');
    })

    $('#dish-add-btn').click(UCDish);

    $('.btnedit').click(autoFillForm)

    $('.btndelete').click(function(){
        console.log($(this).parent().children('h2').attr('dishId'))

        $.ajax({
            url:`${HOST}restaurant/deleteDish`,
            method: 'POST',
            data:JSON.stringify({
                dishId: $(this).parent().children('h2').attr('dishId')
            }),
            contentType: 'application/json',
            success:(result)=>{
                console.log("data sent", result)
                alert(result)
                window.location.reload()
            }
        });
    })
})
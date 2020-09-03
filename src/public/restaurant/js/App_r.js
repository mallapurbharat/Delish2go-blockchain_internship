const HOST = "http://localhost:3000/";
App = {
    web3Provider: null,
    contracts: {},
  
    init: async function() {
      // Load pets.
    //   $.getJSON('../pets.json', function(data) {
    //     var petsRow = $('#petsRow');
    //     var petTemplate = $('#petTemplate');
  
    //     for (i = 0; i < data.length; i ++) {
    //       petTemplate.find('.panel-title').text(data[i].name);
    //       petTemplate.find('img').attr('src', data[i].picture);
    //       petTemplate.find('.pet-breed').text(data[i].breed);
    //       petTemplate.find('.pet-age').text(data[i].age);
    //       petTemplate.find('.pet-location').text(data[i].location);
    //       petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
  
    //       petsRow.append(petTemplate.html());
    //     }
    //   });

    $.getJSON('/restaurant/json/holiday.json', (data)=>{
      data.forEach(day => {
        $("#res-holiday").append(`<option value="${day.day}">${day.day}</option>`);
        console.log("restarurant in");
      });
      $('#res-holiday').formSelect();
    });
  
      return await App.initWeb3();
    },
  
    initWeb3: async function() {
      // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
          return App.initContract();
    },
  
    initContract: function() {
      $.getJSON('/contracts/Restaurant.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var RestaurantArtifact = data;
        App.contracts.Restaurant = TruffleContract(RestaurantArtifact);
      
        // Set the provider for our contract
        App.contracts.Restaurant.setProvider(App.web3Provider);
      
        // Use our contract to retrieve and mark the adopted pets
        return App.Restaurants();
      });


      $.getJSON('/contracts/DlishBlockchain.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var DlishBlockchainArtifact = data;
        App.contracts.DlishBlockchain = TruffleContract(DlishBlockchainArtifact);
      
        // Set the provider for our contract
        App.contracts.DlishBlockchain.setProvider(App.web3Provider);
      
        // Use our contract to retrieve and mark the adopted pets
        // return App.Restaurants();
      });
  
      return App.bindEvents();
    },
  
    bindEvents: function() {
      // $(document).on('click', '.submit', App.handleRegister);
      $(".register-btn").click(App.handleRegister);
    },
  
    Restaurants: function() {
      var RestaurantInstance;
  
      App.contracts.Restaurant.deployed().then(function(instance) {
        RestaurantInstance = instance;
  
        return RestaurantInstance.getRestaurants();//.call();
      }).then(function(restaurants) {
        var list;
        $(".list").html("");
        for (i = 0; i < restaurants.length; i++) {
          
            $(".list").append(`<li class="l-element">${restaurants[i]}</li>`);
   
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },
  
    handleRegister: function(event) {
      event.preventDefault();

  
      let DlishBlockchainInstance;
  
      web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      let account = accounts[0];
    
      App.contracts.DlishBlockchain.deployed().then(function(instance) {
        DlishBlockchainInstance = instance;
    
        
        return DlishBlockchainInstance.restaurant(account);
      }).then(function(result) {
        console.log(`The account ${account} is : ${result}`);

        if(!result)
          return DlishBlockchainInstance.RegisterRestaurant({from: account, gas:1000000}).then((res)=>{
          // let account = '0x616f0E1743174CCC777c08286724c67aED3907aA';
            let formData = new FormData();
            formData.append('res_acc_address',account);
            formData.append('restaurant_name', $("#res-name").val());
            formData.append('img', $("#res-img")[0].files[0], $("#res-img").prop('files')[0].name);
            formData.append('phone', $("#res-phone").val());
            formData.append('city', $("#res-city").val());
            formData.append('address', $("#res-address").val());
            formData.append('type', $("#res-type").val());
            formData.append('start_time', $("#start-time").val());
            formData.append('close_time', $("#close-time").val());
            formData.append('holiday', $("#res-holiday").val());
            
            
            $.ajax({
              url:`${HOST}restaurant/register`,
              method: 'POST',
              data:formData,
              processData: false,
              contentType: false,
              success:()=>console.log("data sent")
            });
          })
        return App.Restaurants();
      }).catch(function(err) {
        console.log(err.message);
      });
  });
    },

    handleRegisters: function(event){
      event.preventDefault();
      let formData = new FormData();//$("#res-register-form")[0]);
            formData.append('res_acc_address','account');
            formData.append('restaurant_name', $("#res-name").val());
            formData.append('img', $("#res-img")[0].files[0]);
            formData.append('phone', $("#res-phone").val());
            formData.append('city', $("#res-city").val());
            formData.append('address', $("#res-address").val());
            formData.append('type', $("#res-type").val());
            formData.append('start_time', $("#start-time").val());
            formData.append('close_time', $("#close-time").val());
            formData.append('holiday', $("#res-holiday").val());
            
            // console.log(formData.get('img'));
            // console.log($("#res-img").prop('files')[0].name);
            // console.log($("#res-img")[0].files[0]);
            // , $("#res-img").prop('files')[0].name
            // console.log($("#res-img").prop('files'));
            $.ajax({
              url:`${HOST}restaurant/register`,
              method: 'POST',
              data:formData,
              processData: false,
              contentType: false,
              success:()=>console.log("data sent")
            });
    }
  
  };
  

  $(document).ready(function(){
    $('.timepicker').timepicker();
    $('select').formSelect();

    App.init();
  });
  // $(function() {
  //   $(window).load(function() {
  //     App.init();
  //   });
  // });
  
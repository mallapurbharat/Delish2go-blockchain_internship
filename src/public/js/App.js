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
  
      return App.bindEvents();
    },
  
    bindEvents: function() {
      $(document).on('click', '.submit', App.handleRegister);
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
  
      // var petId = parseInt($(event.target).data('id'));
  
      var RestaurantInstance;
  
  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }
  
    var account = accounts[0];
  
    App.contracts.Restaurant.deployed().then(function(instance) {
      RestaurantInstance = instance;
  
      // Execute adopt as a transaction by sending account
      return RestaurantInstance.addRestaurant($(".name").val(), {from: account, gas:1000000});
    }).then(function(result) {
      return App.Restaurants();
    }).catch(function(err) {
      console.log(err.message);
    });
  });
    }
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  
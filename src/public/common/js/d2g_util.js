const HOST = "http://localhost:3000/";
D2G = {
  web3Provider: null,
  contracts: {},
  callback: null,

  init: async function(callback) {
    D2G.callback = callback ? callback : _=>console.log("web3 initialized");

    // Modern dapp browsers...
    if (window.ethereum) {
      D2G.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();

        web3.eth.getAccounts((err, accounts)=>{
          let date = new Date();
          date.setTime(date.getTime() + (2*60*60 * 1000));
          $.cookie('res_acc_add', accounts[0], { expires: date })
        });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      D2G.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      D2G.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(D2G.web3Provider);

    return D2G.initContract();
  },

  initContract: async function() {
    await $.getJSON('/contracts/DlishToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var DlishTokenArtifact = data;
      D2G.contracts.DlishToken = TruffleContract(DlishTokenArtifact);
    
      // Set the provider for our contract
      return D2G.contracts.DlishToken.setProvider(D2G.web3Provider);      
    });


    await $.getJSON('/contracts/DlishBlockchain.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var DlishBlockchainArtifact = data;
      D2G.contracts.DlishBlockchain = TruffleContract(DlishBlockchainArtifact);
    
      // Set the provider for our contract
      return D2G.contracts.DlishBlockchain.setProvider(D2G.web3Provider);
    });

    return D2G.callback();
  },
  
  placeOrder: async (res_acc_add, amount, dishDetails, dishes)=>{

    let d2gTokenInstance;
    let DlishBlockchainInstance;
    // return Promise.resolve();

    web3.eth.getAccounts(async (err, accounts)=>{
      err ? console.log(err) : null;

      let account = accounts[0];
      d2gTokenInstance = await D2G.contracts.DlishToken.deployed();
      DlishBlockchainInstance = await D2G.contracts.DlishBlockchain.deployed();

      let res = await d2gTokenInstance.approve(DlishBlockchainInstance.address, amount).catch(err=>console.log(err))
      
      if(!res)
        return false
      // return Promise.reject(new Error('Failed to approve transaction'))

      console.log("Approved", res_acc_add, amount, account) 

      
      // res = await DlishBlockchainInstance.PlaceOrder(res_acc_add, amount, {from: account, gas:4712388}).catch(err=>console.log(err))
      // console.log("Paid", res) 
      if(!res)
        return false
        // return Promise.reject('Invalid amount or wallet not unlocked')//new Error('Invalid amount or wallet not unlocked'))

      console.log("Paid", res) 

      let totQunt = 0
      dishes.forEach(dish=>totQunt+=parseInt(dish.qunt))

      $.ajax({
        url:`${HOST}placeorder`,
        method: 'POST',
        data:JSON.stringify({            
          customer_add: account,
          restaurant_add: res_acc_add,
          deliveryPersonal_add: null,
          billAmount: amount,
          address: $('#cus-address').val(),
          phone: $('#cus-phone').val(),
          customer_name: $('#cus-name').val(),
          dishes: dishes                ,
          totQunt: totQunt
      }),
        contentType: 'application/json',
        success:(result)=>{
          console.log("data sent")
          alert(result)
          window.location.href='/'
        }
        });

      return true
      // return Promise.resolve('Order placed successfully in blockchan')
     
    })
  }
};
    

// $(document).ready(function(){

//   D2G.init(_=>console.log("completed"));
// });

  
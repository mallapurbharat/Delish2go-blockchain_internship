const HOST = `https://delish2go.herokuapp.com/`;//"http://localhost:3000/";
let portis;
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
        //delete cookies if exists
        D2G.setCookies()

        // Request account access
        await window.ethereum.enable();

        
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

    web3.eth.getAccounts(async (err, accounts)=>{
      // alert(web3.toChecksumAddress(accounts[0]), accounts[0])
      D2G.setCookies(web3.toChecksumAddress(accounts[0]))
    });

    return D2G.initContract();
  },

  initi: async function(callback) {
    D2G.callback = callback ? callback : _=>console.log("web3 initialized");

  
      
      
        //delete cookies if exists
        D2G.setCookies()

        // Request account access
        const myLocalPOANode = {
          nodeUrl: 'http://localhost:7545',
          chainId: 5777,
        };
         portis = new Portis('11c0bbc2-4860-428b-bf14-b30f8faf32fd', myLocalPOANode);
        D2G.web3Provider = portis.provider;
        portis.showPortis();      
        
      
    web3 = new Web3(D2G.web3Provider);

    web3.eth.getAccounts(async (err, accounts)=>{
      // alert(web3.toChecksumAddress(accounts[0]), accounts[0])
      D2G.setCookies(web3.toChecksumAddress(accounts[0]))
    });

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

    web3.eth.getAccounts((err, accounts)=>{
      if(accounts.length!=0)
      return D2G.callback();
    })
      
  },

  setCookies: account=>{
    console.log(account)
    if(account){
      let date = new Date();
      date.setTime(date.getTime() + (2*60*60 * 1000)); // expires in 2 hrs
      // alert(accounts[0])
      $.cookie('res_acc_add', account, { expires: date , path: '/'})
      $.cookie('del_acc_add', account, { expires: date , path: '/'})
      $.cookie('cus_acc_add', account, { expires: date , path: '/'})
    }
    else{
      $.removeCookie('res_acc_add', { path: '/'})
      $.removeCookie('del_acc_add', { path: '/'})
      $.removeCookie('cus_acc_add', { path: '/'})
    }
    
  },
  
  placeOrder: async (res_acc_add, amount, dishDetails, dishes)=>{

    let d2gTokenInstance;
    let DlishBlockchainInstance;
    // return Promise.resolve();

    web3.eth.getAccounts(async (err, accounts)=>{
      err ? console.log(err) : null;

      let account = web3.toChecksumAddress(accounts[0]);
      D2G.setCookies(account)

      d2gTokenInstance = await D2G.contracts.DlishToken.deployed();
      DlishBlockchainInstance = await D2G.contracts.DlishBlockchain.deployed();

      let res = await d2gTokenInstance.approve(DlishBlockchainInstance.address, amount).catch(err=>console.log(err))
      
      if(!res)
        return false
      // return Promise.reject(new Error('Failed to approve transaction'))

      console.log("Approved", res_acc_add, amount, account, dishDetails) 

      
      res = await DlishBlockchainInstance.PlaceOrder(res_acc_add, amount, dishDetails, {from: account, gas:4712388}).catch(err=>console.log(err))
      console.log("Paid", res) 
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
          deliveryPersonnel_add: null,
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
  },


  registerRestaurant: ()=>{
    let DlishBlockchainInstance;
  
      web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
       let account = web3.toChecksumAddress(accounts[0]);
      D2G.setCookies(account)
    
      D2G.contracts.DlishBlockchain.deployed().then(function(instance) {
        DlishBlockchainInstance = instance;
    
        // alert(account)
        return DlishBlockchainInstance.restaurant(account);
      }).then(async function(result) {
        console.log(`The account ${account} is : ${result}`);

        let delivery = await DlishBlockchainInstance.deliveryperson(account).catch(err=>console.log(err))

        if(result || delivery)
          alert(`This (${account}) account is already registered`)

        else
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
              success:(result)=>{
                console.log("data sent")
                alert(result)
                window.location.href='/restaurant/'
              }
            });
          })
        return D2G.Restaurants();
      }).catch(function(err) {
        console.log(err.message);
      });
  });
  },


  registerDeliveryPersonnel: ()=>{
    let DlishBlockchainInstance;

    web3.eth.getAccounts(async (err, accounts)=>{
      err ? console.log(err) : null;

      let account = web3.toChecksumAddress(accounts[0]);
      D2G.setCookies(account)
      // alert(account)
      
      DlishBlockchainInstance = await D2G.contracts.DlishBlockchain.deployed();

      
      let delivery = await DlishBlockchainInstance.deliveryperson(account).catch(err=>console.log(err))
      let restaurant = await DlishBlockchainInstance.restaurant(account).catch(err=>console.log(err))
      if(delivery || restaurant){
        alert(`This (${account}) account is already registered`)
        return false
      }
      
      res = await DlishBlockchainInstance.RegisterDeliveryPerson({from: account, gas:4712388}).catch(err=>console.log(err))
      

      if(!res)
        return false       
        

      console.log("Delivery Personnel Registered successfully", res) 

     

      $.ajax({
        url:`${HOST}deliveryPersonnel/register`,
        method: 'POST',
        data:JSON.stringify({            
          deliverPersonnel_add: account,          
          deliveryPersonnel_name: $('#del-name').val(),
          phone: $('#del-phone').val(),
          city: $('#del-city').val(),
      }),
        contentType: 'application/json',
        success:(result)=>{
          console.log("data sent")
          alert(result)
          window.location.href='/deliveryPersonnel/'
        }
        });

      return true
      
     
    })
  },


  acceptOrder: orderId=>{
    let DlishBlockchainInstance;

    web3.eth.getAccounts(async (err, accounts)=>{
      err ? console.log(err) : null;

      let account = web3.toChecksumAddress(accounts[0]);
      D2G.setCookies(account)
      // alert(account)
      
      DlishBlockchainInstance = await D2G.contracts.DlishBlockchain.deployed();

      
      
      res = await DlishBlockchainInstance.AcceptOrder(orderId, {from: account, gas:4712388}).catch(err=>console.log(err))
      
      if(!res)
        return false
        

      console.log("Order accepted successfully", res) 

     

      $.ajax({
        url:`${HOST}deliveryPersonnel/acceptOrder`,
        method: 'POST',
        data:JSON.stringify({            
          deliverPersonnel_add: account,          
          accept: true,
          orderId: orderId          
      }),
        contentType: 'application/json',
        success:(result)=>{
          console.log("data sent")
          window.location.reload()
        }
        });

      return true
      
     
    })
  },


  outForDelivery: orderId=>{
    let DlishBlockchainInstance;

    web3.eth.getAccounts(async (err, accounts)=>{
      err ? console.log(err) : null;

      let account = web3.toChecksumAddress(accounts[0]);
      D2G.setCookies(account)
      // alert(account)
      
      DlishBlockchainInstance = await D2G.contracts.DlishBlockchain.deployed();

      
      
      res = await DlishBlockchainInstance.OutForDelivery(orderId, {from: account, gas:4712388}).catch(err=>console.log(err))
      
      if(!res)
        return false
        

      console.log("Order accepted successfully", res) 

     

      $.ajax({
        url:`${HOST}deliveryPersonnel/outForDelivery`,
        method: 'POST',
        data:JSON.stringify({            
          deliverPersonnel_add: account,          
          outForDelivery: true,
          orderId: orderId          
      }),
        contentType: 'application/json',
        success:(result)=>{
          console.log("data sent")
          window.location.reload()
        }
        });

      return true
      
     
    })
  },


  orderReceived: orderId=>{
    let DlishBlockchainInstance;

    web3.eth.getAccounts(async (err, accounts)=>{
      err ? console.log(err) : null;

      let account = web3.toChecksumAddress(accounts[0]);
      D2G.setCookies(account)
      // alert(account)
      
      DlishBlockchainInstance = await D2G.contracts.DlishBlockchain.deployed();

      
      
      res = await DlishBlockchainInstance.received(orderId, {from: account, gas:4712388}).catch(err=>console.log(err))
      
      if(!res)
        return false
        

      console.log("Order received successfully", res) 

     

      $.ajax({
        url:`${HOST}orderReceived`,
        method: 'POST',
        data:JSON.stringify({            
          customer_add: account,          
          received: true,
          orderId: orderId          
      }),
        contentType: 'application/json',
        success:(result)=>{
          console.log("data sent")
          window.location.reload()
        }
        });

      return true
      
     
    })
  }
};
    

// $(document).ready(function(){

//   D2G.init(_=>console.log("completed"));
// });

  
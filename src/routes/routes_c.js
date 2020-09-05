const express = require('express');
const router = express.Router();
const mongo = require('../util/mongo');


const placeOrder= async (req)=>{
    let orderId = await mongo.get(mongo.ORDER, {}).sort({ _id:-1 }).limit(1);

    let order = {
        _id: orderId+1,
        customer_add: req.body.customer_add,
        restaurant_add: req.body.restaurant_add,
        deliveryPersonal_add: req.body.deliveryPersonal_add,
        totAmount: req.body.totAmount,
        status: 1,
        address: req.body.address,
        phone: req.body.phone,
        customer_name: req.body.customer_name,
        dishes: req.body.dishes                
    };
    
    // return mongo.put(mongo.ORDER, order);
};

router.post('/placeorder', (req, res)=>{
    let data = req.body;
    // console.log(req);
    // console.log(data);
    // console.log(req.file);
    placeOrder(req);
    res.end();
});


router.get('/', (req, res)=>{
    res.send("This the customer home page");
    
});

module.exports = router;
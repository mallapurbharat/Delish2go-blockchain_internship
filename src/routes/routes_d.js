const express = require('express');
const router = express.Router();
const mongo = require('../util/mongo');
const { ORDER_STATUS } = mongo;



router.get('/', async (req, res)=>{
    // res.send("This the Delivery Personnel home page");
    let deliveryPersonnel = await mongo.get(mongo.DELIVERY_PERSONNEL, { _id: req.cookies.del_acc_add }).next();
    let restaurants = []
    let orders = []

    if(!deliveryPersonnel.isAssigned){
        restaurants = await mongo.get(mongo.RESTAURANT, { city: deliveryPersonnel.city }).toArray();
        let restaurantIds = []
        restaurants.forEach(restaurant=>restaurantIds.push(restaurant._id))

        if(restaurants.length>0){
            orders = await mongo.get(mongo.ORDER, { restaurant_add: { $in: restaurantIds }, status: ORDER_STATUS.PENDING }).toArray();
            orders.forEach(async order=>{
                let rest;
                restaurants.forEach(restaurant=>{
                    if(restaurant._id==order.restaurant_add)
                        rest = restaurant
                });

                order.restaurant_address = rest.address
                order.restaurant_name = rest.restaurant_name
                order.restaurant_phone = rest.phone
            })
        }
            
    }

    res.render('deliveryPersonnel/orders_d', { 
        deliveryPersonnel: deliveryPersonnel,
        orders: orders
    })
    
});


router.get('/pastOrders', async (req, res)=>{
    orders = await mongo.get(mongo.ORDER, { deliveryPersonnel_add: req.body.del_acc_add, status: ORDER_STATUS.ACCEPTED }).toArray();

    res.render('deliveryPersonnel/pastOrders_d', { orders: orders })
})

module.exports = router;
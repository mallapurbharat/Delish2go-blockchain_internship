require('dotenv').config();
const express = require('express');
const app = express();
const mongo = require('./src/util/mongo');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ORDER_STATUS } = require('./src/util/mongo');
const { isCustomer } = require('./src/util/auth');

app.set('views', './src/views');
app.set('view engine', 'ejs');

// ############ middlewares ###############
app.use(express.static('./src/public'));
app.use(express.static('./build'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/restaurant', require('./src/routes/routes_r'));
app.use('/deliveryPersonnel', require('./src/routes/routes_d'));


// ############ routes ####################
app.get('/', async (req, res)=>{ 
  let cities =[];

  await mongo.get(mongo.CITY, {}).sort({ name: 1 }).forEach((city)=>{
      
      cities.push(city.name);
  })

  res.render('home', { cities: cities});
});


app.get('/restaurants/:city?', async (req, res)=>{
    let restaurants = [];
    let cities =[];

    await mongo.get(mongo.CITY, {}).sort({ name: 1 }).forEach((city)=>{
        
        cities.push(city.name);
    })

    if(req.params.city)
        restaurants = await mongo.get(mongo.RESTAURANT, { city: req.params.city }).toArray();
    // console.log(restaurants);

    // res.json(restaurants);
    res.render("customer/restaurants", {
        restaurants: restaurants,
        cities: cities
    });
});


app.get('/menu/:res_acc_add?', async (req, res)=>{
      let dishes=[];

      if(req.params.res_acc_add){
        let restaurant = await mongo.get(mongo.RESTAURANT, { _id: req.params.res_acc_add }, { dish_ids:1 }).toArray(); 
        restaurant.length !=0 ? dishes = await mongo.get(mongo.DISH, { _id: { $in: restaurant[0].dish_ids }}).toArray() : null;
      }
    // let restaurant = await mongo.get(mongo.RESTAURANT, { _id: req.params.res_acc_add }, { dish_ids:1 }).toArray(); 
    // let dishes = await mongo.get(mongo.DISH, { _id: { $in: restaurant[0].dish_ids }}).toArray();
    // console.log(req.params.res_acc_add)
    // res.json(dishes); 
    res.render('customer/menu', {dishes:dishes});
});


app.get('/myOrders', isCustomer, async (req, res)=>{
    //here res_acc_add is assumed os cus_acc_add
    // let cus_acc_add = 
    let orders = await mongo.get(mongo.ORDER, { customer_add: req.cookies.cus_acc_add }).toArray();

    res.render('customer/myorders_c', { 
        orders: orders,
        ORDER_STATUS: ORDER_STATUS
     });
});



app.get('/cart', (req, res)=>{
    res.render('customer/cart');
});


const placeOrder= async (req)=>{
    let orderId = await mongo.get(mongo.ORDER, {}).sort({ _id:-1 }).limit(1).toArray();

    let order = {
        _id: orderId[0]._id+1,
        customer_add: req.body.customer_add,
        restaurant_add: req.body.restaurant_add,
        deliveryPersonal_add: req.body.deliveryPersonal_add,
        billAmount: req.body.billAmount,
        status: 1,
        address: req.body.address,
        phone: req.body.phone,
        customer_name: req.body.customer_name,
        dishes: req.body.dishes,
        totQunt: req.body.totQunt
    };
    
    return mongo.put(mongo.ORDER, order);
};

app.post('/placeorder', (req, res)=>{
 
    placeOrder(req).then(_=>res.status(200).send("Order placed successfully")).catch(_=>res.status(500).send("Order placed was not placed"));

});


app.post('/orderReceived', isCustomer, async (req, res)=>{
 
    await mongo.update(mongo.ORDER, { _id: parseInt(req.body.orderId) }, { status: ORDER_STATUS.DELIVERED })
    let order = await mongo.get(mongo.ORDER, { _id: parseInt(req.body.orderId) }).next()
    mongo.update(mongo.DELIVERY_PERSONNEL, { _id: order.deliveryPersonnel_add }, { isAssigned: false })

    res.status(200).send("Order Delivered")
});


app.get('/login', (req, res)=>{
    res.render('login')
})


app.listen(3000, ()=>{
    console.log("listening on PORT 3000");
    mongo.default();

});
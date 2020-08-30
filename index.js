const express = require('express');
const app = express();
const mongo = require('./src/util/mongo');
const bodyParser = require('body-parser');

app.set('views', './src/views');
app.set('view engine', 'ejs');

// ############ middlewares ###############
app.use(express.static('./src/public'));
app.use(express.static('./build'));
app.use(bodyParser.json());

app.use('/restaurant', require('./src/routes/routes_r'));
app.use('/customer', require('./src/routes/routes_r'));


// ############ routs ####################
app.get('/', (req, res)=>{
    res.render('home');
});


app.get('/restaurants/:city', async (req, res)=>{
    let restaurants = await mongo.get(mongo.RESTAURANT, { city: req.params.city }).toArray();
    // console.log(restaurants);

    // res.json(restaurants);
    res.render("customer/restaurants", restaurants);
});


app.get('/menu/:res_acc_add', async (req, res)=>{
    let restaurant = await mongo.get(mongo.RESTAURANT, { _id: req.params.res_acc_add }, { dish_ids:1 }).toArray(); 
    let dishes = await mongo.get(mongo.DISH, { _id: { $in: restaurant[0].dish_ids }}).toArray();
    console.log(req.params.res_acc_add)
    // res.json(dishes); 
    res.render('customer/menu', dishes);
});

app.get('/cart', (req, res)=>{
    res.render('customer/cart');
});




app.listen(3000, ()=>{
    console.log("listening on PORT 3000");
    mongo.default();

});
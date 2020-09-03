const express = require('express');
const app = express();
const mongo = require('./src/util/mongo');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'src/uploads/'});

app.set('views', './src/views');
app.set('view engine', 'ejs');

// ############ middlewares ###############
app.use(express.static('./src/public'));
app.use(express.static('./build'));
app.use(bodyParser.json());

app.use('/restaurant', require('./src/routes/routes_r'));
app.use('/customer', require('./src/routes/routes_r'));


// ############ routes ####################
app.get('/', (req, res)=>{
    res.render('home');
});


app.get('/restaurants/:city?', async (req, res)=>{
    let restaurants = null;

    if(req.params.city)
        restaurants = await mongo.get(mongo.RESTAURANT, { city: req.params.city }).toArray();
    // console.log(restaurants);

    // res.json(restaurants);
    res.render("customer/restaurants", restaurants);
});


app.get('/menu/:res_acc_add?', async (req, res)=>{
    let dish = [
        {
          Id:"101",
          name:"Paneer Butter Masala",
          price:"190",
          img:"/customer/img/menu/01.jpg"
        },
        {
          Id:"102",
          name:"Biryani",
          price:"190",
          img:"/customer/img/menu/02.jpeg"
        },
        {
          Id:"103",
          name:"Chicken tikka masala",
          price:"190",
          img:"/customer/img/menu/03.jpeg"
        },
        {
          Id:"104",
          name:"Butter chicken",
          price:"190",
          img:"/customer/img/menu/04.jpg"
        },
        {
          Id:"105",
          name:"Alu Gobi",
          price:"190",
          img:"/customer/img/menu/05.jpg"
        },
        {
          Id:"106",
          name:"Carrot Halwa",
          price:"190",
          img:"/customer/img/menu/06.jpg"
        },
        {
          Id:"107",
          name:"Gulab Jamun",
          price:"190",
          img:"/customer/img/menu/07.jpg"
        },
        {
          Id:"108",
          name:"Chicken 65",
          price:"190",
          img:"/customer/img/menu/08.jpg"
        }
      ]
    // let restaurant = await mongo.get(mongo.RESTAURANT, { _id: req.params.res_acc_add }, { dish_ids:1 }).toArray(); 
    // let dishes = await mongo.get(mongo.DISH, { _id: { $in: restaurant[0].dish_ids }}).toArray();
    // console.log(req.params.res_acc_add)
    // res.json(dishes); 
    res.render('customer/menu', {dishes:dish});
});

app.get('/cart', (req, res)=>{
    res.render('customer/cart');
});




app.listen(3000, ()=>{
    console.log("listening on PORT 3000");
    mongo.default();

});
const express = require('express');
const router = express.Router();
const mongo = require('../util/mongo');
const { v4:uuidv4 } = require('uuid');
const { getCookie } = require('../util/helper');
const { isRestaurant } = require('../util/auth');

const UPLOADS_PATH = 'src/uploads/';

const multer = require('multer');
const restaurantImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOADS_PATH);
    },
    filename: function (req, file, cb) {
      let extentions = file.mimetype.split('/');
      let filename = req.body.res_acc_address + '.' + extentions[extentions.length-1];
      req.body.filename = filename;
      cb(null, filename);
    }
  });
const restaurantImgUpload = multer({ storage: restaurantImgStorage});


const dishImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOADS_PATH);
    },
    filename: function (req, file, cb) {
      let extentions = file.mimetype.split('/');
      let filename = uuidv4() + '.' + extentions[extentions.length-1];
      req.body.filename = filename;
      cb(null, filename);
    }
  });
const dishImgUpload = multer({ storage: dishImgStorage});

const fs = require('fs');
const csv = require('csv-parser');
const { send } = require('process');



// #################### ROUTES ########################

router.get('/register', async (req, res)=>{
    let cities =[];

    await mongo.get(mongo.CITY, {}).sort({ name: 1 }).forEach((city)=>{
        
        cities.push(city.name);
    })

    res.render('restaurant/register_restaurant', { cities: cities});
});

const registerRestaurant= (req)=>{
    let img_data
    try{
        img_data = fs.readFileSync(`${ UPLOADS_PATH }${ req.body.filename }`)
    } catch (err){
        console.log(err)
    } finally{
        fs.unlink(`${ UPLOADS_PATH }${ req.body.filename }`, err=>err?console.log(err):null)
    }

    let restaurant = {
        _id: req.body.res_acc_address,
        restaurant_name: req.body.restaurant_name,
        img:{
            data: img_data,
            mimetype: req.file.mimetype
        },
        phone: req.body.phone,
        city: req.body.city,
        address: req.body.address,
        type: req.body.type,
        start_time: req.body.start_time,
        close_time: req.body.close_time,
        holiday: req.body.holiday,
        dish_ids:[]                
    };
    
    return mongo.put(mongo.RESTAURANT, restaurant);
};

router.post('/register', restaurantImgUpload.single('img'), (req, res)=>{
    let data = req.body;
    // console.log(req);
    // console.log(data);
    // console.log(req.file);
    registerRestaurant(req);
    res.end();
});


// res1 : 0x616f0E1743174CCC777c08286724c67aED3907aA chennai
// res2 : 0x73e57089ae0301df36418e02af5a4651d41db702

// dish1: 9ecf526c-22d4-4d06-b315-1c8e86f18080
// dish2: 70c48ea1-4f84-48a8-b02f-f7cf0251096b
router.get('/menu', isRestaurant, async (req, res)=>{

    let res_acc_add = req.body.restaurant._id;
    if(res_acc_add == null)
        res.status(403).end();
    else{
        let restaurant = await mongo.get(mongo.RESTAURANT, { _id: res_acc_add }, { dish_ids:1 }).toArray();
 
        let dishes = await mongo.get(mongo.DISH, { _id: { $in: restaurant[0].dish_ids }}).toArray();
    
        // res.json(dishes);
        
        res.render('restaurant/menu_r', {dishes:dishes});     
    }       
    // res.render('restaurant/menu_r');
});

const UCDish=(req)=>{
    let img_data
    try{
        img_data = fs.readFileSync(`${ UPLOADS_PATH }${ req.body.filename }`)
    } catch (err){
        console.log(err)
    } finally{
        fs.unlink(`${ UPLOADS_PATH }${ req.body.filename }`, err=>err?console.log(err):null)
    }


    let dish = {        
        dish_name: req.body.dish_name,   
        img:{
            data: img_data,
            mimetype: req.file.mimetype
        },  
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,    
    };
    
    if(req.body.dish_id!='null')
        return mongo.update(mongo.DISH, { _id:req.body.dish_id }, dish);
      
    dish['_id']=uuidv4();
    // return mongo.put(mongo.DISH, dish);
};

router.post('/UCDish', isRestaurant, dishImgUpload.single('img'), (req, res)=>{
    let data = req.body;   

    UCDish(req).then(result=>{
        if(result==0)
            return res.status(200).send({msg: "success"});
        if(result==1)
            return res.status(500).end();
        if(result==2)
            return res.status(409).send({error:"dish id does not exist"});
    });
    
});


router.get('/dishform', isRestaurant, (req, res)=>{
    res.render('restaurant/dish_form');   
});

router.get('/orders', isRestaurant, async (req, res)=>{
    let orders =[]
    orders = await mongo.get(mongo.ORDER, { restaurant_add: req.cookies.res_acc_add}).toArray();

    res.render('restaurant/orders_r', { orders: orders});
});

// router.get('/csv', (req, res)=>{
//     fs.createReadStream('in.csv').pipe(csv()).on('data', (row)=>{
//         console.log(row);
//         // cities.cities.push(row.city)
//         // mongo.put({
//         //     name:row.city,
//         //     state:row.admin
//         // });
//     })

//     res.send('CSV restaurant');
// });

router.get('/', (req, res)=>{
    res.send("This the restaurant home page");
    let restaurant = {
        res_acc_address:'',
        restaurant_name:'',
        phone:'',
        city:'',
        address:'',
        type:'',
        start_time:'',
        close_time:'',
        holiday:'',
        
    };
    // mongo.put(mongo.RESTAURANT,restaurant);
    
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongo = require('../util/mongo');
const { v4:uuidv4 } = require('uuid');
const { getCookie } = require('../util/helper');

const fs = require('fs');
const csv = require('csv-parser');
const { send } = require('process');



router.get('/register', async (req, res)=>{
    let cities =[];

    await mongo.get(mongo.CITY, {}).sort({ name: 1 }).forEach((city)=>{
        
        cities.push(city.name);
    })

    res.render('restaurant/register_restaurant', { cities: cities});
});

const registerRestaurant=(res_acc_address,restaurant_name,phone,city,address,type,start_time,close_time,holiday)=>{
    let restaurant = {
        _id: res_acc_address,
        restaurant_name: restaurant_name,
        phone: phone,
        city: city,
        address: address,
        type: type,
        start_time: start_time,
        close_time: close_time,
        holiday: holiday,
        dish_ids:[]                
    };
    
    return mongo.put(mongo.RESTAURANT, restaurant);
};

router.post('/register', (req, res)=>{
    let data = req.body;
    
    registerRestaurant(data.res_acc_address,data.restaurant_name,data.phone,data.city,data.address,data.type,data.start_time,data.close_time,data.holiday);
    res.end();
});


// res1 : 0xb073e010297a0698b89361cd7378d67da1b915c2
// res2 : 0x73e57089ae0301df36418e02af5a4651d41db702
router.get('/menu', async (req, res)=>{

    let res_acc_add = getCookie(req, 'res_acc_add');
    if(res_acc_add == null)
        res.status(403).end();
    else{
        let restaurant = await mongo.get(mongo.RESTAURANT, { _id: res_acc_add }, { dish_ids:1 }).toArray();
 
        let dishes = await mongo.get(mongo.DISH, { _id: { $in: restaurant[0].dish_ids }}).toArray();
    
        // res.json(dishes);
        res.render('restaurant/dish_form', dishes);
    }       
});

const UCDish=(dish_id, dish_name, type, description, price)=>{
    let dish = {        
        dish_name: dish_name,     
        type: type,
        description: description,
        price: price,    
    };
    
    if(dish_id)
        return mongo.update(mongo.DISH, { _id:dish_id }, dish);
      
    dish['_id']=uuidv4();
    return mongo.put(mongo.DISH, dish);
};

router.post('/menu', (req, res)=>{
    let data = req.body;   

    UCDish(data.dish_id, data.dish_name, data.type, data.description, data.price).then(result=>{
        if(result==0)
            return res.status(200).send({msg: "success"});
        if(result==1)
            return res.status(500).end();
        if(result==2)
            return res.status(409).send({error:"dish id does not exist"});
    });
    
});

router.get('/orders', (req, res)=>{
    res.end();
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
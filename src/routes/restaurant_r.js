const express = require('express');
const router = express.Router();
const mongo = require('../util/mongo');

const fs = require('fs');
const csv = require('csv-parser');

router.get('/register', (req, res)=>{
    res.render('register_restaurant');
});

router.get('/csv', (req, res)=>{
    fs.createReadStream('in.csv').pipe(csv()).on('data', (row)=>{
        console.log(row);
        // cities.cities.push(row.city)
        // mongo.put({
        //     name:row.city,
        //     state:row.admin
        // });
    })

    res.send('CSV restaurant');
});

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
    mongo.put(mongo.RESTAURANT,restaurant);
});

module.exports = router;
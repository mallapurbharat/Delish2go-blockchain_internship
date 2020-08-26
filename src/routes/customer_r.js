const express = require('express');
const router = express.Router();
const mongo = require('../util/mongo');

router.get('/', (req, res)=>{
    res.send("This the customer home page");
    
});

module.exports = router;
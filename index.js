const express = require('express');
const app = express();
const mongo = require('./src/util/mongo');

app.set('views', './src/views');
app.set('view engine', 'ejs');

// ############ middlewares ###############
app.use(express.static('./src/public'));
app.use(express.static('./build'));

app.use('/restaurant', require('./src/routes/routes_r'));
app.use('/customer', require('./src/routes/routes_r'));


// ############ routs ####################
app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/home', (req, res)=>{
    res.send("This is vivek");
});




app.listen(3000, ()=>{
    console.log("listening on PORT 3000");
    mongo.default();

});
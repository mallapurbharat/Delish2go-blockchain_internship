const express = require('express');
const app = express();

app.set('views', './src/views');
app.set('view engine', 'ejs');

// ############ middlewares ###############
app.use(express.static('./src/public'));
app.use(express.static('./build'));


// ############ routs ####################
app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/home', (req, res)=>{
    res.send("This is vivek");
});

app.listen(3000, ()=>console.log("listening on PORT 3000"));
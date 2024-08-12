const express = require('express');
const mongoose = require('mongoose');
const routes = require('./Router/Routes');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

mongoose.connect('mongodb+srv://Gnanariddhika:Gnana_123@mern.607fh2x.mongodb.net/MERN')
.then(() =>{
    console.log("MongoDB Connected");
})

app.use('/',routes);
app.use('/addproducts',routes);
app.use('/deleteproducts',routes);
app.use('/adduser',routes);
app.use('/updateproducts',routes);
app.use('/jwt',routes);
app.use('/cart',routes);
app.use('/viewcart',routes);
app.use('/deletecart',routes);
app.use('/deletecartproducts/:id',routes);
app.use('/placeorder/:id',routes);
app.use('/vieworders',routes);

app.listen(3000,()=>{
    console.log("Server started");
})
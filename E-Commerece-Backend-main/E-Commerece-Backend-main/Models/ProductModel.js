const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    id:String,
    title:String,
    description:String,
    price:String,
    category:String,
    image:String,
    rating:{
        rate:Number,
        count:Number
    }
});

const Product = new mongoose.model('product',ProductSchema);
module.exports=Product;
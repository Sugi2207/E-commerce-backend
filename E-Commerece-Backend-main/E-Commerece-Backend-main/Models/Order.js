const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user_id:String,
    orderUsername:String,
    email:String,
    order:[{
    address:String,
    phone:Number,
    orderdate:{
        type:Date
    },
    estimatedate:Date,
    product_id:String,
    }]
});

const Order = new mongoose.model('order',OrderSchema);
module.exports=Order;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const LoginSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:[true,"Username already exists"]
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
});

LoginSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Login = new mongoose.model("login",LoginSchema);
module.exports=Login;
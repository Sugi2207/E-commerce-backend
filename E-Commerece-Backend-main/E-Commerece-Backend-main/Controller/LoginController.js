const Login = require("../Models/Login");
const jwt = require("jsonwebtoken");
const bcrypt =require("bcrypt");

exports.postuser = async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const Logindetails =new Login({
            
            username,
            email,
            password
        })
        await Logindetails.save().then(()=>{
            res.json("User Registered Successfully")
            console.log(Logindetails)
        })
    }
    catch(err){
        console.log("Error",err);
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(404).json("No such user exists");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json("Invalid credentials");
        }

        const token = jwt.sign({ user_id: user._id }, "secret key", {
            expiresIn: "1d"
        });

        res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
}

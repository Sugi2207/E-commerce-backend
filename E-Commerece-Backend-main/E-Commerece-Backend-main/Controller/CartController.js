const Cart = require("../Models/Cart");
const Product = require('../Models/ProductModel');
const {v4:uuidv4} =require('uuid')

exports.addToCart = async (req, res) => {
    const { user_id } = req.user; // fixed destructuring
    const { product_id, quantity } = req.body;

    try {
        // Check if a cart already exists for the user
        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            // If no cart exists, create a new cart
            const newCart = new Cart({
                user_id,
                products: [
                    {
                        product_id,
                        quantity,
                    }
                ],
            });
            await newCart.save();
            return res.json({ message: "New Cart created for new user" });
        }

        // If the cart exists, check if the product is already in the cart
        const productIndex = cart.products.findIndex((prod) => prod.product_id.toString() === product_id.toString());
        if (productIndex > -1) {
            // Update quantity if the product exists in the cart
            cart.products[productIndex].quantity += quantity;
        } else {
            // Add the new product to the cart
            cart.products.push({ product_id, quantity });
        }

        await cart.save();
        return res.status(201).json({ message: "Cart is updated successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



exports.viewCart = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log("User ID:", user_id); // Log the user_id for debugging

        let cart = await Cart.findOne({ user_id });
        console.log("Cart:", cart); // Log the cart for debugging

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        let subtotal = 0;
        const cartItems = await Promise.all(
            cart.products.map(async (product) => {
                const productDetails = await Product.findOne({ id: product.product_id });
                subtotal += productDetails.price * product.quantity;
                return {
                    product_id: productDetails.id,
                    title: productDetails.title,
                    description: productDetails.description,
                    price: productDetails.price,
                    image: productDetails.image,
                    quantity: product.quantity,
                };
            })
        );

        return res.status(200).json({ cartItems, subtotal });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};



exports.deletecart = async (req, res) => {
    const { product_id } = req.body;
    const user_id  = req.user.user_id;
    console.log(`${user_id}`);
    
    try {
        let cart = await Cart.findOne({ user_id });
        console.log(cart); // products array
        
        if (!cart) {
            return res.status(404).json({ message: "User not found" });
        }
        
        else{
            // Filter out the product with the given product_id
            const filteredProducts = cart.products.filter(product => product.product_id !== product_id);
            console.log(filteredProducts);

            // Update the cart with the filtered products
            cart.products = filteredProducts;
            await cart.save();

            res.status(200).json({ message: "Product removed from cart", cart });
            }
        } 
        catch (error) 
        {
        console.error("error:", error);
        return res.status(500).json({ message: "Server error", error });
        }
}

exports.deletecartproducts=async(req,res)=>{
    const{user_id}= req.user;
    const product_id=req.params.id;     
    try{
    let cart= await Cart.findOne({user_id}); 

    if(!cart){
        return res.status(404).json({message:"Cart is empty"});
    }
    console.log(cart.products[0].product_id);
    console.log("cart items :",cart);
    if(cart.products.length<=1){
        
        await Cart.deleteOne({ user_id});
        return res.status(200).json({message:"Cart is Empty by deleting 1 item"});
    } 
    else{
        cart.products=cart.products.filter((prod)=>  prod.product_id!==product_id);
       
        await cart.save();
        console.log("updated cart items :",cart);
        return res.status(200).json({cart});
    }
}catch(error){
    console.log("error: ",error); 
}
}
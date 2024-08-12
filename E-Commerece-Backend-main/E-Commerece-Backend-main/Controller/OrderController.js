const Login = require('../Models/Login');
const Order = require('../Models/Order');
const Cart = require('../Models/Cart');
const Product = require('../Models/ProductModel')

exports.placeorder = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const productid=req.params.id;
        
        // Fetch user details
        const user = await Login.findById(user_id).select('email username').exec();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        
        const { orderUsername, address, phone, orderdate, estimatedate, product_id } = req.body;
        let cart = await Cart.findOne({ user_id });
        
        let order_user = await Order.findOne({ user_id });
        const date = Date.now();
        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; 
        const futureDate = new Date(date + sevenDaysInMilliseconds)
            const newOrder = new Order({
                user_id:user_id,
                orderUsername: user.username,
                email: user.email,
                order: [
                    {
                        address,
                        phone,
                        orderdate: date,
                        estimatedate:futureDate,
                        product_id:productid
                    }
                ]
            });
            await newOrder.save();
            cart.products=cart.products.filter((prod)=>  prod.product_id!==productid);
            await cart.save();
            console.log("updated cart items :",cart);

            return res.json({ message: "Order placed successfully" });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getOrder = async (req, res) => {
    const user_id = req.user.user_id;
    console.log(`User Id in Order ${user_id}`);
  
    try {
      // Fetch all orders for the user
      const userOrders = await Order.find({ user_id });
  
      if (!userOrders || userOrders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      const productIds = userOrders.flatMap((order) =>
        order.order.map((item) => item.product_id)
      );
  
      const products = await Product.find({ product_id: { $in: productIds } });
  
      const ordersWithDetails = userOrders.map((order) => {
        const updatedOrderItems = order.order.map((item) => {
          const product = products.find(
            (prod) => prod.product_id === item.product_id
          );
          return {
            ...item,
            product,
          };
        });
  
        return {
          ...order._doc,
          order: updatedOrderItems,
        };
      });
  
      res.json(ordersWithDetails);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error.message });
    }
  };exports.getOrder = async (req, res) => {
  const user_id = req.user.user_id;
  console.log(`User Id in Order ${user_id}`);

  try {
    // Fetch all orders for the user
    const userOrders = await Order.find({ user_id });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const productIds = userOrders.flatMap((order) =>
      order.order.map((item) => item.product_id)
    );

    const products = await Product.find({ product_id: { $in: productIds } });

    const ordersWithDetails = userOrders.map((order) => {
      const updatedOrderItems = order.order.map((item) => {
        const product = products.find(
          (prod) => prod.product_id === item.product_id
        );
        return {
          ...item,
          product,
        };
      });

      return {
        ...order._doc,
        order: updatedOrderItems,
      };
    });

    res.json(ordersWithDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};
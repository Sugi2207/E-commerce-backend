const Product = require("../Models/ProductModel");
const { v4: uuidv4 } = require('uuid');

exports.getProducts = async (req, res) => {
    try {
      
      const products = await Product.find();
      res.send(products);
      console.log("Fetched");
    } catch (err) {
      
      console.error("Error fetching products:", err);
      res.status(500).send("Internal server error");
    }
};

exports.postProducts = async(req,res) =>{
  try{
      const{id,title,description,category,price,image,rating}=req.body;
      const Products = new Product({
        id:uuidv4(),
        title,
        description,
        category,
        price,
        image,
        rating
      })
      await Products.save().then(()=>{
        console.log("Product added Successfully");
        res.json(Products);
      })
  }
  catch(err)
  {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
}

exports.deleteproduct=async(req,res)=>{
  try{
  await Product.deleteOne({id:req.body.id}).then(()=>{
      res.status(200).json("success")
      
  })

  }catch(e){
      console.log(e)
  }
 
}

exports.updateProduct = async (req,res)=>{
  try{ 
      const product = await Product.find({id:req.body.id})
      const {title,description,price,category,image,rating} = product
      console.log(product)
      await Product.updateOne({id:req.body.id},{
          $set:{
              title:(req.body.title || title ),
              description:(req.body.description || description),
              price:(req.body.price || price),
              category:(req.body.category || category),
              image:(req.body.image || image),
              rating:(req.body.rating || rating)
          }
      })
      res.status(200).json('updated')
  }
  catch(e){
      console.log(e)
  }
}


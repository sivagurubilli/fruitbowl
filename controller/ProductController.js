const { Product } = require("../models/productModel");
const { isRequestDataValid } = require("../utils/appUtils");
module.exports = {
async createProduct  (req, res) {
  try {
    const {
      name,
      description,
      category,
      image,
      status,
      productItems,
  
      price,
      discountPrice,
    } = {
      ...req.body,
      ...req.query,
      ...req.params,
    };
    const requiredFields = {
      name,
      description,
      category,
      image,
      status,
      productItems,
      price,
      discountPrice,
    };
    let requestDataValid = isRequestDataValid(requiredFields, "1234");
    if (requestDataValid !== true) {
      return res.status(400).json({ status: "NOK", error: requestDataValid });
    }

    const product = new Product({
      name,
      description,
      category,
      image,
      status,
      productItems,
      price,

      discountPrice,
    });
    await product.save();

    res
      .status(201)
      .json({
        status: "OK",
        message: "Product created successfully",
        details: product,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "NOK",
        error: error.message,details:error.message,
      });
  }
},

async getProduct (req, res) {
    try {
      const {id } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };
  
     let filter ={}
     if(id) filter._id=  id
  
      const products = await Product.find().populate('category').populate('productItems'); 
      res
        .status(201)
        .json({
          status: "OK",
          message: "Products fecthed successfully",
          details: products,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "NOK",
          error: error.message,details:error.message
        });
    }
  },
}
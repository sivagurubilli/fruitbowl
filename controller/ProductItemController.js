const { ProductItem } = require("../models/productItemModel");
const { isRequestDataValid } = require("../utils/appUtils");
module.exports = {

async createProductItem  (req, res)  {
  try {
    const { name, description, calories, image, status } = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    const requiredFields = { name, description, calories, image, status };
    let requestDataValid = isRequestDataValid(requiredFields, "1234");
    if (requestDataValid !== true) {
      return res.status(400).json({ status: "NOK", error: requestDataValid });
    }

    // Create new ProductItem
    const productItem = new ProductItem({
      name,
      description,
      calories,
      image,
      status,
    });
    await productItem.save();

    res.status(201).json({
      status: "OK",
      message: "Product item created successfully",
      details: productItem,
    });
  } catch (error) {
    res.status(500).json({
      status: "NOK",
      error: error.message,details:error.message
    });
  }
},

async getProductItem  (req, res) {
    try {
      const {id } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };
  
     let filter ={}
     if(id) filter._id=  id
  
      const productitems = await ProductItem.find(filter);
  
      res
        .status(201)
        .json({
          status: "OK",
          message: "Product Items fecthed successfully",
          details: productitems,
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

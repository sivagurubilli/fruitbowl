const { Category } = require("../models/categoryModel");
const { isRequestDataValid } = require("../utils/appUtils");
module.exports = {
 async createCategory (req, res) {
  try {
    const { name, description,categoryType, image, status } = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    const requiredFields = { name, description,categoryType, image, status };
    let requestDataValid = isRequestDataValid(requiredFields, "1234");
    if (requestDataValid !== true) {
      return res.status(400).json({ status: "NOK", error: requestDataValid });
    }

    const category = new Category({ name,categoryType, description , image, status});
    await category.save();

    res
      .status(201)
      .json({
        status: "OK",
        message: "Category created successfully",
        details: category,
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

async getCategory  (req, res) {
    try {
      const {id } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };
  
     let filter ={}
     if(id) filter._id=  id
  
      const category = await Category.find(filter);
  
      res
        .status(201)
        .json({
          status: "OK",
          message: "Category fetched successfully",
          details: category,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "NOK",
          error: error.message,details:error.message
        });
    }
  }
}



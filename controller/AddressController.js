import { getCurrentDateAndTime } from "../helper/dates";
import { UserAddress } from "../models/addressModel";
import { isRequestDataValid } from "../utils/appUtils";

// Controller for User Address
module.exports = {
  async addUserAddress(req, res) {
    try {
      const { 
      
        addressType, 
        fullAddress, 
        flatNumber, 
        landmark, 
        area, 
        city, 
        state, 
        pincode, 
        deliveryPreference,
        isDefault,
        latitude,longitude
      } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };


      let   userId = req.user._id

      // Required fields validation
      const requiredFields = { userId, addressType, fullAddress, area, city, state, pincode };
      let requestDataValid = isRequestDataValid(requiredFields, "1234");
      if (requestDataValid !== true) {
        return res.status(400).json({ status: "NOK", error: requestDataValid });
      }

      // If the new address is set as default, update all other addresses for this user
      if (isDefault) {
        await UserAddress.updateMany(
          { userId: userId },
          { $set: { isDefault: false } }
        );
      }

      const userAddress = new UserAddress({
        userId,
        addressType,
        fullAddress,
        flatNumber,
        landmark,
        area,
        city,
        state,
        pincode,
        deliveryPreference: {
          leaveAtDoor: deliveryPreference?.leaveAtDoor || false,
          avoidCalling: deliveryPreference?.avoidCalling || false,
          deliveryInstructions: deliveryPreference?.deliveryInstructions || "",
          preferredDeliveryWindow: deliveryPreference?.preferredDeliveryWindow || {}
        },
        isDefault: isDefault || false,
        latitude,longitude,
        status: 'active'
      });

      await userAddress.save();

      res.status(201).json({
        status: "OK",
        message: "Address added successfully",
        details: userAddress
      });
    } catch (error) {
      res.status(500).json({
        status: "NOK",
        error: error.message,
        details: error.message
      });
    }
  },

  async getUserAddresses(req, res) {
    try {
      const {  } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      let   userId = req.user._id 
      if (!userId) {
        return res.status(400).json({ 
          status: "NOK", 
          error: "UserId is required" 
        });
      }

      const addresses = await UserAddress.find({ 
        userId: userId,
        status: 'active'
      }).sort({ isDefault: -1, createdAt: -1 });

      res.status(200).json({
        status: "OK",
        message: "Addresses fetched successfully",
        details: addresses
      });
    } catch (error) {
      res.status(500).json({
        status: "NOK",
        error: error.message,
        details: error.message
      });
    }
  },

  async updateUserAddress(req, res) {
    try {
      const { addressId } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      const updateData = {
        ...req.body,
        updatedAt: getCurrentDateAndTime()
      };

      if (updateData.isDefault === true) {
        await UserAddress.updateMany(
          { userId: updateData.userId },
          { $set: { isDefault: false } }
        );
      }

      const updatedAddress = await UserAddress.findByIdAndUpdate(
        addressId,
        updateData,
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({
          status: "NOK",
          error: "Address not found"
        });
      }

      res.status(200).json({
        status: "OK",
        message: "Address updated successfully",
        details: updatedAddress
      });
    } catch (error) {
      res.status(500).json({
        status: "NOK",
        error: error.message,
        details: error.message
      });
    }
  },

  async deleteUserAddress(req, res) {
    try {
      const { addressId } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      // Soft delete by changing status to 'Inactive'
      const deletedAddress = await UserAddress.findByIdAndUpdate(
        addressId,
        { status: 'inactive', updatedAt: getCurrentDateAndTime() },
        { new: true }
      );

      if (!deletedAddress) {
        return res.status(404).json({
          status: "NOK",
          error: "Address not found"
        });
      }

      res.status(200).json({
        status: "OK",
        message: "Address deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "NOK",
        error: error.message,
        details: error.message
      });
    }
  },

  async setDefaultAddress(req, res) {
    try {
      const {  addressId } ={
        ...req.body,
        ...req.query,
        ...req.params,
      };
      let   userId = req.user._id
      
      // Set all addresses to non-default first
      await UserAddress.updateMany(
        { userId: userId },
        { $set: { isDefault: false } }
      );
      
      // Set the selected address as default
      const defaultAddress = await UserAddress.findByIdAndUpdate(
        addressId,
        { isDefault: true, updatedAt: getCurrentDateAndTime() },
        { new: true }
      );

      if (!defaultAddress) {
        return res.status(404).json({
          status: "NOK",
          error: "Address not found"
        });
      }

      res.status(200).json({
        status: "OK",
        message: "Default address set successfully",
        details: defaultAddress
      });
    } catch (error) {
      res.status(500).json({
        status: "NOK",
        error: error.message,
        details: error.message
      });
    }
  }
};





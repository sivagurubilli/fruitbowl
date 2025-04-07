
const { isNullOrUndefined } = require('util');
let functions = {}
functions.isRequestDataValid = (body) => {
    try {
      let params = body;
      if (typeof params !== 'object') {
        throw Error('not an object')
      }
  
      let invalidKeys = [];
      let invalidValues = [];
  
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          // Check if the value is a string (to avoid errors for non-string values)
          if (typeof params[key] === 'string') {
            params[key] = params[key].trim();
          }
        }
      }
  
      for (let [key, value] of Object.entries(params)) {
        if (isNullOrUndefined(params[key])) {
          invalidKeys.push(key)
        }
        else if (!value && typeof value !== 'number' && typeof value !== 'boolean') {
          invalidValues.push(key)
        }
      }
  
      if (invalidKeys.length) {
        return `${invalidKeys[0]} is a required field`
      } else if (invalidValues.length) {
        return `${invalidValues[0]} getting blank value`
      }
      else return true
    } catch (e) {
      throw e
    }
  }

   functions.formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  


  module.exports = functions;
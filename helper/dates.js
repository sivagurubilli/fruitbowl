const moment = require('moment');

exports.getCurrentDateAndTime = () => {
    const now = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const indianTime = new Date(now.getTime() + ISTOffset);
    return indianTime.toISOString();
}

exports.getCurrentDate = () => {
    const now = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const indianDate = new Date(now.getTime() + ISTOffset);
    return indianDate.toISOString().split('T')[0];
}

exports.getDateByMonth = (month_value) => {
    const inputDate = moment(exports.getCurrentDateAndTime());
    const newDate = inputDate.add(month_value, 'months');
    const formattedDate = newDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    return formattedDate;
}

exports.getCurrentDateAndTimebeforesometime = (timeinmins) => {
    const now = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000 - timeinmins * 60 * 1000; 
    const adjustedTime = new Date(now.getTime()+ISTOffset);
    return adjustedTime.toISOString(); 
  }
  

  
exports.getCurrentDateAndTimebyinputIst = (input) => {
    const now = new Date(input);
    const ISTOffset = 5.5 * 60 * 60 * 1000; 
    const adjustedTime = new Date(now.getTime()+ISTOffset); 
    return adjustedTime.toISOString(); 
  }


   exports.computeIsOpen =(timings) =>{
        if (!timings || timings.length === 0) return false;
        
        // Get current time in IST
        const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        
        const currentDay = nowIST.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
        const dayRange = (currentDay >= 1 && currentDay <= 5) ? "Monday - Friday" : "Saturday - Sunday";
        
        // Find the timing object for the relevant day range.
        const timingObj = timings.find(t => t.dayRange === dayRange);
        if (!timingObj) return false;
        
        // Updated parseTime to allow an optional space before am/pm.
        function parseTime(timeStr) {
          timeStr = timeStr.trim().toLowerCase();
          const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/);
          if (!match) return null;
          let hours = parseInt(match[1], 10);
          const minutes = parseInt(match[2], 10);
          const meridiem = match[3];
          if (meridiem === "pm" && hours < 12) hours += 12;
          if (meridiem === "am" && hours === 12) hours = 0;
          return { hours, minutes };
        }
        
        const openTime = parseTime(timingObj.openTime);
        const closeTime = parseTime(timingObj.closeTime);
        if (!openTime || !closeTime) return false;
        
        // Create Date objects for today's open and close times in IST.
        const openDate = new Date(
          nowIST.getFullYear(),
          nowIST.getMonth(),
          nowIST.getDate(),
          openTime.hours,
          openTime.minutes
        );
        const closeDate = new Date(
          nowIST.getFullYear(),
          nowIST.getMonth(),
          nowIST.getDate(),
          closeTime.hours,
          closeTime.minutes
        );
        
        // Return true if current IST time is between openDate and closeDate.
        return (nowIST >= openDate && nowIST <= closeDate);
      }
      
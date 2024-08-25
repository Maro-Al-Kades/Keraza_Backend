const mongoose = require("mongoose");

module.exports = async () => {
  try {
    // Set 'strictPopulate' to false before connecting
    mongoose.set('strictPopulate', false);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("02- ====== ✅ SUCCESSFULL CONNECT TO MONGODB ✅ ======");
  } catch (error) {
    console.log("02- ====== ❌ CONNECTION FAILED TO MONGODB ❌", error);
  }
};

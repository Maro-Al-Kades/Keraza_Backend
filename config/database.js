const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("02- ====== ✅ SUCCESSFULL CONNECT TO MONGODB ✅ ======");
  } catch (error) {
    console.log("02- ====== ❌ CONNECTION FAILED TO MONGODB ❌", error);
  }
};

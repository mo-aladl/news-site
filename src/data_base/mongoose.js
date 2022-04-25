const mongoose = require("mongoose");

// const newLocal = "mongodb://127.0.0.1:27017/News_data";
// mongoose.connect(newLocal);

mongoose.connect(process.env.MONGO_URL);


const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://adityabangwal12_db_user:BlogApp123456789@cluster0.na2libz.mongodb.net/myblogdatabases?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
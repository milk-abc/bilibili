const express = require("express");
const app = express();
app.set("secret", "abcdef");
app.use(require("cors")());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
require("./routes/admin")(app);
require("./plugins/db")(app);
app.listen(3000, () => {
  console.log("http://localhost:3000");
});

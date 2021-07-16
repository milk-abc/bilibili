const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String },
	icon: { type: String },//图片地址
  // parent: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
});
module.exports = mongoose.model("Item", schema);

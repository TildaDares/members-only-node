const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    default: "Normal",
    enum: ["Normal", "Elite"],
  },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    default: "Normal",
    enum: ["Normal", "Elite"],
  },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.virtual("fullname").get(function () {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);

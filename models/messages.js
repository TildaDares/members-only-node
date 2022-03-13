const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  content: { type: String, required: true },
  created_at: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("created_at_formatted").get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(
    DateTime.DATETIME_MED
  );
});
module.exports = mongoose.model("Message", MessageSchema);

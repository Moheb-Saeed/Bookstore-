const mongoose = require("mongoose");
/*
- **User**: 
  - `username` (unique)
  - `password` (hashed)
  - `role` ("user" | "admin"; default "user")
  - `name` (optional)
 */

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  favouriteBooks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  ],
  cart: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  ],
});


const User = mongoose.model("user", userSchema);

module.exports = User;

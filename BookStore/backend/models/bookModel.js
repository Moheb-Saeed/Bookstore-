const mongoose = require('mongoose');
/*
- **Book**: 
  - `title` (required),
  - `bookCoverImage` (required),
  - `description` (optional)
  - `genre` (optional)
  - `price` (number >= 0, requird)
  - `publishedYear` (number, optional)
  - `createdBy` (userId)
  - `createdAt`/`updatedAt`

*/

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
  bookCoverImage: {
    type: String,
    required: true,
  },
  description: String,
  genre: String,
  price: {
    type: Number,
    required: true,
    validate: [(val) => val > 0, 'Price should be positive']
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;

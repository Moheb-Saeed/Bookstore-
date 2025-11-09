const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./models/userModel");
const Book = require("./models/bookModel");
const { MONGODB_URL } = require("./configs/envConfigs");

const BOOKS_JSON = path.join(__dirname, "data", "books.json");

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

async function ensureAdmin() {
  await User.deleteMany({});
  let admin = await User.findOne({ role: "admin" });
  const hashedPassword = await bcrypt.hash("Admin@123", 10);
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("🛡️ Admin user created");
  } else {
    console.log("🛡️ Admin user already exists");
  }
  return admin;
}

// helper function to pick random items from array
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seedBooks() {
  try {
    const admin = await ensureAdmin();
    const books = JSON.parse(fs.readFileSync(BOOKS_JSON, "utf8"));
    await Book.deleteMany({});
    console.log("🗑️ Old books removed");

    const booksWithAdmin = books.map((book) => ({
      ...book,
      createdBy: admin._id,
    }));

    const insertedBooks = await Book.insertMany(booksWithAdmin);
    console.log(`📚 Inserted ${insertedBooks.length} books successfully`);

    // Add some random books to admin's cart and favourite
    const randomCartBooks = getRandomItems(insertedBooks, 20).map((b) => b._id);
    const randomFavouriteBooks = getRandomItems(insertedBooks, 20).map(
      (b) => b._id
    );

    admin.cart = randomCartBooks;
    admin.favouriteBooks = randomFavouriteBooks;
    await admin.save();

    console.log(`🛒 Added ${randomCartBooks.length} books to admin's cart`);
    console.log(
      `❤️ Added ${randomFavouriteBooks.length} books to admin's favourites`
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  }
}

(async () => {
  await connectDB();
  await seedBooks();
})();

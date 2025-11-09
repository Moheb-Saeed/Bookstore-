const express = require("express");
const userService = require("../services/userServices");
const checkIsAdmin = require("../middlewares/checkIsAdmin");
const requireAuthMiddleware = require("../middlewares/requireAuthMiddleware");
/*
## User Endpoints (Admins only)
- `GET /users` (list all users; admins only)
- `PATCH /users/:id/role` (update user role; admins only; body: `{ "role": "admin" }`)
- `DELETE /users/:id` (delete user; admins only)  
*/

const router = express.Router();

router.use(requireAuthMiddleware);

// get All users
router.get("/", checkIsAdmin, async (req, res) => {
  res.send(await userService.getAllUsers());
});

router.get("/me", async (req, res) => {
  res.send(req.currentUser);
});

// patch -- update user role
router.patch("/:id/role", checkIsAdmin, async (req, res) => {
  const id = req.params.id;
  const isFound = await userService.getUserById(id);
  isFound
    ? res.send(await userService.updateUser(id, req.body))
    : res.status(400).send({ messege: "Invalid request" });
});

// clear all cart items
router.delete('/cart', async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const updated = await userService.clearCart(userId);
    res.send(updated);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).send({ message: 'Failed to clear cart' });
  }
});

// delete
router.delete("/:id", checkIsAdmin, async (req, res) => {
  try {
    const deleteUser = await userService.deleteUser(req.params.id);
    res.send(deleteUser);
  } catch (error) {
    res.send({ message: "the user is not found" });
  }
});

// get user's cart
router.get("/cart", async (req, res) => {
  const userId = req.currentUser.id;
  const cart = await userService.getUserCart(userId);
  res.send(cart);
});

// add book to cart
router.post("/cart/:bookId", async (req, res) => {
  const userId = req.currentUser.id;
  const bookId = req.params.bookId;
  const updated = await userService.addToCart(userId, bookId);
  res.send(updated);
});

// remove book from cart
router.delete("/cart/:bookId", async (req, res) => {
  const userId = req.currentUser.id;
  const bookId = req.params.bookId;
  const updated = await userService.removeFromCart(userId, bookId);
  res.send(updated);
});


// get user's favourite books
router.get("/favourite", async (req, res) => {
  const userId = req.currentUser.id;
  const favourites = await userService.getUserFavourites(userId);
  res.send(favourites);
});

// add favourite
router.post("/favourite/:bookId", async (req, res) => {
  const userId = req.currentUser.id;
  const bookId = req.params.bookId;
  const updated = await userService.addFavourite(userId, bookId);
  res.send(updated);
});

// remove favourite
router.delete("/favourite/:bookId", async (req, res) => {
  const userId = req.currentUser.id;
  const bookId = req.params.bookId;
  const updated = await userService.removeFavourite(userId, bookId);
  res.send(updated);
});

module.exports = router;

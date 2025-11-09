const bookService = require("../services/bookServices");
const express = require("express");
const checkIsOwnerOrAdmin = require('../middlewares/checkIsOwnerOrAdmin');
const requireAuthMiddleware = require('../middlewares/requireAuthMiddleware');
const router = express.Router();

/*
- `POST /books` (auth)
- `GET /books` (public)
    - **Filters & Sorting**
    - `/books?q="any text"` → case-insensitive search by title or description
    - `/books?sort=price` → sort ascending by price
    - `/books?sort=-price` → sort descending by price
    - `/books?q="any text"&sort=price` → 0 sort and filter
- `GET /books/:id` (public)
- `PUT /books/:id` (owner or admin)
- `DELETE /books/:id` (owner or admin)
*/

router.post("/", requireAuthMiddleware, async (req, res) => {
    try {
        const createdBook = await bookService.createBook({
            ...req.body,
            createdBy: req.currentUser.id
        });
        res.status(201).send(createdBook);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

router.get("/", async (req, res) => {
    const query = req.query;
    console.log(query);
    let result;
    if (query.q) {
        result = query.sort ? await bookService.filterAndSort(query.q) : await bookService.filterByTitleOfDisc(query.q);
    } else if (query.sort) {
        console.log(query.sort)
        const number = query.sort.startsWith('-') ? -1 : 1;
        result = await bookService.sortByPrice(number);
    } else result = await bookService.getAllBooks();
    res.send(result);
})

router.get('/:id', async (req, res) => {
    const book = await bookService.getBookById(req.params.id);
    res.send(book);
})

router.put("/:id", requireAuthMiddleware, checkIsOwnerOrAdmin, async (req, res) => {
    const updates = req.body;
    try {
        const updatedBook = await bookService.updateBook(req.params.id, updates);
        res.send(updatedBook);
    } catch (error) {
        res.send({ message: "the book is not found" });
    }
})

router.delete('/:id', requireAuthMiddleware, checkIsOwnerOrAdmin, async (req, res) => {
    const deletedBook = await bookService.deleteBook(req.params.id);
    if (deletedBook === null) res.status(404).send({ message: "the book is not found" });
    res.send(deletedBook);
})

router.post("/:id/reviews", requireAuthMiddleware, async (req, res) => {
    try {
        const reviewData = {
            user: req.currentUser.id,
            comment: req.body.comment
        };

        const updatedBook = await bookService.addReview(req.params.id, reviewData);
        res.status(201).send(updatedBook);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;

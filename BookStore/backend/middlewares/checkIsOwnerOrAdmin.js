const Book = require('../models/bookModel');

const checkIsOwnerOrAdmin = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send({ message: "Book not found" });

        if (req.currentUser.role === 'admin' || book.createdBy.toString() === req.currentUser.id) {
            return next();
        }

        return res.status(403).send({ message: "Access denied" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = checkIsOwnerOrAdmin;

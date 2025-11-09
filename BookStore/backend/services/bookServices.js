const booksRepo = require('../repositories/dbBookRepository');


const createBook = async (body) => {
    return await booksRepo.createBook(body);
}

const getAllBooks = async () => {
    return await booksRepo.getAllBooks();
}

const filterByTitleOfDisc = async (text) => {
    return await booksRepo.filterByTitleOfDisc(text);
}

const sortByPrice = async (number) => {
    return await booksRepo.sortByPrice(number);
}

const filterAndSort = async (text) => {
    return await booksRepo.filterAndSort(text);
}

const getBookById = async (id) => {
    return await booksRepo.getBookById(id);
}

const updateBook = async (id, update) => {
    return await booksRepo.updateBook(id, update);
}

const deleteBook = async (id) => {
    return await booksRepo.deleteBook(id); // will return null if the document not found
}

const addReview = async (bookId, reviewData) => {
    return await booksRepo.addReview(bookId, reviewData);
}

module.exports = {
    createBook,
    getAllBooks,
    filterByTitleOfDisc,
    sortByPrice,
    filterAndSort,
    getBookById,
    updateBook,
    deleteBook,
    addReview
}
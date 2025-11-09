const UserModel = require('../models/userModel');

const getAll = async () => {
    return await UserModel.find();
}

const getById = async (userId) => {
    return await UserModel.findById(userId);
}

const getByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
}

const createUser = async (newUser) => {
    return await UserModel.create(newUser);
};

const updateUser = async (id, update) => {
    return UserModel.findOneAndUpdate({ _id: id }, { $set: { ...update } }, { new: true });
}

const deleteUser = async (id) => {
    return UserModel.findByIdAndDelete(id);
}

const getCart = async (userId) => {
    return await UserModel.findById(userId).populate('cart');
};

const addToCart = async (userId, bookId) => {
    return await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { cart: bookId } },
        { new: true }
    ).populate('cart');
};

const removeFromCart = async (userId, bookId) => {
    return await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { cart: bookId } },
        { new: true }
    ).populate('cart');
};

const getFavourites = async (userId) => {
    return await UserModel.findById(userId).populate('favouriteBooks');
};

const clearCart = async (userId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $set: { cart: [] } },
    { new: true }
  ).populate('cart');
};

const addFavourite = async (userId, bookId) => {
    return await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { favouriteBooks: bookId } },
        { new: true }
    ).populate('favouriteBooks');
};

const removeFavourite = async (userId, bookId) => {
    return await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { favouriteBooks: bookId } },
        { new: true }
    ).populate('favouriteBooks');
};


module.exports = {
    getAll,
    getById,
    createUser,
    getByEmail,
    updateUser,
    deleteUser,
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    getFavourites,
    addFavourite,
    removeFavourite
}
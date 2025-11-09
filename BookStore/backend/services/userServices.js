const repo = require("../repositories/dbUserRepository");

const createUser = async (newUser) => {
    const dbUser = await repo.createUser(newUser);
    return mapUser(dbUser);
}

const getAllUsers = async () => {
    return await repo.getAll();
}

const getUserById = async (userId) => {
    const dbUser = await repo.getById(userId);
    return mapUser(dbUser);
}
const getUserInfo = async (email) => {
    const dbUser = await repo.getByEmail(email);
    return mapUser(dbUser);
}
const updateUser = async (id, update) => {
    const dbUser = await repo.updateUser(id, update);
    return mapUser(dbUser);
}

const deleteUser = async (id) => {
    const deletedUser = await repo.deleteUser(id)
    return mapUser(deletedUser);
}

const getUserCart = async (userId) => {
    const dbUser = await repo.getCart(userId);
    return {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        cart: dbUser.cart
    };
};

const addToCart = async (userId, bookId) => {
    const dbUser = await repo.addToCart(userId, bookId);
    return mapUser(dbUser);
};

const removeFromCart = async (userId, bookId) => {
    const dbUser = await repo.removeFromCart(userId, bookId);
    return mapUser(dbUser);
};

const clearCart = async (userId) => {
    const dbUser = await repo.clearCart(userId);
    return mapUser(dbUser);
};

const getUserFavourites = async (userId) => {
    const dbUser = await repo.getFavourites(userId);
    return {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        favouriteBooks: dbUser.favouriteBooks
    };
};

const addFavourite = async (userId, bookId) => {
    const dbUser = await repo.addFavourite(userId, bookId);
    return mapUser(dbUser);
};

const removeFavourite = async (userId, bookId) => {
    const dbUser = await repo.removeFavourite(userId, bookId);
    return mapUser(dbUser);
};

const mapUser = (dbUser) => {
    return {
        id: dbUser._id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserInfo,
    getUserCart,
    addToCart,
    removeFromCart,
    clearCart,
    getUserFavourites,
    addFavourite,
    removeFavourite
}

const checkIsAdmin = function (req, res, next) {
    try {
        console.log(req.currentUser);
        if (req.currentUser.role === "admin") next();
        else res.status(403).send({ message: "Forbidden" });
    } catch (error) {
        res.status(403).send(error)
    }
}

module.exports = checkIsAdmin;
const isAdmin = (req, res, next) => {
    const user = req.user;

    if (user && user.role === "admin") {
        next();
    } else {
        res.code = 403;
        throw new Error("Access Denied, Admins Only.")
    }
}

export default isAdmin;
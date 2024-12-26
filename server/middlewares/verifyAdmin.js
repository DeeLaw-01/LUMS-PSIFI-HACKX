import Auth from "../models/Auth.js";

/**
 * Middleware to verify if the user is an admin.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const verifyAdmin = async (req, res, next) => {
    try {
        const id = req.userId;
        const user = await Auth.findById(id);
        if (!user.isAdmin && !user.isEmployee) {
            res.status(401).json({ message: "Action not permitted!" });
            return;
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};

export default verifyAdmin;

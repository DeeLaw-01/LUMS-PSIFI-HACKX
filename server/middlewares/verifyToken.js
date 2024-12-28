import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Middleware to verify JWT token and authenticate user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const isCustomAuth = token && token.length < 500

    let decodedData

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET)
      req.user = { 
        id: decodedData?.id,
        _id: decodedData?.id 
      }
    } else {
      decodedData = jwt.decode(token)
      req.user = { 
        id: decodedData?.sub,
        _id: decodedData?.sub
      }
    }

    next()
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default verifyToken

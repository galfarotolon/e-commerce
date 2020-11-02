import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            //sends user id, and removes password from getting sent 
            req.user = await User.findById(decodedToken.id).select('-password')

            next()

        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not Authorized, invalid token')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not Authorized without a token')
    }

})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized. Need admin validation')
    }
}

export { protect, admin }
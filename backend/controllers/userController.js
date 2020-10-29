import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'




// @desc Auth user and get token
// @route POST /api/users/login
// @access Public

const authUser = asyncHandler(async (req, res) => {
    //destructure from body
    const { email, password } = req.body

    const user = await User.findOne({ email })

    //check if the PW sent matches the user's PW
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: null
        })
    } else {
        res.status(401)
        throw new Error('Invalid Email or Password')
    }
})

export { authUser }
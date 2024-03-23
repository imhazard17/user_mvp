const router = require('express').Router()
const errForward = require('../utils/errorForward')
const upload = require('../middlewares/upload')
const { userInputValidation } = require('../middlewares/input_validation')
const prisma = require('../utils/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// POST /auth/signup (create new user)
router.post('/signup', [userInputValidation, upload.single('file')], errForward(async (req, res) => {
    // create new user with prisma and hash the given password
    const createdUser = await prisma.user.create({
        data: {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        },
        select: {
            id: true,
        }
    })

    if (!createdUser) {
        return res.status(500).json({
            err: 'Could not create user'
        })
    }

    // on success return signed auth token
    const authToken = jwt.sign(createdUser.id, process.env.JWT_SECRET)

    return res.status(201).json({
        msg: `Successfully created user with id ${createdUser.id}`,
        authToken: authToken
    })
}))

// GET /auth/login
router.get('/login', [userInputValidation], errForward(async (req, res) => {
    // bcrypt compare the given pass with stored hashed pass
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        },
        select: {
            id: true,
            password: true,
        }
    })

    if (!user) {
        return res.status(500).json({
            err: 'Could not login user'
        })
    }

    if (bcrypt.compareSync(req.body.password, user.password) === false) {
        return res.status(404).json({
            err: 'Incorrect password',
        })
    }

    // on success return signed auth token
    const authToken = jwt.sign(user.id, process.env.JWT_SECRET)

    return res.status(200).json({
        msg: `Successfully logged in user with id ${user.id}`,
        authToken: authToken
    })
}))

module.exports = router

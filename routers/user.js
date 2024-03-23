const router = require('express').Router()
const errForward = require('../utils/errorForward')
const upload = require('../middlewares/upload')
const { userInputValidation } = require('../middlewares/input_validation')
const authentication = require('../middlewares/authentication')
const bcrypt = require('bcrypt')
const prisma = require('../utils/db')
const fs = require("node:fs/promises")

// GET /user/my-details (get currently logged in user)
router.post('/my-details', [authentication], errForward(async (req, res) => {
    const userId = req.locals.userId;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    })

    if(!user) {
        res.status(500).json({
            err: 'Could not fetch user details'
        })
        return
    }

    delete user.password

    res.status(200).json(user)
}))

// GET /user/all (get all users)
router.post('/all', errForward(async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            username: true,
            firstName: true,
            lastName: true,
            doj: true,
            dpUrl: true,
        }
    })

    if(!users) {
        res.status(500).json({
            err: 'Could not fetch users details'
        })
        return
    }

    res.status(200).json(users)
}))

// GET /user/search/:username
router.post('/search/:username', errForward(async (req, res) => {
    const user = await prisma.user.findMany({
        where: {
            username: req.params.username,
        },
        select: {
            username: true,
            firstName: true,
            lastName: true,
            doj: true,
            dpUrl: true,
        }
    })

    if(!user) {
        res.status(500).json({
            err: 'Could not fetch user details'
        })
        return
    }

    res.status(200).json(user)
})) 

// PUT /user/update-details
router.post('/update-details', [userInputValidation, authentication, upload.single('file')], errForward(async (req, res) => {
    const userId = req.locals.userId

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dpUrl: req.file?.path
        },
    })

    if(!updatedUser) {
        res.status(500).json({
            err: 'Could not update user details'
        })
        return
    }

    delete updatedUser.password

    res.status(200).json({
        msg: `Successfully updated user with id: ${updatedUser.id}`,
        user: updatedUser
    })
}))

// DELETE /user/delete-profile
router.post('/delete-profile', [authentication], errForward(async (req, res) => {
    const userId = req.locals.userId

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            dpUrl: true
        }
    })

    const deletedUser = await prisma.user.delete({
        where: {
            id: userId,
        }
    })

    if(!deletedUser) {
        res.status(500).json({
            err: 'Could not delete user'
        })
        return
    }

    // unlink all the related files
    fs.unlink(user.dpUrl)

    delete deletedUser.password

    res.status(200).json({
        msg: `Successfully deleted user with id: ${deletedUser.id}`,
        user: deletedUser
    })
}))

module.exports = router

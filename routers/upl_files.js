const router = require('express').Router()
const upload = require('../middlewares/upload')
const errForward = require('../utils/errorForward')
const { userInputValidation } = require('../middlewares/input_validation')
const authentication = require('../middlewares/authentication')

// PUT /upl/upload
router.put('/upload', [userInputValidation, authentication, upload.single('file')], errForward(async (req, res) => {
    if (!req.file) {
        return res.status(404).json({ err: 'File not uploaded' })
    }

    return res.status(200).json({ file: req.file })
}))

// PUT /upl/upload-many
router.put('/upload-many', [upload.array('file', 10)], errForward(async (req, res) => {
    if (!req.files) {
        return res.status(404).json({ err: 'Files not uploaded' })
    }

    return res.status(200).json({ files: req.files })
}))

module.exports = router

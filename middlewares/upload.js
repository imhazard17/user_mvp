const multer = require('multer')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.url === '/user/update-details' || req.url === '/auth/signup') {
            cb(null, './uploads/profilePics/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomBytes(15).toString('hex') + '.jpg')
    }
})

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Wrong filetype uploaded'))
        }
    }
})

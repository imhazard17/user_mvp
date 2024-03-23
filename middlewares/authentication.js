const jwt = require('jsonwebtoken')

function authentication(req, res, next) {
    // verify the token

    if(!req.headers.authorization) {
        res.status(411).json({
            err: 'Could not find auth token'
        })
    }

    const authToken = req.headers.authorization.split(' ')[1]

    try {
        const jwtVerifyRes = jwt.verify(authToken, process.env.JWT_SECRET)
        req.locals = {}
        req.locals.userId = parseInt(jwtVerifyRes)
    } catch(e) {
        res.status(403).json({
            err: 'Could not authenticate user'
        })
        return
    }

    res.status(200).json({
        msg: 'Successfully authenticated'
    })
}

module.exports = authentication

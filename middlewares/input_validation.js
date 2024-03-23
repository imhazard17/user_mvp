const z = require('zod')

function userInputValidation(req, res, next) {
    // const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$";

    const schema = z.object({
        username: z.string().min(5).max(30),
        password: z.string().min(8).max(40),  // =VISIT=  Implement regex for password validation
        firstName: z.string().max(30).optional(),
        lastName: z.string().max(30).optional(),
    })

    try {
        schema.parse(req.body)
    } catch(e) {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    } finally {
        next()
    }
}

module.exports = {
    userInputValidation
}

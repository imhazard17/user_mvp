const z = require('zod')

const userSchema = z.object({
    username: z.string().min(5).max(30),
    password: z.string().min(8).max(40),  // =VISIT=  Implement regex for password validation
    firstName: z.string().max(30).optional(),
    lastName: z.string().max(30).optional(),
})

module.exports = {
    userSchema
}

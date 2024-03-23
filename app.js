const express = require('express')
const dotenv = require('dotenv')
const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const uplRouter = require('./routers/upl_files')
const error = require('./middlewares/error')

dotenv.config({ path: './.env' })

const app = express()

app.use(express.json())
app.use('/user', userRouter)
app.use('/upl', uplRouter)
app.use('/auth', authRouter)
app.use('*', (req, res) => {
    return res.status(404).json({
        err: 'No such page found'
    })
})
app.use(error)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on port: ${process.env.SERVER_PORT}`)
})

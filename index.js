const express = require('express')
const mainRouter = require('./src/routes/index')
const { PORT } = require('./src/configs/configs')
const dbConnect = require('./src/configs/dbConnect')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { success } = require('./src/utils/responseWrapper')


const app = express()

app.use(express.json())

app.use(express.json())
app.use(morgan('common'))
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
		origin: 'http://localhost:3000',
    })
)

app.use("/", mainRouter)

app.get('/', (req, res)=>{
    res.json(success(200, 'working at full capacity'))
    })

app.listen(PORT, ()=>{
    console.log(`listening on PORT: ${PORT}`);
})

dbConnect()
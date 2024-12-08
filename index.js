const express = require('express')
const mainRouter = require('./src/routes/index')
const { PORT } = require('./src/configs/configs')


const app = express()

app.use(express.json())

app.use("/", mainRouter)

app.get('/', (req, res)=>{
    res.status(200).json({
        serverStatus: "working at full capacity"
    })
})

app.listen(PORT, ()=>{
    console.log(`listening on PORT: ${PORT}`);
})
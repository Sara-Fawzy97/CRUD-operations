// const mongodb = require('mongodb')
// const mongodbClient = mongodb.mongoClient;

// const url = 'mongodb: //127.0.0.1:27017/'

// const dbName = "task-manger"

// mongodbClient.connect(url, (error, client) => {
//     if (error) {
//         return console.log("error")
//     }
//     console.log("success")
//     const db = client.db(dbName)

//     db.collection('Users').insertOne({
//         name: "Sarah",
//         age: 24
//     }), (error, data) => {
//         if (error)
//             return console.log('error')
//     }
// })

const express = require('express')
require('dotenv').config()
const taskRouter = require('./routers/tasks')
const userRouter = require('./routers/user')

require('./db/mongoose')

const app = express()
app.use(express.json())
const port = process.env.PORT


app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
    console.log(`App listening at ${port}`)
})
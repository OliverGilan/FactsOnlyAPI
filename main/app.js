//Initialize dependencies
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const auth = require('../routes/authentication')

//Use dependencies
app.use(cors())
app.use(bodyParser.json())

//Initialize port
const port = process.env.PORT || 2400

//Get routes
var indexRouter = require('../routes/index')

//Set up middleware
// app.use(auth.requireJsonContent)
app.use('/', indexRouter)

//Create server
app.listen(port, () => console.log("Server started on port " + port + "!"))
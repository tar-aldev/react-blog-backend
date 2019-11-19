const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const initMongoose = require('./init/mongoose')
const PATH_TO_FRONTEND_STATIC = path.join(__dirname, '../articles-app/build')

app.use(cors())
app.use(morgan('dev'))

app.use(express.static(PATH_TO_FRONTEND_STATIC))
app.use(bodyParser.json())
/* API ROUTES */
app.use('/api', require('./modules/api.routes'))

app.use('**', (req, res) => {
  res.sendFile('index.html', { root: PATH_TO_FRONTEND_STATIC })
})
const PORT = process.env.PORT || 8000

initMongoose()
app.listen(PORT, () => {
  console.log(`Successfully started server on port http://localhost:${PORT}`)
})

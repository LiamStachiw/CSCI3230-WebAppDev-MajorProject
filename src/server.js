/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// define the database type and location
const database = new Sequelize({
  dialect: 'sqlite',
  storage: './highscores.db'
})

// create a model for the database
const Scores = database.define('highscores', {
  name: Sequelize.STRING,
  score: Sequelize.INTEGER
})

// initalize the REST endpoint
finale.initialize({
  app: app,
  sequelize: database
})

// create the REST resource for the model created earlier
const userResource = finale.resource({
  model: Scores,
  endpoints: ['/highscores', '/highscores/:id']
})

// reset the database and launch the app on port 8081
database.sync({ force: true }).then(() => {
  app.listen(8081, () => {
    console.log('listening to port localhost:8081')
  })
})

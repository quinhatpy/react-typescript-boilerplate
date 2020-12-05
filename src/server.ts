const express = require('express')
const path = require('path')

const app = express()
require('dotenv').config()

app.use(express.static(path.join(process.cwd(), 'build')))

app.get('*', function (req, res) {
  res.sendFile(path.join(process.cwd(), 'build', 'index.html'))
})

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App running on port: ' + process.env.PORT)
})

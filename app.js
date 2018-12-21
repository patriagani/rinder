const express = require('express')
const app = express()
const session = require('express-session')
const routes = require('./routes')
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(session({
  secret: 'patriarama',
}))
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))
app.use('/', routes)

app.listen(port, function() {
  console.log(`App listening on port ${port}`);
})
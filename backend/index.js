const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const api = require('./routes/api.routes')
const path = require('path')

dotenv.config();
const port = process.env.PORT
const databaseConnect = require('./db/config')
databaseConnect()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/', api)
app.listen(port, () => {
    console.log(`Servidor conectado al puerto ${port}`)
})
// app.use('/', express.static(__dirname + '/dist/frontend/browser'));
// app.get('/*', (req, res, next) => {
//     res.sendFile(path.resolve(__dirname + "/dist/frontend/browser/index.html"));
// });


module.exports = app
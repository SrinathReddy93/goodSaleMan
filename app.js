const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes');
const db = require('./db');

app.use(express.json())
db();
routes(app);
app.listen(PORT,()=> {
    console.log(`server started on ${PORT}`);
})
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const ENV = process.env;
const PORT = ENV.port || 3500;
const app = express();
app.use(cors());

const cartRoutes = require('./routes/cart-routes')

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Ecom API server")
})
app.use('/cart', cartRoutes);

app.use(function(err, req, res, next) {
    const errMsg = err?.message || "Internal Server Error";
    res.status(500).send(errMsg)
})

app.listen(PORT, () => {
    console.log(`Server listening to ${PORT}`)
})
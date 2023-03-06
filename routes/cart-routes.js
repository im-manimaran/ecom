const express = require('express');
const router = express.Router();
const ProductService = require('../service/product-service');
const ShippingService = require('../service/shipping-service');
const { getCart, updateCart, clearCart } = require("../data-utils")



router.post('/item', async function (req, res, next) {
    try {
        const { body } = req;
        if (!body.productId || !body.quantity) {
            res.status(400).send("missing required body");
        }
        const cart = await updateCart(body);
        res.status(200).send(cart)
    } catch (err) {
        next(err);
    }
});

router.get('/items', async function (req, res, next) {
    const cart = getCart();
    res.status(200).send(cart);
});

router.get('/checkout-value', async function (req, res, next) {
    try {
        const cartItems = getCart();
        if(!cartItems.length) {
            throw new Error("Cart is empty!")
        }
        const { shipping_postal_code } = req.headers;
        if (!shipping_postal_code) {
            res.status(400).send("shipping postal code is required")
        }
        const distanceInKms = await ShippingService.getDistanceOfWarehouse(shipping_postal_code);
        for (const item of cartItems) {
            const product = await ProductService.getProduct(item.productId);
            item.totalWeight = (item.quantity * product.weight_in_grams) / 1000;
            item.totalPrice = (item.quantity * (product.price - (product.price * product.discount_percentage/100)))
        }
        const cartWeight = cartItems.reduce((acc, item) => acc + item.totalWeight, 0);
        const totalWithoutSP = cartItems.reduce((acc, item) => acc + item.totalPrice, 0)
        const shippingCost = ShippingService.getShippingCost(cartWeight, distanceInKms)
        const totalPrice = +(totalWithoutSP + shippingCost).toFixed(2);
        res.status(200).send({cartTotal: totalPrice});
    } catch (err) {
        console.log(err.message)
        next(err)
    }

});

router.delete('/', function (req, res, next) {
    clearCart()
    res.sendStatus(204);
});

module.exports = router;
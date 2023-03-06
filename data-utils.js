const ProductService = require('./service/product-service');

var cart = [
];


const updateCart = async(item) => {
    const product = await ProductService.getProduct(item.productId);
    var itemIdx = cart.findIndex(each => each.productId === item.productId);
    if (itemIdx > -1) {
        cart[itemIdx].quantity += item.quantity;
    } else {
        cart = [...cart, item];
    }
    return cart;
}

const getCart = () => cart

const clearCart = () => cart = []

module.exports = { updateCart, getCart, clearCart }
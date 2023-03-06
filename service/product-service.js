const RESOURCE_API = process.env.RESOURCE_API;
const axios = require("axios");

class ProductService {

    static async getProduct(id) {
        if (!id) {
            throw new Error("Id required to get product")
        }
        const endPoint = `${RESOURCE_API}/product/${id}`
        const res = await axios.get(endPoint);
        if (res.data.status != 200)
            throw new Error("Not able to find the product");
        return res.data.response;
    }
}

module.exports = ProductService;
const RESOURCE_API = process.env.RESOURCE_API;
const axios = require("axios");

const costByWeightOrder = [
    { 'lt5': 12, '5t20': 15, '20t50': 20, '50t500': 50, '500t800': 100, 'gt800': 220 },
    { 'lt5': 14, '5t20': 18, '20t50': 24, '50t500': 55, '500t800': 110, 'gt800': 250 },
    { 'lt5': 16, '5t20': 25, '20t50': 30, '50t500': 80, '500t800': 130, 'gt800': 270 },
    { 'lt5': 21, '5t20': 35, '20t50': 50, '50t500': 90, '500t800': 150, 'gt800': 300 }];

const getCostByKm = (costMapByKm, kms) => {
    if(kms < 5) {
        return costMapByKm['lt5']
    } else if (20 >= kms && kms >= 5) {
        return costMapByKm['5t20']
    } else if(50 >= kms && kms > 20) {
        return costMapByKm['20t50']
    } else if(500 >= kms && kms > 50) {
        return costMapByKm['50t500']
    } else if(800 >= kms && kms > 500) {
        return costMapByKm['500t800']
    } else if(kms > 800) {
        return costMapByKm['gt800'];
    }
}

class ShippingService {

    static async getDistanceOfWarehouse(postalCode) {
        if (!postalCode) {
            throw new Error("Postal code is required to get distance from warehouse")
        }
        const endPoint = `${RESOURCE_API}/warehouse/distance`
        const res = await axios.get(endPoint, { params: { postal_code: postalCode } });
        if (res.data.status != 200)
            throw new Error("Cannot be delivered to the location");
        return res.data.distance_in_kilometers;
    }

    static getShippingCost(weight, kms) {
        if (weight <= 2) {
            return getCostByKm(costByWeightOrder[0], kms);
        } else if(5 >= weight && weight >= 2.01) {
            return getCostByKm(costByWeightOrder[1], kms);
        } else if(20 >= weight && weight >= 5.01) {
            return getCostByKm(costByWeightOrder[2], kms);
        } else if(weight >= 20.1) {
            return getCostByKm(costByWeightOrder[3], kms);
        }
    }

}

module.exports = ShippingService;

const payment_map = [
    { id: 1, name: "visa" },
    { id: 2, name: "mastercard" },
    { id: 3, name: "maestro" },
    { id: 4, name: "cirrus" },
    { id: 5, name: "paypal" },
    { id: 6, name: "western-union" },
    { id: 7, name: "visa-electron" },
    { id: 8, name: "amazon" },
    { id: 9, name: "worldpay" },
    { id: 10, name: "diners" },
    { id: 11, name: "googlepay" },
    { id: 12, name: "skrill" },
    { id: 13, name: "sage" },
    { id: 14, name: "discover" },
    { id: 15, name: "skirll-money" },
    { id: 16, name: "jcb" },
    { id: 17, name: "eway" },
    { id: 18, name: "card18" },
    { id: 19, name: "card19" },
    { id: 20, name: "card20" },
    { id: 21, name: "card21" },
    { id: 22, name: "amex" },
    { id: 23, name: "shopify" },
    { id: 24, name: "card24" }
]

var payment_brand = {
    getBrandByName: function(brand_name) {
        var result = payment_map.find(brand => brand.name === brand_name )
        return result
    }
}

module.exports = payment_brand
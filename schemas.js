const Joi = require('joi')
module.exports.stockSchema = Joi.object({
    stock: Joi.object({
        title: Joi.string().required(),
        valuation: Joi.number().required().min(0),
        price: Joi.number().required().min(0),
        totalStocks: Joi.number().required().min(0),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})

module.exports.buyOrderSchema = Joi.object({
    buyOrder: Joi.object({
        quantity: Joi.number().required(),
        price: Joi.number().required()
    }).required()
})
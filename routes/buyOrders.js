const express = require('express');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const BuyOrder = require('../models/buyOrder')
const Stock = require('../models/stock')
const { buyOrderSchema } = require('../schemas')
const router = express.Router({ mergeParams: true });
// imp line merge params =true


// the buy order validation function
const validateBuyOrder = (req, res, next) => {
    const { error } = buyOrderSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}


// the buy order placing route
router.post('/', validateBuyOrder, catchAsync(async (req, res) => {
    const stock = await Stock.findById(req.params.id)
    const buyOrder = new BuyOrder(req.body.buyOrder)
    const buyQuantity = parseInt(req.body.buyOrder.quantity);
    const initialQuantity = stock.totalStocks
    const newQuantity = initialQuantity - buyQuantity;
    await Stock.updateOne({ _id: req.params.id }, { totalStocks: newQuantity }, { new: true })
    stock.buyOrders.push(buyOrder)
    await stock.save();
    await buyOrder.save();
    res.redirect(`/stocks/${stock._id}`)
}))


module.exports = router;
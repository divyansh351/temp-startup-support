const express = require('express');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const BuyOrder = require('../models/buyOrder')
const Stock = require('../models/stock')
const User = require('../models/user')
const router = express.Router({ mergeParams: true });
const { validateBuyOrder, isLoggedIn } = require('../middleware')
// imp line merge params =true


// the buy order placing route
router.post('/', isLoggedIn, validateBuyOrder, catchAsync(async (req, res) => {
    const stock = await Stock.findById(req.params.id)
    const buyOrder = new BuyOrder(req.body.buyOrder)
    const buyQuantity = parseInt(req.body.buyOrder.quantity);
    const initialQuantity = stock.totalStocks
    const newQuantity = initialQuantity - buyQuantity;
    buyOrder.buyer = req.user._id
    const user = await User.findById(req.user._id)
    user.buyOrders.push(buyOrder)
    user.stocks.push(req.params.id)
    await Stock.updateOne({ _id: req.params.id }, { totalStocks: newQuantity }, { new: true })
    stock.buyOrders.push(buyOrder)
    await user.save();
    await stock.save();
    await buyOrder.save();
    res.redirect(`/stocks/${stock._id}`)
}))


module.exports = router;
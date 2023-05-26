const express = require('express');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Stock = require('../models/stock')
const { stockSchema } = require('../schemas')

const router = express.Router();

// the stock validation finction, required when listing new stock
const validateStock = (req, res, next) => {
    const { error } = stockSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}

// the stock show route
router.get('/', catchAsync(async (req, res) => {
    const stocks = await Stock.find({})
    res.render('./stocks/index', { stocks })
}))


// new stock form route
router.get('/new', (req, res) => {
    res.render('./stocks/new')
})


// new stock form submission
router.post('/', validateStock, catchAsync(async (req, res) => {
    // if (!req.body.stock) throw new ExpressError('Invalid Stock Data', 400);
    const title = req.body.stock.title;
    const valuation = parseInt(req.body.stock.valuation);
    const price = parseInt(req.body.stock.price);
    const totalStocks = parseInt(req.body.stock.totalStocks);
    const description = req.body.stock.description;
    const image = req.body.stock.image;
    const stock = new Stock({
        title: title,
        price: price,
        valuation: valuation,
        totalStocks: totalStocks,
        description: description,
        image: image
    })
    await stock.save();
    req.flash('success', 'Successfully registered new stock!')
    res.redirect(`/stocks/${stock._id}`)
}))


// the stock show page
router.get('/:id', catchAsync(async (req, res) => {
    const stock = await Stock.findById(req.params.id).populate('reviews');
    if (!stock) {
        req.flash('error', 'Cannot find that stock')
        return res.redirect('/stocks')
    }
    res.render('./stocks/show', { stock })
}))

// the stock edit form
router.get('/:id/edit', catchAsync(async (req, res) => {
    const stock = await Stock.findById(req.params.id)
    if (!stock) {
        req.flash('error', 'Cannot find that stock to edit')
        return res.redirect('/stocks')
    }
    res.render('./stocks/edit', { stock })
}))


// the stock edit patch route
router.patch('/:id', validateStock, catchAsync(async (req, res) => {
    const { id } = req.params;
    const title = req.body.stock.title;
    const valuation = parseInt(req.body.stock.valuation);
    const price = parseInt(req.body.stock.price);
    const totalStocks = parseInt(req.body.stock.totalStocks);
    const description = req.body.stock.description;
    const image = req.body.stock.image;
    const stock = await Stock.findOneAndUpdate({ _id: id }, {
        title: title,
        price: price,
        valuation: valuation,
        totalStocks: totalStocks,
        description: description,
        image: image
    }, { new: true })
    req.flash('success', 'Successfully edited this stock!')
    res.redirect(`/stocks/${stock._id}`)
}))


// the stock delete route
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Stock.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted')
    res.redirect('/stocks');
}))


module.exports = router
const { stockSchema, reviewSchema, buyOrderSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Stock = require('./models/stock')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// the stock validation finction, required when listing new stock
module.exports.validateStock = (req, res, next) => {
    const { error } = stockSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const stock = await Stock.findById(id)
    ///
    if (!stock.owner.equals(req.user._id)) {
        req.flash('error', 'Permission Denied')
        return res.redirect(`/stocks/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}

// the buy order validation function
module.exports.validateBuyOrder = (req, res, next) => {
    const { error } = buyOrderSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}



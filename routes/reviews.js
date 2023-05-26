const express = require('express');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const Stock = require('../models/stock')
const { reviewSchema } = require('../schemas')
const router = express.Router({ mergeParams: true });
// imp line merge params =true id is not available here by default
// so it needs to be fetched from the index.js, this line helps 
// fetch that

// the review validator
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}


// review posting route
router.post('/', validateReview, catchAsync(async (req, res) => {
    const stock = await Stock.findById(req.params.id)
    const review = new Review(req.body.review)
    stock.reviews.push(review)
    await review.save();
    await stock.save();
    req.flash('success', 'Successfully added review')
    res.redirect(`/stocks/${stock._id}`)
}))


// review deleting route
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Stock.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/stocks/${id}`)
}))

module.exports = router;
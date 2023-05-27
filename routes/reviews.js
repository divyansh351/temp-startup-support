const express = require('express');
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Stock = require('../models/stock')
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn } = require('../middleware')
// imp line merge params =true id is not available here by default
// so it needs to be fetched from the index.js, this line helps 
// fetch that


// review posting route
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const stock = await Stock.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
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
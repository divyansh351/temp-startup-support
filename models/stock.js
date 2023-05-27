const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const User = require('./user')

const StockSchema = new Schema({
    title: String,
    price: Number,
    valuation: Number,
    totalStocks: Number,
    description: String,
    image: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    buyOrders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BuyOrder'
        }
    ]
});


StockSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Stock', StockSchema);
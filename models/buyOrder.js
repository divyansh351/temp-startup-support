const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyOrderSchema = new Schema({
    quantity: Number,
    price: Number,
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('BuyOrder', buyOrderSchema);
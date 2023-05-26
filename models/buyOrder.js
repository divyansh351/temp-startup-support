const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyOrderSchema = new Schema({
    quantity: Number,
    price: Number
})

module.exports = mongoose.model('BuyOrder', buyOrderSchema);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const stocks = require('./stocks_dataset_seed')
const Stock = require('../models/stock')

mongoose.connect('mongodb://127.0.0.1:27017/startup-support')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connection open!!!!")
})


const seedDB = async () => {
    await Stock.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const c = new Stock(stocks[i]);
        c.save();
    }
}

seedDB();
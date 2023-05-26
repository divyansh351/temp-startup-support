// importing modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')

// router settings
const stocks = require('./routes/stocks');
const reviews = require('./routes/reviews');
const buyOrders = require('./routes/buyOrders');

// connecting database
mongoose.connect('mongodb://127.0.0.1:27017/startup-support')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connection open!!!!")
})

//
const app = express();

// session 
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        express: Date.now() + 1000 * 60 * 60 * 7 * 24,
        maxAge: 1000 * 60 * 60 * 7 * 24
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use('/stocks', stocks)
app.use('/stocks/:id/reviews', reviews)
app.use('/stocks/:id/buyOrders', buyOrders)
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)

//validation stuff moved to respective routes
//////////////////////////////////////////////////////////////
// validateStock
//////////////////////////////////////////////////////////////
// validate review
//////////////////////////////////////////////////////////////
// vaildate buy order


// the home route
app.get('/', (req, res) => {
    res.render('home');
})

// router stuff moved to specific routes
/////////////////////////////////////////////////////////////////////////////////
// stocks.js
/////////////////////////////////////////////////////////////////////////////////
// reviews.js
/////////////////////////////////////////////////////////////////////////////////
// buyOrders.js

// the all hit route, if nothing atches this hits
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

// the all error route
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err })
})

// app start function
app.listen(3000, () => {
    console.log("Serving on port 3000")
})
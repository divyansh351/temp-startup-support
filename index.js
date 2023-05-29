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
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const MongoStore = require('connect-mongo');


// router settings
const stockRoutes = require('./routes/stocks');
const reviewRoutes = require('./routes/reviews');
const buyOrderRoutes = require('./routes/buyOrders');
const userRoutes = require('./routes/users');


//
const app = express();
// const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;
// 
// 'mongodb://127.0.0.1:27017/startup-support'
// connecting database
mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connection open!!!!")
})

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisissecret'
    }
});

// session 
const sessionConfig = {
    store,
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


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    try {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    }
    catch (e) {
        next(e);
    }
})

//
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))


app.use('/', userRoutes)
app.use('/stocks', stockRoutes)
app.use('/stocks/:id/reviews', reviewRoutes)
app.use('/stocks/:id/buyOrders', buyOrderRoutes)


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
    res.render('home', { currentUser: res.locals.user });
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

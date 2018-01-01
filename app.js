const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Load Models globally
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

// Load keys
const keys = require('./config/keys');

// Map Global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect(keys.mongoURI, { useMongoClient: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();

app.use(cookieParser());
app.use(session({
    secret: 'HuYaTu-SeCrEt',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('It works');
});

app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
const express = require("express");
const app = express();
const cors = require('cors');
require('./db');
const bcrypt = require("bcrypt")
const axios = require('axios')
const session = require('express-session');
const dotenv = require("dotenv")
dotenv.config();
require('express-async-errors');

const User = require('./models/user.js')
app.use('/', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10800000 
    }
}));


function handleErr(err, req, res, next){
    if (err.name == 'MongoServerError'){
        return res.json({errMsg: 'This email is already registered to another user'})
    }
    console.log(err)
    return res.json({errMsg: String(err)})
}

function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

function isLoggedOut(req, res, next) {
    if (!req.session.isLoggedIn) {
        return next();
    } else {
        return res.redirect('/');
    }
}

/**
 * 
 * This function stops the browsers from storing protected pages on cache
 * -User cannot backspace to previous page if page is protected(Eg. not logged in).
 */
function setHeaders(req, res, next) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    return next();
}

app.get('/', isLoggedIn, setHeaders, (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
})

app.get('/account', isLoggedIn, setHeaders, (req, res) => {
    res.sendFile(__dirname + '/html/account.html')
})

app.get('/login', isLoggedOut, (req, res) => {
    res.sendFile(__dirname + '/html/login.html')
})

app.get('/register', isLoggedOut, (req, res) => {
    res.sendFile(__dirname + '/html/register.html')
})

app.get('/logout', (req, res) =>{
    req.session.destroy();
    return res.redirect('/login')
} )

app.post('/predict', async (req, res) => {
    text = ""
    formattedText = ""
    for (const property in req.body) {
        text += req.body[property] + " "
        formattedText += property + ": " + req.body[property] + "&#13;&#10;&#13;&#10;"
      }
    response = await axios.post('http://jobdetective.pythonanywhere.com/predict', {text: text})
    const {preds, probas} = response.data

    if (preds[0] == 0){
        fake = false; index = 0;
        index = 0
    } 
    else {
       fake = true
       index = 1
    } 
    
    prediction = {
        fake: fake, 
        proba: Math.round(probas[0][index] * 100),
        text: formattedText
    }
    await User.updateOne({email: req.session.user.email}, {$push: {predictions: prediction}})
    res.json({fake: fake, proba: Math.round(probas[0][index] * 100)})

})

app.post('/register', isLoggedOut, async (req, res) => {
    const {name, email, password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userWithHashedPassword = { name:name, email:email, password: hashedPassword }
    const user = await User.create(userWithHashedPassword)
    req.session.user = user;
    req.session.isLoggedIn = true;
    return res.json({redirect: '/'})
})

app.post('/login', isLoggedOut, async (req, res) => {
    const {email, password} = req.body
    let user = await User.findOne({email:email})
    if (!user)
        return res.json({errMsg: 'Wrong email or password'}) 
    comp = await bcrypt.compare(password, user.password)
    if (!comp)
        return res.json({errMsg: 'Wrong email or password'})
    req.session.user = user;
    req.session.isLoggedIn = true;
    return res.json({redirect: '/'})
})

app.get('/sessionInfo', isLoggedIn, async (req, res) => {
    user = await User.findOne({email: req.session.user.email})
    const {name, email, predictions} = user
    res.json({name: name, email: email, predictions:predictions})
})

app.get('*', (req, res) => {
  res.send('<h1>404 NOT FOUND</h1>')
})

app.use(handleErr)

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
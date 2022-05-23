const express = require ('express')
const app = express();
const flash = require('express-flash')
PORT = process.env.PORT || 5000
const {router} = require("./routes/guestRoute");
const {userRouter} = require("./routes/userRoute");
const session = require("express-session");
const passport = require("passport")
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
const initializePassport = require("./passportConfig");
initializePassport(passport);

app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));

  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false
    })
  )


  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash())
  app.use(express.json());
  app.use(cookieParser())

  app.use(router)
  app.use(userRouter)


  app.listen(PORT, () => {
    console.log(`app is running on port ==> ${PORT}`)
  })

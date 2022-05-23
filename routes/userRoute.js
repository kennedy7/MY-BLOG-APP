const express = require("express");
const userRouter = express.Router();
const {signupUser, GetArticles} = require ('../controllers/userController')
const passport = require ('passport');
const { pool } = require("../dbConfig");



userRouter.get('/login', (req, res) => {
    res.render('login.ejs');
  });
userRouter.get('/signup', (req, res) => {
    res.render('register.ejs');
  });
userRouter.post('/signup', signupUser);

userRouter.post("/login", 
    passport.authenticate("local", {
      successRedirect: "/users/list",
      failureRedirect: "/login",
      failureFlash: true,
    }),
  );
userRouter.get("/users/list", checkAuthenticated, (req, res) => {
    pool.query(
        `SELECT * from articles`,
        (err, results) => {
            res.render("userslist", {
                user: req.user.name,
                articles: results.rows
            });
        } 
    )
});


userRouter.get('/users/article/:id', GetArticles)

userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/list');
    });
  });
  function checkAuthenticated(req, res, next) {
    if (req.user) {
      next();
    }
   else{
    req.flash('success_msg', 'You need to be authenticated to access this page');
    res.redirect("/login");
    
  }
  }

module.exports = {userRouter};
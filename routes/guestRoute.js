const express = require("express");
const router = express.Router();
const {GetGuestArticles} = require ('../controllers/guestController')
const {pool} = require ('../dbConfig')
router.get('/', (req, res) => {
    res.render('Landingpage.ejs');
  });

router.get("/list", (req, res) => {
    pool.query(
        `SELECT * from articles`,
        (err, results) => {
            res.render("guestlist", {
                articles: results.rows
            });
        } 
    )
});

router.get('/article/:id', GetGuestArticles)

function checkAuthenticated(req, res, next) {
    if (req.user) {
      next();
    }
   else{
    req.flash('success_msg', 'You need to be authenticated to access this page');
    res.redirect("/login");
    
  }
  }

module.exports = {router};
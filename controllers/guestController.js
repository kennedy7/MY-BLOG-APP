const passport = require ('passport')
const bcrypt = require('bcrypt')
const { pool } = require("../dbConfig");

exports.GetGuestArticles = function (req, res) {
  const id =req.params.id
    pool.query(
        'SELECT * FROM articles  WHERE id= $1', [id],
        (error, results) => {
            res.render('guestarticles', {
              article: results.rows[0],
              isAuthenticated: req.user
            
            });
        });

}

const passport = require ('passport')
const bcrypt = require('bcrypt')
const { pool } = require("../dbConfig");


exports.signupUser = async function (req, res) {
    const {
      name,
      email,
      password,
      password2
    } = req.body;
    
    console.log({
      name,
      email,
      password,
      password2,
    });
  
    let errors = [];
  
      if (!name || !email || !password || !password2) {
        errors.push({
          message: "please enter all fields"
        });
      }
      if (password.length < 6) {
        errors.push({
          message: "password should be atleast 6 characters"
        });
      }
      if (password != password2) {
        errors.push({
          message: " passwords do not match"
        });
      }
      if (errors.length > 0) {
        res.render("register", {
          errors
        });
      } else {
      //Form validation successful
      let hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
  
      pool.query(
        `SELECT * FROM blogusers
      WHERE email  = $1`,
        [email],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);
  
          if (results.rows.length > 0) {
            errors.push({
              message: "Email already exist"
            });
            res.render("register", { errors});
          } else {
            pool.query(
              `INSERT INTO blogusers(name, email, password)
                  VALUES($1, $2, $3)
                  RETURNING id, password`,
              [name, email, hashedPassword],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "you are now registered, Please login");
                res.redirect("/login");
              }
            );
          }
        }
      );
    }
  };
  
 
exports.GetArticles = function (req, res) {
  const id = req.params.id
  pool.query(
      'SELECT * FROM articles WHERE id =$1', [id],
      (error, results) => {
          res.render('userarticles', {
            user:req.user.name,
            article: results.rows[0],
            isAuthenticated: req.user
          
          });
      });
}


  

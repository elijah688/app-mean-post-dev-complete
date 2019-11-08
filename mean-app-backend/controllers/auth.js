
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const JWK_SECRET = 'super_secret_secret';


exports.createUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, 12)
    .then(hashedPass=>{
      const user = new User({
        username:username,
        password:hashedPass,
      });
      user.save()
        .then(()=>{
          res.status(200).json({
            message: "(200) SUCCESS: USER CREATED!"
          });
        })
        .catch((err) => {
          res.status(500)
          next(err);
        })
      })
    .catch((err) => {
      res.status(500);
      next(err);
    });
}


exports.isEmailUnique = (req, res, next) => {
  const email = req.params.email;
  User.findOne({username: email})
    .then(user=>{
      if(user!==null){
        res.status(200).json({isUnique: false})
      }
      else{
        res.status(200).json({isUnique: true})
      }
    })
    .catch((err) => {
      res.status(500);
      next(err);
    });
  }


exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username:username})
    .then(user=>{
      if(user===null){
        res.status(401).json({
          message:"Wrong credentials."
        });
      }
      else {
        const passHash = user.password;
        bcrypt.compare(password, passHash)
          .then(check=>{
            if(check===true){
              const token = jwt.sign({id: user._id, username: user.username}, JWK_SECRET, { expiresIn: '1h' });
              res.status(200).json({
                token:token,
                id: user._id
              });
            }
            else{
              res.status(401).json({
                message:"Wrong credentials!"
              });
            }
          })
          .catch((err) => {
            res.status(500)
            next(err);
          })
        }
      })
      .catch((err) => {
        res.status(500)
        next(err);
      });
  }

const mongoose = require('mongoose');
const Post = require('./post');
const unique = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.plugin(unique);


module.exports = mongoose.model('User', userSchema );

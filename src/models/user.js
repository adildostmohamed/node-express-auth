import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

//create a new schema for a user
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//Presave hook on userModelClass to encrypt password before saving to database
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

//Add a method to the userSchema which compares a candidate password provided with the user password
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

//create a new userClass using the new Schema
const userModelClass = mongoose.model('user', userSchema);

//export the userModelClass
export default userModelClass;

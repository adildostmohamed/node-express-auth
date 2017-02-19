import User from '../../models/user';
import passport from 'passport';
import LocalStrategy from 'passport-local';

//Create a local passport Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  //verify the email and password combination, call done with the user
  User.findOne({ email }, (err, user) => {
    if(err) {
      return done(err);
    }
    if(!user) {
      return done(null, false);
    }

    //if a user was found, compare the candidate password provided with the hashed stored password
    user.comparePassword(password, (err, isMatch) => {
      if(err) {
        return done(err);
      }
      if(!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

//tell passport to use this local Strategy
passport.use(localLogin);

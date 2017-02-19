import User from '../../models/user';
import config from '../../config';
import passport from 'passport';
import passportJwt from 'passport-jwt';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

//Setup options for Jwt Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
}

//Create the Jwt passport Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //Check if the userID in the payload exists in our database
  User.findById(payload.sub, (err, user) => {
    if(err) {
      return done(err, false);
    }
    //If it does, call done with that user
    //If it does not call done without the user
    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//tell passport to use this JwtStrategy
passport.use(jwtLogin);

import User from '../models/user';
import jwt from 'jwt-simple';
import config from '../config';

//return a jwt for a user
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  //use the jwt-simple library to create a jwt using the subject as the userid and a secret created by us
  return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

//function called when the user posts to the sign in route, which will first pass through the middleware
export function signin(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

//function called when user posts to the signup router in the router
export function signup(req, res, next) {
  //pull off the email and password from the request body
  const email = req.body.email;
  const password = req.body.password;

  //make sure that the request includes both an email and password, if not return an error
  if(!email || !password) {
    return res.status(422).send({code: "001", error: 'You must provide an email and password'})
  }

  //check if the email address provided already exists
  User.findOne({ email: email}, (err, existingUser)=> {
    if(err) {
      return next(err);
    }
    //if an existingUser was found, return an error
    if(existingUser) {
      return res.status(422).send({code: "002", error: `A user with the email address ${email} already exists`})
    }
    //create a new user using the userModelClass if the user did not exist
    const user = new User({ email, password});
    //save the newly created user
    user.save((err) => {
      if(err) {
        return next(err);
      }
      //respond to the request indicating that a user was successfully created
      res.json({ token: tokenForUser(user)});
    });
  });
}

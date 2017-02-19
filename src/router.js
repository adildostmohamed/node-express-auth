import passport from 'passport';
import { signup, signin } from './routerControllers/authentication';
import passportJwtService from './services/auth/passport_jwt';
import passportLocalService from './services/auth/passport_local';

//A middleware handler that checks if the user has a valid jwt before proceeding to the route
const requireAuth = passport.authenticate('jwt', { session: false });
//A middleware that checks if the user is signed in using passport local strategy before continuing
const requireSignin = passport.authenticate('local', { session: false});

export default function router(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is 123ABC'});
  });
  app.post('/signin', requireSignin, signin);
  app.post('/signup', signup);
}

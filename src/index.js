import express from 'express';
const app = express();
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './router';


//=========================
// DB SETUP
// ========================

mongoose.connect('mongodb://localhost/auth_app');

//=========================
// APP SETUP
// ========================
//logging requests with morgan
app.use(morgan('combined'));

//use bodyParser
app.use(bodyParser.json({type: '*/*'}));

//use the imported router function
router(app);

//=========================
// SERVER SETUP
// ========================
//SET PORT AND RUN SERVER
const port = process.env.PORT || 3090;
app.listen(port, () => {
  console.log(`Looks like we're cooking on port ${port}`);
});

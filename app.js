const express = require('express');
// const User = require('./model/User');
const cookieParser = require('cookie-parser');
const http = require('http');
const authRoute = require('./routes/auth');
const jobRoute = require('./routes/job');
const cors = require('cors');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const mongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

const server = http.createServer(app)
const MONGO_URI = "mongodb+srv://techmini1234:tech1mini@cluster0.euerznh.mongodb.net/jobs";
// const store = new mongoDbStore({
//     uri:MONGO_URI,
//     collection:"session"
// });
// app.use(session({
//     secret: "secretKey",
//     resave: false,
//     cookie: { httpOnly: false },
//     saveUninitialized: true,
//     store: store,
// }));
app.use(authRoute);

// app.use((req, res, next) => {
//     // console.log("session",req.session);
//     if (!req.session.user) {
//       return next();
//     }
//     User.findById(req.session.user._id)
//       .then((user) => {
//         if (!user) {
//           return next();
//         }
//         req.user = user;
//         next();
//       })
//       .catch((err) => {
//         throw new Error(err);
//       });
//   });
   
  app.use(jobRoute);

mongoose.connect(MONGO_URI).then(()=>{
    server.listen(5000);
    console.log("connected");
}).catch(err => {
    console.log(err);
});

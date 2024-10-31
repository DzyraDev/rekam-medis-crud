// import express from "express"
// import cors from "cors"
// import session from "express-session"
// import dotenv from 'dotenv'
// import db from "./config/Database.js"
// import SequelizeStore from "connect-session-sequelize"
// import UserRoute from "./routes/UserRoute.js"
// import PasienRoute from "./routes/PasienRoute.js";
// import DokterRoute from "./routes/DokterRoute.js";
// import AntrianRoute from "./routes/AntrianRoute.js";
// import RekamMedisRoute from "./routes/RekamMedisRoute.js";
// import AuthRoute from "./routes/AuthRoute.js"
// dotenv.config();

// (async()=> {
//     await db.sync()
// })()
// const app = express()

// const sessionStore = SequelizeStore(session.Store);

// const store = new sessionStore({
//     db: db
// })

// app.use(session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store,
//     cookie: {
//         secure: 'auto'
//     }
// }))

// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:3000'
// }))

// app.use(express.json())
// app.use(UserRoute)
// app.use(PasienRoute);
// app.use(AuthRoute)
// app.use(DokterRoute);
// app.use(AntrianRoute);
// app.use(RekamMedisRoute);

// // store.sync();
// app.listen(process.env.APP_PORT, () =>{
//     console.log('Server is running in server....')
// })

import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import PasienRoute from "./routes/PasienRoute.js";
import DokterRoute from "./routes/DokterRoute.js";
import AntrianRoute from "./routes/AntrianRoute.js";
import RekamMedisRoute from "./routes/RekamMedisRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import User  from "./models/UserModel.js";
import { Pasien, associate as associatePasien } from "./models/PasienModel.js";
import { Dokter, associate as associateDokter } from "./models/DokterModel.js";
import {
  RekamMedis,
  associate as associateRekamMedis,
} from "./models/RekamedisModel.js";

import { Antrian, associate as associateAntrian } from "./models/AntrianModel.js";

dotenv.config();

const app = express();
const sessionStore = SequelizeStore(session.Store);

// (async () => {
//   await db.sync();
// })();

const store = new sessionStore({
  db: db,
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// Call associate functions
const models = { User, Pasien, Dokter, RekamMedis, Antrian };
associatePasien(models);
associateDokter(models);
associateRekamMedis(models);
associateAntrian(models);

// Route setup
app.use(UserRoute);
app.use(PasienRoute);
app.use(AuthRoute);
app.use(DokterRoute);
app.use(AntrianRoute);
app.use(RekamMedisRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server is running on port " + process.env.APP_PORT);
});

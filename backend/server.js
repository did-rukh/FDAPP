
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const createAdmin = require("./utils/createAdmin");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const restaurantRoutes = require("./routes/restaurant");
const errorMiddleware = require("./middlewares/errorMiddleware");
const reviewRoutes = require("./routes/reviewRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   credentials: true,                  //  this code was old one
// }));

// app.use(cors({
//   origin: true,   //  allow dynamic origin        // last used  
//   credentials: true
// }));

// app.use(cors({
//   origin: process.env.FRONTEND_URL, // frontend URL from .env
//   credentials: true
// }));


















// app.use(cors({
//   origin: "http://localhost:5173",   // this is real code work in vscode 
//   credentials: true
// }));




// ---------------- CORS CONFIG ----------------
// Allow frontend localhost and optional deployed frontend
const allowedOrigins = [
  "http://localhost:5173",                   // local frontend
  process.env.FRONTEND_URL                    // deployed frontend (set in Render env vars)
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like Postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));





// Optional logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API is running ");
});
app.use(errorMiddleware);

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await createAdmin(); 
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        // `Server running at http://localhost:${PORT}`);
                `Server running at ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`
      );
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  }); 





// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const createAdmin = require("./utils/createAdmin");
// const authRoutes = require("./routes/auth");
// const adminRoutes = require("./routes/admin");
// const orderRoutes = require("./routes/order");
// const productRoutes = require("./routes/product");
// const restaurantRoutes = require("./routes/restaurant");
// const reviewRoutes = require("./routes/reviewRoutes");
// const errorMiddleware = require("./middlewares/errorMiddleware");

// const app = express();


// // Middleware

// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = [
//   "http://localhost:5173",
//   process.env.FRONTEND_URL 
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));


// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/restaurants", restaurantRoutes);
// app.use("/api/reviews", reviewRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

// app.use(errorMiddleware);


// mongoose.set("strictQuery", true);

// mongoose.connect(process.env.MONGODB_URI)
//   .then(async () => {
//     console.log("MongoDB connected");

//     await createAdmin();

//     const PORT = process.env.PORT || 5000;
//     console.log(`Server running at ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
//     app.listen(PORT);
//   })
//   .catch(err => {
//     console.error("MongoDB connection error:", err);
//   });
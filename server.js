//~ PROJECT_NAME = مهرجان الكرازة بكنيسة العذراء مريم والقديس مارمينا
//~ AUTHOR = Maro Asam

const express = require("express");
const database = require("./config/database");
require("dotenv").config();
const AuthRouter = require("./routes/auth.routes");
const UsersRouter = require("./routes/users.routes");
const ProjectsRouter = require("./routes/project.routes");
const CommentsRouter = require("./routes/comments.routes");
const CategoriesRouter = require("./routes/categories.routes");
const { errorHandler, notFound } = require("./errors/errorHandler");
const cors = require("cors");

//~ DATABASE CONNECTION
database();

const app = express();

//~ MIDDLEWARES
app.use(express.json());

//~ CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow all HTTP methods
    credentials: true, // Enable credentials (cookies)
    exposedHeaders: ["X-Total-Count"], // Expose the total count of records in the response header
  })
);

//~ ROUTES
app.use("/api/auth", AuthRouter);
app.use("/api/users", UsersRouter);
app.use("/api/projects", ProjectsRouter);
app.use("/api/comments", CommentsRouter);
app.use("/api/categories", CategoriesRouter);

//! ERROR HANDLING MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `01- Server started Successfully on port ${PORT} & Running in ${process.env.NODE_ENV} Mode ✅`
  )
);

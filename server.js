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

//~ ميدل وير لتفسير JSON
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // السماح فقط بالطلبات من هذا الأصل المحدد
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    "Access-Control-Allow-Origin" : "*"
  })
);

//~ تعريف التوجيهات (Routes)
app.use("/api/auth", AuthRouter);
app.use("/api/users", UsersRouter);
app.use("/api/projects", ProjectsRouter);
app.use("/api/comments", CommentsRouter);
app.use("/api/categories", CategoriesRouter);

//! ميدل وير لمعالجة الأخطاء
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `01- Server started Successfully on port ${PORT} & Running in ${process.env.NODE_ENV} Mode ✅`
  )
);

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

//~ إعدادات CORS
app.use(
  cors({
    origin: "https://keraza-frontend.vercel.app", // السماح بالطلبات من هذا الأصل
    methods: ["GET", "POST", "PUT", "DELETE"], // السماح بكل أنواع الطلبات
    credentials: true, // السماح بإرسال ملفات تعريف الارتباط (cookies)
    exposedHeaders: ["X-Total-Count"], // تعريض رأس خاص بعدد السجلات في الاستجابة
  })
);


//~ إعداد رؤوس CORS يدويًا
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://keraza-frontend.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to Keraza API ✅");
})


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
